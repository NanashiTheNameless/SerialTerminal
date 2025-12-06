// Application-wide constants

// Serial port configuration
export const BAUD_RATES = [
  // Legacy rates (< 1200)
  50, 75, 110, 134, 150, 200, 300, 600,
  // Low speed (1200-9600)
  1200, 1800, 2400, 4800, 7200, 9600,
  // Medium speed (14400-76800)
  14400, 19200, 28800, 31250, 38400, 56000, 57600, 72000, 74880, 76800,
  // High speed (100000-921600)
  100000, 115200, 125000, 128000, 153600, 230400, 250000, 256000, 307200, 460800, 500000, 576000, 614400, 748800, 921600,
  // Very high speed (1M+)
  1000000, 1500000, 2000000, 3000000, 4000000
]

// Line ending options
export const LINE_ENDING_VALUES = {
  NONE: 'none',
  LF: '\n',
  CR: '\r',
  CRLF: '\r\n'
}

export const LINE_ENDING_LABELS = {
  NONE: 'None',
  LF: 'LF (\\n)',
  CR: 'CR (\\r)',
  CRLF: 'CRLF (\\r\\n)'
}

// Download format options
export const DOWNLOAD_FORMATS = {
  ASK: 'ask',
  TXT: 'txt',
  CSV: 'csv',
  JSON: 'json',
  MD: 'md'
}

export const DOWNLOAD_FORMAT_LABELS = {
  ASK: 'Ask each time',
  TXT: 'Plain Text (.txt)',
  CSV: 'CSV (.csv)',
  JSON: 'JSON (.json)',
  MD: 'Markdown (.md)'
}

// Control characters
export const CTRL_C = '\x03'
export const CTRL_D = '\x04'

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  CLEAR_TERMINAL: {
    key: 'l',
    ctrl: true,
    label: 'Ctrl+L',
    description: 'Clear terminal',
    settingKey: 'clearShortcut'
  },
  OPEN_SETTINGS: {
    key: 'k',
    ctrl: true,
    label: 'Ctrl+K',
    description: 'Open settings',
    settingKey: 'settingsShortcut'
  }
}

// Default settings
export const DEFAULT_SETTINGS = {
  baudRate: 115200,
  lineEnding: LINE_ENDING_VALUES.CRLF,
  localEcho: true,
  timestamp: true,
  detectCtrlC: true,
  detectCtrlD: true,
  settingsShortcut: true,
  clearShortcut: true,
  downloadFormat: 'ask',
  settingsShortcutKey: KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key,
  clearShortcutKey: KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key,
  settingsShortcutShift: false,
  clearShortcutShift: false,
  customControlAliases: [],
  commandKeybinds: [],
  parseANSIOutput: true,
  advanced: false,
  enableQuickHotkeys: true,
  quickFocusKey: 'i',
  quickFocusShift: false,
  quickHistoryKey: 'h',
  quickHistoryShift: false,
  quickDownloadKey: 'd',
  quickDownloadShift: false,
  quickClearKey: 'c',
  quickClearShift: false,
  quickSettingsKey: 's',
  quickSettingsShift: false
}

// UI constants
export const TOAST_DURATION = 3000 // milliseconds
export const MAX_HISTORY_LENGTH = 1000 // maximum terminal history items
