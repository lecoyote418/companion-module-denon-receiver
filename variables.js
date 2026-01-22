module.exports = async function (self) {
	self.setVariableDefinitions([
		{ name: 'Master Power', variableId: 'master_power' },
		{ name: 'Master Volume Level', variableId: 'master_volume' },
		{ name: 'Master Mute', variableId: 'master_mute' },
		{ name: 'Source Input', variableId: 'source_input' },
		// Zone 2
		{ name: 'Z2 Power', variableId: 'z2_power' },
		{ name: 'Z2 Volume Level', variableId: 'z2_volume' },
		{ name: 'Z2 Mute', variableId: 'z2_mute' },
		{ name: 'Z2 Source Input', variableId: 'z2_source_input' },

		// Zone 3
		{ name: 'Z3 Power', variableId: 'z3_power' },
		{ name: 'Z3 Volume Level', variableId: 'z3_volume' },
		{ name: 'Z3 Mute', variableId: 'z3_mute' },
		{ name: 'Z3 Source Input', variableId: 'z2_source_input' },
	])
}
