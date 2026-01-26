const { getEnabledParams } = require('./denon')

module.exports = function (self) {
	const params = getEnabledParams(self.config)

	const variables = params
		.filter((p) => p.type !== 'command')
		.map((p) => ({
			variableId: p.id,
			name: p.name ?? p.id,
		}))

	self.setVariableDefinitions(variables)
}
