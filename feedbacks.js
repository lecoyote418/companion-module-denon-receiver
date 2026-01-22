const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		master_volume: {
			type: 'boolean',
			name: 'Master Volume Level',
			description: 'If the Master Volume is equal to, above or below a certain level',
			options: [
				{
					type: 'dropdown',
					label: 'Master Volume Comparison',
					id: 'mv_comparison',
					default: 'equal',
					choices: [
						{ id: 'equal', label: 'Equal To' },
						{ id: 'above', label: 'Above' },
						{ id: 'below', label: 'Below' },
					],
				},
				{
					type: 'number',
					label: 'Master Volume Level',
					id: 'master_volume',
					default: 50,
					min: 0,
					max: 98,
				},
			],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 165, 0),
			},
			callback: (feedback) => {
				if (self.volume === undefined) {
					return false
				}
				const level = feedback.options.volume_level
				switch (feedback.options.volume_comparison) {
					case 'equal':
						return self.master_volume === level
					case 'above':
						return self.master_volume > level
					case 'below':
						return self.master_volume < level
				}
				return false
			},
		},
		source_input: {
			type: 'boolean',
			name: 'Source Input',
			description: 'If the Input Source matches the selected source',
			options: [
				{
					type: 'dropdown',
					id: 'si_compare',
					label: 'Input Source Type',
					default: 'GAME',
					// choices: ,   // TODO
				},
			],
			defaultStyle: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 255, 0),
			},
			callback: (feedback) => {
				if (self.input === undefined) {
					return false
				}
				return self.input === feedback.options.input_source + feedback.options.input_number
			},
		},
	})
}