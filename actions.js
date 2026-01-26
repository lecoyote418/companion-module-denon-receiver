const { getEnabledParams } = require('./denon')

module.exports = function(instance) {
    const params = getEnabledParams(instance.config) || []

    const actions = {} // single object to hold all actions

    params.forEach(param => {
        if (!param.id || (!param.prefix && !param.command)) return

        let options = []

        switch (param.type) {
            case 'number':
                options.push({
                    type: 'number',
                    label: param.name,
                    id: 'value',
                    min: param.options?.min ?? 0,
                    max: param.options?.max ?? 100,
                    step: param.options?.step ?? 1,
                })
                break
            case 'enum':
                if (Array.isArray(param.values) && param.values.length > 0) {
                    options.push({
                        type: 'dropdown',
                        label: param.name,
                        id: 'value',
                        choices: param.values.map(v => ({ id: v, label: v })),
                    })
                }
                break
            case 'ascii':
            case 'mixed':
                options.push({
                    type: 'textinput',
                    label: param.name,
                    id: 'value',
                })
                break
            case 'command':
                options = [] // no input
                break
        }

        actions[param.id] = {
            name: param.name,
            options,
			callback: async (action) => {
				let commandStr = param.command ?? param.prefix
				switch (param.type) {
					case 'number':
					case 'ascii':
					case 'enum':
					case 'mixed':
						commandStr += action.options.value
						break
					case 'command':
						// already set
						break
				}
				instance.sendCommand(commandStr) // now works!
				instance.log('debug', `Action sent: ${commandStr}`)
			}
		}

    })

    // Call once to define all actions
    instance.setActionDefinitions(actions)
    instance.log('debug', `All ${Object.keys(actions).length} actions defined`)
}

