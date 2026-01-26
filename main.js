const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base');
const UpgradeScripts = require('./upgrades');
const UpdateActions = require('./actions');
const UpdateFeedbacks = require('./feedbacks');
const UpdateVariableDefinitions = require('./variables');
const presets = require('./presets');
const { MAP_GROUPS } = require('./denon'); // protocol definitions
const { getEnabledParams } = require('./denon')


class ModuleInstance extends InstanceBase {
    constructor(internal) {
        super(internal);
        Object.assign(this, { ...presets });
        this.MAP_GROUPS = [];
    }

	async init(config) {
		this.config = config;


		this.initConnection();
		this.RESPONSE_MAP = await this.buildResponseMap();
		this.log('debug', 'RESPONSE_MAP built:');
		this.RESPONSE_MAP.forEach(r => {
			if (r.param) {
				this.log(
					'debug',
					`Command: ${r.param.id}, Prefix: ${r.param.prefix}, Type: ${r.param.type}, Regex: ${r.regex}`
				);
			}
		});
		this.updateActions();

		this.updateFeedbacks();
		this.updateVariableDefinitions();
		this.initPresets();
	}

	async buildResponseMap() {

		let params = getEnabledParams(this.config) || []

		if (!Array.isArray(params)) {
			this.log('warn', 'getEnabledParams() returned invalid value, defaulting to empty array')
			params = []
		}

		// Debug log each param
		params.forEach(p => this.log('debug', `Param: ${p.id ?? 'unknown'}, type: ${p.type ?? 'undefined'}`))

		const responseMap = params
			.filter(param => param.type !== 'command') // commands have no responses
			.flatMap((param, index) => {
				if (!param.type) {
					this.log('warn', `Skipping param ${param.id ?? 'unknown'}: no type defined`)
					return []
				}

		const priority = param.priority ?? (1000 - index) // default descending priority

		switch (param.type) {
			case 'enum':
				if (!Array.isArray(param.values) || param.values.length === 0) {
					this.log('warn', `Param ${param.id} has type 'enum' but values are missing or invalid, skipping`)
					return []
				}
				return [{
					param,
					priority,
					regex: new RegExp(`^${param.prefix}(${param.values.join('|')})$`),
					parser: m => m[1],
				}]

			case 'number': {
				const digits = param.digits ?? param.options?.digits
				if (!digits) {
					this.log('warn', `Param ${param.id} has type 'number' but digits not defined, skipping`)
					return []
				}

				// If digits is a number, convert to [digits, digits]
				const [min, max] = Array.isArray(digits) ? digits : [digits, digits]

				return [{
					param,
					priority,
					regex: new RegExp(`^${param.prefix}(\\d{${min},${max}})$`),
					parser: m => parseInt(m[1], 10),
				}]
			}


			case 'ascii':
				return [{
					param,
					priority,
					regex: new RegExp(`^${param.prefix}([A-Z0-9\\/]+)$`),
					parser: m => m[1],
				}]

			case 'mixed': {
				const matchers = []

				if (Array.isArray(param.options?.enum) && param.options.enum.length) {
					matchers.push({
						param,
						priority, // enum has higher priority
						regex: new RegExp(`^${param.prefix}(${param.options.enum.join('|')})$`),
						parser: m => m[1],
					})
				}

				if (param.options?.number) {
					const digits = param.options.number.digits ?? 2
					matchers.push({
						param,
						priority: priority - 1, // lower than enum
						regex: new RegExp(`^${param.prefix}(\\d{${digits}})$`),
						parser: m => parseInt(m[1], 10),
					})
				}

				if (matchers.length === 0) {
					this.log('warn', `Param ${param.id} has type 'mixed' but no enum or number options, skipping`)
				}

				return matchers
			}

			default:
				this.log('warn', `Param ${param.id} has unknown type '${param.type}', skipping`)
				return []
            }
        })
    return responseMap.sort((a, b) => b.priority - a.priority)
}


    async initConnection() {
        if (this.socket) {
            this.socket.destroy();
            delete this.socket;
        }

        if (this.config.host) {
            this.updateStatus(InstanceStatus.Connecting);
            this.socket = new TCPHelper(this.config.host, 23);

            this.socket.on('status_change', (status, message) => {
                this.updateStatus(status, message);
            });

            this.socket.on('error', (err) => {
                this.updateStatus(InstanceStatus.ConnectionFailure, err.message);
                this.log('error', 'Network error: ' + err.message);
            });

            this.socket.on('data', (data) => {
                this.receiveResponse(data);
            });
        } else {
            this.updateStatus(InstanceStatus.BadConfig);
        }
    }

	async sendCommand(command) {
			if (this.socket && this.socket.on) {
				this.log('debug', `TX: ${command}`)
				this.socket.send(`${command}\r`)
			} else {
				this.log('warn', `Cannot send command "${command}", socket not connected. Queuing...`)
				// Optional: queue commands until socket connects
				this._queuedCommands = this._queuedCommands || []
				this._queuedCommands.push(command)
			}
		}


    async receiveResponse(data) {
        const lines = data.toString().split('\r');

        for (const line of lines) {
            if (!line) continue;

            this.log('debug', `RX: ${line}`);

            for (const def of this.RESPONSE_MAP) {
                const match = line.match(def.regex);
                if (match) {
                    const value = def.parser(match);

					this.setVariableValues({
						[def.param.id]: def.parser(match),
					})

					this.checkFeedbacks();
                    break; // stop after first match
                }
            }
        }
    }

    async destroy() {
        this.log('debug', 'destroy');
        if (this.socket) {
            this.socket.destroy();
        }
    }

    async configUpdated(config) {
        if (config.host !== this.config.host) {
            this.config = config;
            this.initConnection();
        }
    }

    getConfigFields() {
        return [
            {
                type: 'textinput',
                id: 'host',
                label: 'Target IP',
                width: 8,
                regex: Regex.IP,
            },
		...Object.entries(MAP_GROUPS).map(([id, group]) => ({
			type: 'checkbox',
			id: `enable_${id}`,
			label: group.label,
			default: group.default,
		})),
        ];
    }

	updateActions() {
		UpdateActions(this)
	}


    updateFeedbacks() {
        UpdateFeedbacks(this);
    }

    updateVariableDefinitions() {
        UpdateVariableDefinitions(this);
    }
}

runEntrypoint(ModuleInstance, UpgradeScripts);
