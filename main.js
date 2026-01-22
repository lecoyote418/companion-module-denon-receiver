const { InstanceBase, Regex, runEntrypoint, InstanceStatus, TCPHelper } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const presets = require('./presets')

const RESPONSE_MAP = [
	{
		regex: /^PW(.+)$/,
		variable: 'master_power',
		parser: (m) => m[1],
	},
	{
		regex: /^MV(\d{2,3})$/,
		variable: 'master_volume',
		parser: (m) => parseInt(m[1], 10),
	},
	{
		regex: /^MU(.+)$/,
		variable: 'master_mute',
		parser: (m) => m[1],
	},
	{
		regex: /^SI(.+)$/,
		variable: 'source_input',
		parser: (m) => m[1],
	},
	// {
	// 	regex: /^Z2(.+)$/,
	// 	variable: 'z2_power',
	// 	parser: (m) => m[1],
	// },
	// {
	// 	regex: /^Z2(.+)$/,
	// 	variable: 'z2_source', // TODO
	// 	parser: (m) => m[1],
	// },
	{
		regex: /^Z2MU(.+)$/,
		variable: 'z2_mute',
		parser: (m) => m[1],
	},

]

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		Object.assign(this, { ...presets })
	}

	async init(config) {
		this.config = config

		this.initConnection()
		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
		this.initPresets()
	}

	async initConnection() {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}


		if (this.config.host) {
			this.updateStatus(InstanceStatus.Connecting)
			this.socket = new TCPHelper(this.config.host, 23)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})
			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})
			this.socket.on('data', (data) => {
				this.receiveResponse(data)
			})
			
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	async receiveResponse(data) {
		const lines = data.toString().split('\r')

		for (const line of lines) {
			if (!line) continue

			this.log('debug', `RX: ${line}`)

			for (const def of RESPONSE_MAP) {
				const match = line.match(def.regex)
				if (match) {
					const value = def.parser(match)

					this.setVariableValues({
						[def.variable]: value,
					})

					this.checkFeedbacks()
					break
				}
			}
		}
	}

	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
		if (this.socket) 
			{this.socket.destroy()
		}
	}

	async configUpdated(config) {
		if (config.host !== this.config.host) {
			this.config = config
			this.initConnection()
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				regex: Regex.IP,
			},
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
