const { values } = require("./upgrades")

const SOURCE_MAP = {
	PHONO: 'PHONO',
	CD: 'CD',
	TUNER: 'TUNER',
	DVD: 'DVD',
	BD: 'BluRay',
	HDP: 'HDP',
	TV: 'TV',
	SAT: 'SAT',
	MPLAY: 'Media',
	GAME: 'Game',
	HDRADIO: 'HD',
	NET: 'NET',
	PANDORA: 'Pandora',
	SIRIUSXM: 'SiriusXM',
	SPOTIFY: 'Spotify',
	LASTFM: 'LastFM',
	FLICKR: 'Flickr',
	IRADIO: 'iRadio',
	SERVER: 'Server',
	FAVORITES: 'Favorites',
	VCR: 'VCR',
	DVR: 'DVR',
	V: 'V',
	AUX1: 'Aux1',
	AUX2: 'Aux2',
	AUX3: 'Aux3',
	AUX4: 'Aux4',
	BT: 'Bluetooth',
	NET: 'NET',
	XM: 'XM',
	'8K': '8K',
	IPOD: 'iPod',
	SOURCE: 'Same as Master',
}

// MS modes
const SURROUND_MODE_MAP = {
    'MOVIE': 'Movie',
    'MUSIC': 'Music',
    'GAME': 'Game',
    'DIRECT': 'Direct',
    'PURE DIRECT': 'PUre Direct',
    'STEREO': 'Stereo',
    'STANDARD': 'Standard',
    'DOLBY DIGITAL': 'Dolby Digital',
    'DTS SURROUND': 'Dts Surround',
    'MCH STEREO': 'Mch Stereo',
    'ROCK ARENA': 'Rock Arena',
    'JAZZ CLUB': 'Jazz Club',
    'MONO MOVIE': 'Mono Movie',
    'MATRIX': 'Matrix',
    'VIDEO GAME': 'Video Game',
    'VIRTUAL': 'Virtual',
    'QUICK1': 'Quick1',
    'QUICK2': 'Quick2',
    'QUICK3': 'Quick3',
    'QUICK4': 'Quick4',
    'QUICK5': 'Quick5',
    'QUICK1 MEMORY': 'Quick1 Memory',
    'QUICK2 MEMORY': 'Quick2 Memory',
    'QUICK3 MEMORY': 'Quick3 Memory',
    'QUICK4 MEMORY': 'Quick4 Memory',
    'QUICK5 MEMORY': 'Quick5 Memory',
}

const MAIN_ZONE_MAP = {
    'ON': 'ON',
    'OFF': 'OFF',
    'FAVORITE1': 'Main Zone Favorite Station 1 Select',
    'FAVORITE2': 'Main Zone Favorite Station 2 Select',
    'FAVORITE3': 'Main Zone Favorite Station 3 Select',
    'FAVORITE1 MEMORY': 'Main Zone Favorite Station 1 Memory',
    'FAVORITE2 MEMORY': 'Main Zone Favorite Station 2 Memory',
    'FAVORITE3 MEMORY': 'Main Zone Favorite Station 3 Memory',
}

// PSMULTEQ modes
const MULTIEQ_MAP = {
    'AUDYSSEY': 'MultiEQ/XT Audyssey',
    'BYP.LR': 'MultiEQ/XT Music',
    'FLAT': 'MultiEQ/XT Flat',
    'MANUAL' : 'MultiEQ/XT Manual',
    'OFF' : 'MultiEQ/XT Off',
}

const SOURCE_PRIORITY_MAP = {
    'AUTO': 'Set AUTO mode (Priority:HDMI>>DIGITAL>>ANALOG)',
    'HDMI': 'Set force HDMI INPUT mode',
    'DIGITAL': 'Set force DIGITAL INPUT (Optical,Coaxial)',
    'ANALOG': 'set force ANALOG INPUT mode',
}

const DIGITAL_MODE_MAP = {
    'AUTO': 'Set DIGITAL INPUT AUTO mode',
    'SAT/CBL': 'Set DIGITAL INPUT force PCM mode',
    'SOURCE': 'VIDEO SELECT mode cancel',
}
// PSDYNVOL modes
const DYNVOL_MAP = {
    'HEV': 'Heavy',
    'MED': 'Medium',
    'LIT': 'Light',
    'OFF': 'OFF',
}
const ZONE_FAVORITES_MAP = {
    'FAVORITE1': 'Zone Favorite Station 1',
    'FAVORITE2': 'Zone Favorite Station 2',
    'FAVORITE3': 'Zone Favorite Station 3',
    'QUICK1': 'Zone Quick1',
    'QUICK2': 'Zone Quick2',
    'QUICK3': 'Zone Quick3',
    'QUICK4': 'Zone Quick4',
    'QUICK5': 'Zone Quick5',
    'QUICK1 MEMORY': 'Zone Quick1 Memory',
    'QUICK2 MEMORY': 'Zone Quick2 Memory',
    'QUICK3 MEMORY': 'Zone Quick3 Memory',
    'QUICK4 MEMORY': 'Zone Quick4 Memory',
    'QUICK5 MEMORY': 'Zone Quick5 Memory',
}
const ROOM_SIZE_MAP = {
    'S': 'Small',
    'MS': 'Medium-Small',
    'ML': 'Medium-Large',
    'L': 'Large',
}

 const MAIN_PARAMETER_MAP = {
  power: { id: 'power', name: 'Main Power', prefix: 'PW', type: 'enum', values: ['ON','STANDBY'] },
  master_volume: { id: 'master_volume', name: 'Master Voume', prefix: 'MV', type: 'number', digits: [2,3] },
  mute: { id: 'mute', prefix: 'MU', name: 'Master Mute', type: 'enum', values: ['ON','OFF'] },
  source_input: { id: 'source_input', name: 'Source Input', prefix: 'SI', type: 'ascii', map: SOURCE_MAP },
  sleep: { id: 'sleep', name: 'Sleep Timer', prefix: 'SLP', type: 'number', digits: [1,3] },
  main_zone_power: { id: 'main_zone_power', name: 'Main Zone ON/OFF', prefix: 'ZM', type: 'ascii', values: MAIN_ZONE_MAP },
  source_priority: { id: 'source_priority', name: 'Source Priority', prefix: 'SD', type: 'ascii', values: SOURCE_PRIORITY_MAP },
  digital_mode: { id: 'digital_mode', name: 'Digital Format', prefix: 'SD', type: 'ascii', values: DIGITAL_MODE_MAP },
  video_select: { id: 'video_select', name: 'VIDEO SELECT mode set, and select source', prefix: 'SV', type: 'ascii', values: SOURCE_MAP }, /// To be tested
}

const Z2_PARAMETER_MAP = {
  z2_power: { id: 'z2_power', name: 'Zone 2 ON/OFF', prefix: 'Z2', type: 'enum', values: ['ON','OFF'] },
  z2_mute: { id: 'z2_mute', name: 'Zone 2 Mute', prefix: 'Z2MU', type: 'enum', values: ['ON','OFF'] },
  z2_volume: { id: 'z2_volume', name: 'Zone 2 Volume Level', prefix: 'Z2', type: 'number', digits: [2,3] },
  z2_source: { id: 'z2_source', name: 'Zone 2 Source Input', prefix: 'Z2', type: 'ascii', map: SOURCE_MAP },
  z2_sleep: { id: 'z2_sleep', name: 'Zone 2 Sleep Timer', prefix: 'Z2SLP', type: 'number', digits: [1,3] },
  z2_favorites: { id: 'z2_favorites', name: 'Zone 2 Favorites and Quick Select', prefix: 'Z2', type: 'ascii', map: ZONE_FAVORITES_MAP },

}

const Z3_PARAMETER_MAP = {
  z3_power: { id: 'z3_power', name: 'Zone 3 ON/OFF', prefix: 'Z3', type: 'enum', values: ['ON','OFF'] },
  z3_mute: { id: 'z3_mute', name: 'Zone 3 Mute', prefix: 'Z3MU', type: 'enum', values: ['ON','OFF'] },
  z3_volume: { id: 'z3_volume', name: 'Zone 3 Volume Level', prefix: 'Z3', type: 'number', digits: [2,3] },
  z3_source: { id: 'z3_source', name: 'Zone 3 Source Input', prefix: 'Z3', type: 'ascii', map: SOURCE_MAP },
  z3_sleep: { id: 'z3_sleep', name: 'Zone 3 Sleep Timer', prefix: 'Z3SLP', type: 'number', digits: [1,3] },
}

const SURROUND_PARAMETER_MAP = {
  ms: { id: 'ms', prefix: 'MS', type: 'ascii', map: SURROUND_MODE_MAP },
  cv_fl: { id: 'cv_fl', prefix: 'CVFL', type: 'number', digits: [2,2] },
  cv_fr: { id: 'cv_fr', prefix: 'CVFR', type: 'number', digits: [2,2] },
  cv_c: { id: 'cv_c', prefix: 'CVC', type: 'number', digits: [2,2] },
  // …more extended commands here
}

const PS_PARAMETER_MAP = {
  tone_ctrl: { id: 'tone_ctrl', name: 'Tone Control ON/OFF', prefix: 'PSTONE CTRL', type: 'enum', values: ['ON','OFF'] },
  cinema_eq: { id: 'cinema_eq', name: 'Cinema EQ ON/OFF',prefix: 'PSCINEMA EQ', type: 'enum', values: ['ON','OFF'] },
  ps_mode: { id: 'ps_mode', name: 'Tone Mode',prefix: 'PSMODE:', type: 'enum', values: ['MUSIC','CINEMA','GAME','PRO LOGIC'] }, // Different PL modes to be tested
  loundness_management: { id: 'loundness_management', name: 'Loudness Management ON/OFF', prefix: 'PSLOM ', type: 'enum', values: ['ON','OFF'] },
  multi_eq: { id: 'multi_eq', name: 'MultiEQ/XT/XT32 Audyssey Management Mode', prefix: 'PSMULTEQ:', type: 'ascii', values: MULTIEQ_MAP },
  reference_level: { id: 'reference_level', name: 'Reference Level Offset (dB)', prefix: 'PSREFLEV ', type: 'number', digits: [1,2] },
  dynamic_volume: { id: 'dynamic_volume', name: 'Dynamic Volume Level', prefix: 'PSDYNVOL ', type: 'ascii', values: DYNVOL_MAP },
  bass: { id: 'bass', name: 'Bass Level (44 to 56, -6 to +6dB)', prefix: 'PSBAS ', type: 'mixed', options: {enum: ['OFF'], number: {min: 44, max: 56, step: 1, digits: 2 }}},
  bass_up: { id: 'bass_up', name: 'Bass Level Up', command: 'PSBAS UP', type: 'command'},
  bass_down: { id: 'bass_down', name: 'Bass Level Down', command: 'PSBAS DOWN', type: 'command'},
  treble: { id: 'treble', name: 'Treble Level (44 to 56, -6 to +6dB)', prefix: 'TRE ', type: 'mixed', options: {enum: ['OFF'], number: {min: 44, max: 56, step: 1, digits: 2 }}},
  treble_up: { id: 'treble_up', name: 'Treble Level Up', command: 'PSTRE UP', type: 'command'},
  treble_down: { id: 'treble_down', name: 'Treble Level Down', command: 'PSTRE DOWN', type: 'command'},
  dyn_compression: { id: 'dyn_compression', name: 'Dynamic Compression Level', prefix: 'PSDRC ', type: 'enum', values: ['AUTO','LOW','MID','HI','OFF'] },
  lfe: { id: 'lfe', name: 'LFE Level (00 to 99, 0 to -10dB)', prefix: 'PSLFE ', type: 'number', options: {min: 0, max: 99, step: 1, digits: 2 }}, // values to be validated
  lfe_up: { id: 'lfe_up', name: 'LFE Level Up', command: 'PSLFE UP', type: 'command'},
  lfe_down: { id: 'lfe_down', name: 'LFE Level Down', command: 'PSLFE DOWN', type: 'command'},
  eff: { id: 'eff', name: 'Effects Level (00 to 99, 0 to -10dB)', prefix: 'PSEFF ', type: 'number', options: {min: 0, max: 99, step: 1, digits: 2 }}, // values to be validated
  eff_up: { id: 'eff_up', name: 'Effects Level Up', command: 'PSEFF UP', type: 'command'},
  eff_down: { id: 'eff_down', name: 'Effects Level Down', command: 'PSEFF DOWN', type: 'command'},
  delay: { id: 'delay', name: 'Delay (000 to 999, 0 to 999 ms)', prefix: 'PSDEL ', type: 'number', options: {min: 0, max: 999, step: 1, digits: 3 }}, // values to be validated
  delay_up: { id: 'delay_up', name: 'Delay Up', command: 'PSDEL UP', type: 'command'},
  delay_down: { id: 'delay_down', name: 'Delay Down', command: 'PSDEL DOWN', type: 'command'},
  panorama: { id: 'panorama', name: 'Panorama ON/OFF', prefix: 'PSPAN ', type: 'enum', values: ['ON','OFF'] },
  dimension: { id: 'dimension', name: 'Dimension (0 to 99)', prefix: 'PSDIM ', type: 'number', options: { min: 0, max: 99, step: 1, digits: 2 }},
  dimension_up: { id: 'dimension_up', name: 'Dimension Up', prefix: 'PSDIM UP', type: 'command'},
  dimension_down: { id: 'dimension_down', name: 'Dimension Down', prefix: 'PSDIM DOWN', type: 'command'},
  center_width: { id: 'center_width', name: 'Center Width (0 to 99)', prefix: 'PSCEN ', type: 'number', options: { min: 0, max: 99, step: 1, digits: 2 }},
  center_width_up: { id: 'center_width_up', name: 'Center Width Up', prefix: 'PSCEN UP', type: 'command'},
  center_width_down: { id: 'center_width_down', name: 'Center Width Down', prefix: 'PSCEN DOWN', type: 'command'},
  center_image: { id: 'center_image', name: 'Center Image (0 to 99)', prefix: 'PSCEI ', type: 'number', options: { min: 0, max: 99, step: 1, digits: 2 }},
  center_image_up: { id: 'center_image_up', name: 'Center Image Up', prefix: 'PSCEI UP', type: 'command'},
  center_image_down: { id: 'center_image_down', name: 'Center Image Down', prefix: 'PSCEI DOWN', type: 'command'},
  swr: { id: 'swr', name: 'SW ON/OFF', prefix: 'PSWR ',  type: 'enum', values: ['ON','OFF'] },
  room_size: { id: 'room_size', name: 'Room Size', prefix: 'PSRSZ ', type: 'ascii', values: ROOM_SIZE_MAP },
  audio_delay: { id: 'audio_delay', name: 'Audio Delay (000 to 999, 0 to 999 ms)', prefix: 'PSDELAY ', type: 'number', options: {min: 0, max: 999, step: 1, digits: 3 }}, // values to be validated
  audio_delay_up: { id: 'audio_delay_up', name: 'Audio Delay Up', command: 'PSDELAY UP', type: 'command'},
  audio_delay_down: { id: 'audio_delay_down', name: 'Audio Delay Down', command: 'PSDELAY DOWN', type: 'command'},
  restorer: { id: 'restorer', name: 'Audio Restorer', prefix: 'RSTR ', type: 'enum', values: ['OFF','MODE1','MODE2','MODE3'] },
}

const MAP_GROUPS = {
    main: {
      label: 'Main Commands',
      default: true,
      map: MAIN_PARAMETER_MAP,
    },
    surround: {
      label: 'Surround Modes and Speaker Levels',
      default: false,
      map: SURROUND_PARAMETER_MAP,
    },
    ps: {
      label: 'Tone and Level controls',
      default: false,
      map: PS_PARAMETER_MAP,
    },
    zone2: {
      label: 'Zone 2',
      default: false,
      map: Z2_PARAMETER_MAP,
    },
    zone3: {
      label: 'Zone 3',
      default: false,
      map: Z3_PARAMETER_MAP,
    },
  }


function getEnabledParams(config = {}) {
  const enabled = []

  for (const [id, group] of Object.entries(MAP_GROUPS)) {
    if (config[`enable_${id}`]) {
      enabled.push(...Object.values(group.map))
    }
  }

  return enabled
}

module.exports = {
  MAP_GROUPS,
  getEnabledParams,
}