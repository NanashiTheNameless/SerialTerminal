import PropTypes from 'prop-types'

export const quickHotkeysPropType = PropTypes.shape({
  enabled: PropTypes.bool,
  focus: PropTypes.string,
  history: PropTypes.string,
  download: PropTypes.string,
  clear: PropTypes.string,
  settings: PropTypes.string,
  disconnect: PropTypes.string,
  focusModifier: PropTypes.string,
  historyModifier: PropTypes.string,
  downloadModifier: PropTypes.string,
  clearModifier: PropTypes.string,
  settingsModifier: PropTypes.string,
  disconnectModifier: PropTypes.string,
  focusShift: PropTypes.bool,
  historyShift: PropTypes.bool,
  downloadShift: PropTypes.bool,
  clearShift: PropTypes.bool,
  settingsShift: PropTypes.bool,
  disconnectShift: PropTypes.bool
})
