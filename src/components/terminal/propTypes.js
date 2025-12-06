import PropTypes from 'prop-types'

export const quickHotkeysPropType = PropTypes.shape({
  enabled: PropTypes.bool,
  focus: PropTypes.string,
  history: PropTypes.string,
  download: PropTypes.string,
  clear: PropTypes.string,
  settings: PropTypes.string,
  focusShift: PropTypes.bool,
  historyShift: PropTypes.bool,
  downloadShift: PropTypes.bool,
  clearShift: PropTypes.bool,
  settingsShift: PropTypes.bool
})
