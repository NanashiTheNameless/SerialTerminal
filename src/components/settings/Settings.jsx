import React from 'react'
import PropTypes from 'prop-types'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

import { ALL_BAUD_RATES, COMMON_BAUD_RATES, LINE_ENDING_VALUES, LINE_ENDING_LABELS, DOWNLOAD_FORMATS, DOWNLOAD_FORMAT_LABELS, DEFAULT_SETTINGS, KEYBOARD_SHORTCUTS } from '../../constants'

const UNSET_CHAR = '�'

const formElementCSS = {
  marginTop: 1,
  minWidth: '10em'
}

// Reusable KeybindDisplay component for showing Ctrl+Key combinations
const KeybindDisplay = ({ ctrlKey, shift, label, modifierLabel = 'Ctrl' }) => (
  <Box sx={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    px: 1.25,
    py: 0.5,
    borderRadius: 1,
    border: '1px solid #ccc',
    backgroundColor: '#2e2e2e',
    fontWeight: 700,
    letterSpacing: 0.5,
    fontSize: '0.95rem',
    color: '#fff'
  }}
  >
    <span>{modifierLabel}</span>
    {shift && <span>Shift</span>}
    <span>{(ctrlKey || label || UNSET_CHAR).toUpperCase()}</span>
  </Box>
)

KeybindDisplay.propTypes = {
  ctrlKey: PropTypes.string,
  shift: PropTypes.bool,
  label: PropTypes.string,
  modifierLabel: PropTypes.string
}

// Reusable KeyCapture component for capturing key presses
const KeyCapture = ({ captureTarget, currentTarget, onClick, ctrlKey, shift, label, modifierLabel = 'Ctrl' }) => (
  <Box
    role='button'
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      }
    }}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      p: 1.75,
      mt: 0.75,
      borderRadius: 1.5,
      border: '1px solid #666',
      backgroundColor: '#1a1a1a',
      cursor: 'pointer',
      flex: 1
    }}
  >
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      px: 1.5,
      py: 0.75,
      borderRadius: 1.25,
      border: '1px solid #777',
      backgroundColor: '#2e2e2e',
      fontWeight: 700,
      letterSpacing: 0.75,
      fontSize: '1rem',
      color: '#fff'
    }}
    >
      <span>{modifierLabel}</span>
      {shift && <span>Shift</span>}
      <span>{ctrlKey ? ctrlKey.toUpperCase() : (label ? label.toUpperCase() : UNSET_CHAR)}</span>
    </Box>
    <Typography variant='body2' sx={{ color: '#ffffffcc' }}>
      {captureTarget === currentTarget ? 'Press a key (Esc to cancel)' : 'Click then press a key'}
    </Typography>
  </Box>
)

KeyCapture.propTypes = {
  captureTarget: PropTypes.string,
  currentTarget: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  ctrlKey: PropTypes.string,
  shift: PropTypes.bool,
  label: PropTypes.string,
  modifierLabel: PropTypes.string
}

// Reusable KeybindListItem component for displaying keybind entries
const KeybindListItem = ({ entry, index, onClick, onDelete, isSelected, children }) => (
  <Box
    key={`${entry.key}-${index}`}
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 1.25,
      borderRadius: 1.25,
      border: isSelected ? '2px solid #1976d2' : '1px solid #555',
      backgroundColor: isSelected ? '#2a2a3a' : '#1e1e1e',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: isSelected ? '#1976d2' : '#888',
        backgroundColor: isSelected ? '#2a2a3a' : '#252535'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <KeybindDisplay ctrlKey={entry.key} shift={entry.shift} />
      {children}
    </Box>
    <IconButton aria-label='Delete' size='small' onClick={(e) => { e.stopPropagation(); onDelete() }}>
      <DeleteIcon fontSize='small' />
    </IconButton>
  </Box>
)

KeybindListItem.propTypes = {
  entry: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  children: PropTypes.node
}

// Reusable KeybindInputForm component for adding/editing keybinds
const KeybindInputForm = ({ captureTarget, currentTarget, onCaptureClick, ctrlKey, shift, textValue, onTextChange, textPlaceholder, textError, textHelperText, onSubmit, submitDisabled, submitLabel }) => (
  <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center', flexWrap: 'nowrap', width: '100%' }}>
    <KeyCapture
      captureTarget={captureTarget}
      currentTarget={currentTarget}
      onClick={onCaptureClick}
      ctrlKey={ctrlKey}
      shift={shift}
    />
    <TextField
      placeholder={textPlaceholder}
      variant='outlined'
      value={textValue}
      onChange={onTextChange}
      helperText={textHelperText}
      FormHelperTextProps={{ sx: { color: '#ffffffb3', mt: 0.25 } }}
      sx={{
        marginTop: 0.75,
        minWidth: '10em',
        width: 'auto',
        '& .MuiOutlinedInput-root': { height: '56px' }
      }}
      size='small'
      error={textError}
    />
    <Button
      variant='outlined'
      startIcon={<AddIcon />}
      onClick={onSubmit}
      disabled={submitDisabled}
      sx={{
        marginTop: 0.75,
        height: '56px',
        color: '#fff',
        borderColor: '#fff',
        '&:hover': { borderColor: '#fff', backgroundColor: '#ffffff14' },
        '&.Mui-disabled': { color: '#ffffff61', borderColor: '#ffffff1f' }
      }}
    >
      {submitLabel}
    </Button>
  </Box>
)

KeybindInputForm.propTypes = {
  captureTarget: PropTypes.string,
  currentTarget: PropTypes.string.isRequired,
  onCaptureClick: PropTypes.func.isRequired,
  ctrlKey: PropTypes.string,
  shift: PropTypes.bool,
  textValue: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
  textPlaceholder: PropTypes.string.isRequired,
  textError: PropTypes.bool,
  textHelperText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  submitDisabled: PropTypes.bool,
  submitLabel: PropTypes.string.isRequired
}

// Reusable KeybindList component for displaying list of keybinds
const KeybindList = ({ items, emptyMessage, renderContent, onItemClick, onItemDelete, selectedIndex }) => (
  <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
    {items.length === 0 && (
      <Typography variant='body2' sx={{ color: '#ffffff80' }}>
        {emptyMessage}
      </Typography>
    )}
    {items.map((entry, index) => (
      <KeybindListItem
        key={`${entry.key}-${index}`}
        entry={entry}
        index={index}
        isSelected={selectedIndex === index}
        onClick={() => onItemClick(entry, index)}
        onDelete={() => onItemDelete(index)}
      >
        {renderContent(entry)}
      </KeybindListItem>
    ))}
  </Box>
)

KeybindList.propTypes = {
  items: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  renderContent: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
  onItemDelete: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number
}

// Settings dialog for configuring serial connection parameters
const Settings = React.memo((props) => {
  const [baudRate, setBaudRate] = React.useState(() => {
    const rate = props.settings.baudRate
    const arbitrary = props.settings.allowArbitraryBaudrates === true
    const uncommon = props.settings.allowUncommonBaudrates === true

    // If arbitrary baudrates are allowed, any value is valid
    if (arbitrary === true) return rate

    // Otherwise, check against the filtered list
    const allowedRates = uncommon === true ? ALL_BAUD_RATES : COMMON_BAUD_RATES
    if (!allowedRates.includes(rate)) {
      return DEFAULT_SETTINGS.baudRate
    }
    return rate
  })
  const [lineEnding, setLineEnding] = React.useState(props.settings.lineEnding)
  const [localEcho, setLocalEcho] = React.useState(props.settings.localEcho !== false)
  const [timestamp, setTimestamp] = React.useState(props.settings.timestamp !== false)
  const legacyDetectCtrl = props.settings.detectCtrl
  const [detectCtrlC, setDetectCtrlC] = React.useState(props.settings.detectCtrlC !== undefined ? props.settings.detectCtrlC !== false : legacyDetectCtrl !== false)
  const [detectCtrlD, setDetectCtrlD] = React.useState(props.settings.detectCtrlD !== undefined ? props.settings.detectCtrlD !== false : legacyDetectCtrl !== false)
  const [settingsShortcut, setSettingsShortcut] = React.useState(props.settings.settingsShortcut !== false)
  const [clearShortcut, setClearShortcut] = React.useState(props.settings.clearShortcut === true)
  const [disconnectShortcut, setDisconnectShortcut] = React.useState(props.settings.disconnectShortcut === true)
  const [settingsShortcutKey, setSettingsShortcutKey] = React.useState((props.settings.settingsShortcutKey || KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key).toLowerCase())
  const [clearShortcutKey, setClearShortcutKey] = React.useState((props.settings.clearShortcutKey || KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key).toLowerCase())
  const [disconnectShortcutKey, setDisconnectShortcutKey] = React.useState((props.settings.disconnectShortcutKey || KEYBOARD_SHORTCUTS.DISCONNECT.key).toLowerCase())
  const [settingsShortcutShift, setSettingsShortcutShift] = React.useState(props.settings.settingsShortcutShift === true)
  const [clearShortcutShift, setClearShortcutShift] = React.useState(props.settings.clearShortcutShift === true)
  const [disconnectShortcutShift, setDisconnectShortcutShift] = React.useState(props.settings.disconnectShortcutShift === true)
  const [downloadFormat, setDownloadFormat] = React.useState(props.settings.downloadFormat || 'ask')
  const [advanced, setAdvanced] = React.useState(props.settings.advanced === true)
  const [allowUncommonBaudrates, setAllowUncommonBaudrates] = React.useState(props.settings.allowUncommonBaudrates === true)
  const [allowArbitraryBaudrates, setAllowArbitraryBaudrates] = React.useState(props.settings.allowArbitraryBaudrates === true)
  const [captureTarget, setCaptureTarget] = React.useState(null)
  const [parseANSIOutput, setParseANSIOutput] = React.useState(props.settings.parseANSIOutput !== false)
  const [enableQuickHotkeys, setEnableQuickHotkeys] = React.useState(props.settings.enableQuickHotkeys !== false)
  const [controlAliases, setControlAliases] = React.useState(props.settings.customControlAliases || [])
  const [aliasKey, setAliasKey] = React.useState('')
  const [aliasShift, setAliasShift] = React.useState(false)
  const [aliasCode, setAliasCode] = React.useState('')
  const [aliasEditIndex, setAliasEditIndex] = React.useState(null)
  const [keybindEditIndex, setKeybindEditIndex] = React.useState(null)
  const [commandKeybinds, setCommandKeybinds] = React.useState(props.settings.commandKeybinds || [])
  const [keybindKey, setKeybindKey] = React.useState('')
  const [keybindShift, setKeybindShift] = React.useState(false)
  const [keybindText, setKeybindText] = React.useState('')
  const [quickFocusKey, setQuickFocusKey] = React.useState((props.settings.quickFocusKey || 'i').toLowerCase())
  const [quickHistoryKey, setQuickHistoryKey] = React.useState((props.settings.quickHistoryKey || 'h').toLowerCase())
  const [quickDownloadKey, setQuickDownloadKey] = React.useState((props.settings.quickDownloadKey || 'd').toLowerCase())
  const [quickClearKey, setQuickClearKey] = React.useState((props.settings.quickClearKey || 'c').toLowerCase())
  const [quickSettingsKey, setQuickSettingsKey] = React.useState((props.settings.quickSettingsKey || 's').toLowerCase())
  const [quickDisconnectKey, setQuickDisconnectKey] = React.useState((props.settings.quickDisconnectKey || 'x').toLowerCase())
  const [quickFocusShift, setQuickFocusShift] = React.useState(props.settings.quickFocusShift === true)
  const [quickHistoryShift, setQuickHistoryShift] = React.useState(props.settings.quickHistoryShift === true)
  const [quickDownloadShift, setQuickDownloadShift] = React.useState(props.settings.quickDownloadShift === true)
  const [quickClearShift, setQuickClearShift] = React.useState(props.settings.quickClearShift === true)
  const [quickSettingsShift, setQuickSettingsShift] = React.useState(props.settings.quickSettingsShift === true)
  const [quickDisconnectShift, setQuickDisconnectShift] = React.useState(props.settings.quickDisconnectShift === true)

  const formatLabel = (key, shift, fallbackKey) => {
    const finalKey = (key || fallbackKey || '').toUpperCase()
    return `Ctrl${shift ? '+Shift' : ''}+${finalKey}`
  }

  const formatAltLabel = (key, shift) => {
    const finalKey = (key || UNSET_CHAR).toUpperCase()
    return `Alt${shift ? '+Shift' : ''}+${finalKey}`
  }

  // Parse escape sequences like \x04, \n, etc.
  const parseEscapeSequence = (str, enableANSI = true) => {
    if (!str) return null
    const hexMatch = str.match(/^\\x([0-9a-fA-F]{1,2})$/)
    if (hexMatch) {
      return { type: 'code', value: parseInt(hexMatch[1], 16) }
    }
    // Handle common escape sequences
    const escapeMap = {
      '\\n': 10, // newline
      '\\r': 13, // carriage return
      '\\t': 9, // tab
      '\\0': 0, // null
      '\\\\': 92 // backslash
    }
    if (escapeMap[str] !== undefined) {
      return { type: 'code', value: escapeMap[str] }
    }
    // Check for ANSI sequence patterns (only if enabled)
    if (enableANSI) {
      const ansiMatch = str.match(/^(?:\\033|\[)?(.*?)([a-zA-Z])$/)
      if (ansiMatch && (ansiMatch[0].includes('[') || ansiMatch[0].startsWith('\\'))) {
        return { type: 'text', value: `\x1b[${ansiMatch[1]}${ansiMatch[2]}` }
      }
      if (str.startsWith('ESC')) {
        return { type: 'text', value: `\x1b${str.substring(3)}` }
      }
    }
    // Try direct number
    const num = Number(str)
    return Number.isInteger(num) && num >= 0 && num <= 255 ? { type: 'code', value: num } : null
  }

  const aliasKeyValid = aliasKey.trim().length === 1
  const aliasCodeParsed = parseEscapeSequence(aliasCode.trim(), true)
  const aliasCodeValid = aliasCodeParsed !== null
  const aliasHelperText = aliasCode
    ? (aliasCodeValid
        ? (aliasCodeParsed.type === 'code'
            ? `= byte ${aliasCodeParsed.value}`
            : `= text "${aliasCodeParsed.value}"`)
        : 'Invalid code')
    : ''

  const keybindKeyValid = keybindKey.trim().length === 1
  const keybindTextValid = keybindText.trim().length > 0

  const normalizeHotkey = (val) => (val || '').trim().toLowerCase().slice(0, 1)
  const hotkeyValid = (val) => val && val.trim().length === 1

  const addAlias = () => {
    if (!aliasKeyValid || !aliasCodeValid) return
    const normalizedKey = aliasKey.trim().toLowerCase()

    if (aliasEditIndex !== null) {
      // Update existing alias
      setControlAliases((prev) => {
        const updated = [...prev]
        updated[aliasEditIndex] = { key: normalizedKey, shift: aliasShift, ...aliasCodeParsed }
        return updated
      })
      setAliasEditIndex(null)
    } else {
      // Add new alias
      const exists = controlAliases.some((entry) => entry.key === normalizedKey && entry.shift === aliasShift)
      if (exists) {
        const shiftLabel = aliasShift ? 'Ctrl+Shift+' : 'Ctrl+'
        window.alert(`${shiftLabel}${normalizedKey.toUpperCase()} is already mapped. Delete the existing alias first.`)
        return
      }
      // Store the parsed result (either code or text)
      setControlAliases((prev) => [...prev, { key: normalizedKey, shift: aliasShift, ...aliasCodeParsed }])
    }
    setAliasKey('')
    setAliasShift(false)
    setAliasCode('')
  }

  const removeAlias = (index) => {
    setControlAliases((prev) => prev.filter((_, i) => i !== index))
    if (aliasEditIndex === index) {
      setAliasEditIndex(null)
      setAliasKey('')
      setAliasShift(false)
      setAliasCode('')
    }
  }

  const addKeybind = () => {
    if (!keybindKeyValid || !keybindTextValid) return
    const normalizedKey = keybindKey.trim().toLowerCase()
    if (keybindEditIndex !== null) {
      // Update mode
      setCommandKeybinds((prev) =>
        prev.map((entry, i) => (i === keybindEditIndex ? { key: normalizedKey, shift: keybindShift, text: keybindText.trim() } : entry))
      )
      setKeybindEditIndex(null)
    } else {
      // Add mode
      const exists = commandKeybinds.some((entry) => entry.key === normalizedKey && entry.shift === keybindShift)
      if (exists) {
        const shiftLabel = keybindShift ? 'Ctrl+Shift+' : 'Ctrl+'
        window.alert(`${shiftLabel}${normalizedKey.toUpperCase()} is already mapped. Delete the existing keybind first.`)
        return
      }
      setCommandKeybinds((prev) => [...prev, { key: normalizedKey, shift: keybindShift, text: keybindText.trim() }])
    }
    setKeybindKey('')
    setKeybindShift(false)
    setKeybindText('')
  }

  const removeKeybind = (index) => {
    setCommandKeybinds((prev) => prev.filter((_, i) => i !== index))
    if (keybindEditIndex === index) {
      setKeybindEditIndex(null)
      setKeybindKey('')
      setKeybindShift(false)
      setKeybindText('')
    }
  }

  const cancel = () => {
    const rate = props.settings.baudRate
    const arbitrary = props.settings.allowArbitraryBaudrates === true
    const uncommon = props.settings.allowUncommonBaudrates === true
    let validatedRate = rate

    // Validate baudrate
    if (arbitrary !== true) {
      const allowedRates = uncommon === true ? ALL_BAUD_RATES : COMMON_BAUD_RATES
      if (!allowedRates.includes(rate)) {
        validatedRate = DEFAULT_SETTINGS.baudRate
      }
    }

    setBaudRate(validatedRate)
    setLineEnding(props.settings.lineEnding)
    setLocalEcho(props.settings.localEcho !== false)
    setTimestamp(props.settings.timestamp !== false)
    setDetectCtrlC(props.settings.detectCtrlC !== undefined ? props.settings.detectCtrlC !== false : legacyDetectCtrl !== false)
    setDetectCtrlD(props.settings.detectCtrlD !== undefined ? props.settings.detectCtrlD !== false : legacyDetectCtrl !== false)
    setSettingsShortcut(props.settings.settingsShortcut !== false)
    setClearShortcut(props.settings.clearShortcut === true)
    setDisconnectShortcut(props.settings.disconnectShortcut === true)
    setSettingsShortcutKey((props.settings.settingsShortcutKey || KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key).toLowerCase())
    setClearShortcutKey((props.settings.clearShortcutKey || KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key).toLowerCase())
    setDisconnectShortcutKey((props.settings.disconnectShortcutKey || KEYBOARD_SHORTCUTS.DISCONNECT.key).toLowerCase())
    setSettingsShortcutShift(props.settings.settingsShortcutShift === true)
    setClearShortcutShift(props.settings.clearShortcutShift === true)
    setDisconnectShortcutShift(props.settings.disconnectShortcutShift === true)
    setDownloadFormat(props.settings.downloadFormat || 'ask')
    setParseANSIOutput(props.settings.parseANSIOutput !== false)
    setAdvanced(props.settings.advanced === true)
    setEnableQuickHotkeys(props.settings.enableQuickHotkeys !== false)
    setControlAliases(props.settings.customControlAliases || [])
    setAliasKey('')
    setAliasShift(false)
    setAliasCode('')
    setCommandKeybinds(props.settings.commandKeybinds || [])
    setKeybindKey('')
    setKeybindShift(false)
    setKeybindText('')
    setQuickFocusKey(normalizeHotkey(props.settings.quickFocusKey || 'i'))
    setQuickHistoryKey(normalizeHotkey(props.settings.quickHistoryKey || 'h'))
    setQuickDownloadKey(normalizeHotkey(props.settings.quickDownloadKey || 'd'))
    setQuickClearKey(normalizeHotkey(props.settings.quickClearKey || 'c'))
    setQuickSettingsKey(normalizeHotkey(props.settings.quickSettingsKey || 's'))
    setQuickDisconnectKey(normalizeHotkey(props.settings.quickDisconnectKey || 'x'))
    setQuickFocusShift(props.settings.quickFocusShift === true)
    setQuickHistoryShift(props.settings.quickHistoryShift === true)
    setQuickDownloadShift(props.settings.quickDownloadShift === true)
    setQuickClearShift(props.settings.quickClearShift === true)
    setQuickSettingsShift(props.settings.quickSettingsShift === true)
    setQuickDisconnectShift(props.settings.quickDisconnectShift === true)

    props.close()
  }

  React.useEffect(() => {
    if (!captureTarget) return

    const handleKeyCapture = (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'Escape') {
        setCaptureTarget(null)
        return
      }

      // Accept any single-character key (printable character)
      // This includes letters, numbers, and symbols like /, @, !, etc.
      const excludedKeys = ['Control', 'Shift', 'Alt', 'Meta', 'Enter', 'Tab', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'CapsLock', 'NumLock']
      if (e.key && e.key.length === 1 && !excludedKeys.includes(e.key)) {
        const normalized = e.key.toLowerCase()
        const shiftHeld = e.shiftKey === true
        if (captureTarget === 'settings') {
          setSettingsShortcutKey(normalized)
          setSettingsShortcutShift(shiftHeld)
        }
        if (captureTarget === 'clear') {
          setClearShortcutKey(normalized)
          setClearShortcutShift(shiftHeld)
        }
        if (captureTarget === 'disconnect') {
          setDisconnectShortcutKey(normalized)
          setDisconnectShortcutShift(shiftHeld)
        }
        if (captureTarget === 'alias') {
          setAliasKey(normalized)
          setAliasShift(shiftHeld)
        }
        if (captureTarget === 'keybind') {
          setKeybindKey(normalized)
          setKeybindShift(shiftHeld)
        }
        if (captureTarget === 'quickFocus') {
          setQuickFocusKey(normalized)
          setQuickFocusShift(shiftHeld)
        }
        if (captureTarget === 'quickHistory') {
          setQuickHistoryKey(normalized)
          setQuickHistoryShift(shiftHeld)
        }
        if (captureTarget === 'quickDownload') {
          setQuickDownloadKey(normalized)
          setQuickDownloadShift(shiftHeld)
        }
        if (captureTarget === 'quickClear') {
          setQuickClearKey(normalized)
          setQuickClearShift(shiftHeld)
        }
        if (captureTarget === 'quickSettings') {
          setQuickSettingsKey(normalized)
          setQuickSettingsShift(shiftHeld)
        }
        if (captureTarget === 'quickDisconnect') {
          setQuickDisconnectKey(normalized)
          setQuickDisconnectShift(shiftHeld)
        }
        setCaptureTarget(null)
      }
    }

    const opts = { capture: true }
    window.addEventListener('keydown', handleKeyCapture, opts)
    return () => window.removeEventListener('keydown', handleKeyCapture, opts)
  }, [captureTarget])

  React.useEffect(() => {
    setControlAliases(props.settings.customControlAliases || [])
  }, [props.settings.customControlAliases])

  React.useEffect(() => {
    setCommandKeybinds(props.settings.commandKeybinds || [])
  }, [props.settings.commandKeybinds])

  // Validate baudrate against current allowed rates
  React.useEffect(() => {
    const getAllowedBaudrates = () => {
      if (allowArbitraryBaudrates === true) {
        return null // any baudrate is allowed
      }
      return allowUncommonBaudrates === true ? ALL_BAUD_RATES : COMMON_BAUD_RATES
    }

    const allowedBaudrates = getAllowedBaudrates()
    // Only reset if current baudrate is invalid for the new filter settings
    if (allowedBaudrates !== null && !allowedBaudrates.includes(baudRate)) {
      setBaudRate(DEFAULT_SETTINGS.baudRate)
    }
  }, [allowArbitraryBaudrates, allowUncommonBaudrates])

  const reset = () => {
    if (!props.openPort) setBaudRate(DEFAULT_SETTINGS.baudRate)
    setLineEnding(DEFAULT_SETTINGS.lineEnding)
    setLocalEcho(DEFAULT_SETTINGS.localEcho)
    setTimestamp(DEFAULT_SETTINGS.timestamp)
    setDetectCtrlC(DEFAULT_SETTINGS.detectCtrlC)
    setDetectCtrlD(DEFAULT_SETTINGS.detectCtrlD)
    setSettingsShortcut(DEFAULT_SETTINGS.settingsShortcut)
    setClearShortcut(DEFAULT_SETTINGS.clearShortcut)
    setDisconnectShortcut(DEFAULT_SETTINGS.disconnectShortcut)
    setSettingsShortcutKey(DEFAULT_SETTINGS.settingsShortcutKey)
    setClearShortcutKey(DEFAULT_SETTINGS.clearShortcutKey)
    setDisconnectShortcutKey(DEFAULT_SETTINGS.disconnectShortcutKey)
    setSettingsShortcutShift(DEFAULT_SETTINGS.settingsShortcutShift)
    setClearShortcutShift(DEFAULT_SETTINGS.clearShortcutShift)
    setDisconnectShortcutShift(DEFAULT_SETTINGS.disconnectShortcutShift)
    setDownloadFormat(DEFAULT_SETTINGS.downloadFormat)
    setParseANSIOutput(DEFAULT_SETTINGS.parseANSIOutput)
    setAdvanced(DEFAULT_SETTINGS.advanced)
    setAllowUncommonBaudrates(DEFAULT_SETTINGS.allowUncommonBaudrates)
    setAllowArbitraryBaudrates(DEFAULT_SETTINGS.allowArbitraryBaudrates)
    setEnableQuickHotkeys(DEFAULT_SETTINGS.enableQuickHotkeys)
    setControlAliases(DEFAULT_SETTINGS.customControlAliases)
    setAliasKey('')
    setAliasShift(false)
    setAliasCode('')
    setCommandKeybinds(DEFAULT_SETTINGS.commandKeybinds || [])
    setKeybindKey('')
    setKeybindShift(false)
    setKeybindText('')
    setQuickFocusKey(DEFAULT_SETTINGS.quickFocusKey)
    setQuickHistoryKey(DEFAULT_SETTINGS.quickHistoryKey)
    setQuickDownloadKey(DEFAULT_SETTINGS.quickDownloadKey)
    setQuickClearKey(DEFAULT_SETTINGS.quickClearKey)
    setQuickSettingsKey(DEFAULT_SETTINGS.quickSettingsKey)
    setQuickDisconnectKey(DEFAULT_SETTINGS.quickDisconnectKey)
    setQuickFocusShift(DEFAULT_SETTINGS.quickFocusShift)
    setQuickHistoryShift(DEFAULT_SETTINGS.quickHistoryShift)
    setQuickDownloadShift(DEFAULT_SETTINGS.quickDownloadShift)
    setQuickClearShift(DEFAULT_SETTINGS.quickClearShift)
    setQuickSettingsShift(DEFAULT_SETTINGS.quickSettingsShift)
    setQuickDisconnectShift(DEFAULT_SETTINGS.quickDisconnectShift)
  }

  const save = () => {
    // Check for conflicts between Settings and Clear shortcuts
    if (settingsShortcut && clearShortcut &&
        settingsShortcutKey === clearShortcutKey &&
        settingsShortcutShift === clearShortcutShift) {
      window.alert('Open Settings and Clear Terminal cannot use the same keybind!')
      return
    }

    // Check for conflicts between Settings and Disconnect shortcuts
    if (settingsShortcut && disconnectShortcut &&
        settingsShortcutKey === disconnectShortcutKey &&
        settingsShortcutShift === disconnectShortcutShift) {
      window.alert('Open Settings and Disconnect cannot use the same keybind!')
      return
    }

    // Check for conflicts between Clear and Disconnect shortcuts
    if (clearShortcut && disconnectShortcut &&
        clearShortcutKey === disconnectShortcutKey &&
        clearShortcutShift === disconnectShortcutShift) {
      window.alert('Clear Terminal and Disconnect cannot use the same keybind!')
      return
    }

    if (enableQuickHotkeys) {
      const hotkeys = [quickFocusKey, quickHistoryKey, quickDownloadKey, quickClearKey, quickSettingsKey, quickDisconnectKey]
      if (hotkeys.some(k => !hotkeyValid(k))) {
        window.alert('All terminal hotkeys must be a single character (letters or symbols).')
        return
      }
    }

    const normalizedSettingsKey = (settingsShortcutKey || KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key).toLowerCase()
    const normalizedClearKey = (clearShortcutKey || KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key).toLowerCase()
    const normalizedDisconnectKey = (disconnectShortcutKey || KEYBOARD_SHORTCUTS.DISCONNECT.key).toLowerCase()

    props.save({
      baudRate,
      lineEnding,
      localEcho,
      timestamp,
      settingsShortcut,
      clearShortcut,
      disconnectShortcut,
      detectCtrlC,
      detectCtrlD,
      settingsShortcutKey: normalizedSettingsKey,
      clearShortcutKey: normalizedClearKey,
      disconnectShortcutKey: normalizedDisconnectKey,
      settingsShortcutShift,
      clearShortcutShift,
      disconnectShortcutShift,
      downloadFormat,
      customControlAliases: controlAliases,
      commandKeybinds,
      parseANSIOutput,
      advanced,
      allowUncommonBaudrates,
      allowArbitraryBaudrates,
      enableQuickHotkeys,
      quickFocusKey: normalizeHotkey(quickFocusKey || 'i'),
      quickHistoryKey: normalizeHotkey(quickHistoryKey || 'h'),
      quickDownloadKey: normalizeHotkey(quickDownloadKey || 'd'),
      quickClearKey: normalizeHotkey(quickClearKey || 'c'),
      quickSettingsKey: normalizeHotkey(quickSettingsKey || 's'),
      quickDisconnectKey: normalizeHotkey(quickDisconnectKey || 'x'),
      quickFocusShift,
      quickHistoryShift,
      quickDownloadShift,
      quickClearShift,
      quickSettingsShift,
      quickDisconnectShift
    })

    props.close()
  }

  const handleDialogClose = (event, reason) => {
    if (reason === 'escapeKeyDown') {
      if (captureTarget) {
        setCaptureTarget(null)
        return
      }
      save()
      return
    }
    props.close()
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleDialogClose}
      disableScrollLock
      maxWidth='md'
      fullWidth
    >
      <DialogTitle>Settings</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Serial Connection
        </DialogContentText>

        {!allowArbitraryBaudrates
          ? (
            <FormControl fullWidth sx={formElementCSS}>
              <InputLabel>Baud Rate {props.openPort && '(Requires Reconnect)'}</InputLabel>
              <Select
                value={baudRate}
                onChange={(e) => setBaudRate(Number(e.target.value))}
                label='baudrate'
                disabled={props.openPort}
              >
                {(!allowUncommonBaudrates ? COMMON_BAUD_RATES : ALL_BAUD_RATES).map(baud =>
                  <MenuItem value={baud} key={baud}>{baud} baud</MenuItem>
                )}
              </Select>
            </FormControl>
            )
          : (
            <TextField
              label='Baud Rate'
              type='number'
              variant='outlined'
              fullWidth
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={props.openPort}
              inputProps={{ min: 1, step: 1 }}
              helperText={props.openPort ? 'Requires Reconnect' : ''}
              sx={formElementCSS}
            />
            )}

        <FormControl fullWidth sx={formElementCSS}>
          <InputLabel>Line Ending</InputLabel>
          <Select
            value={lineEnding}
            onChange={(e) => setLineEnding(e.target.value)}
            label='Line Ending'
            displayEmpty
            renderValue={(value) => {
              const key = Object.keys(LINE_ENDING_VALUES).find(k => LINE_ENDING_VALUES[k] === value)
              return LINE_ENDING_LABELS[key] || value
            }}
          >
            {Object.entries(LINE_ENDING_VALUES).map(([key, value]) =>
              <MenuItem value={value} key={key}>{LINE_ENDING_LABELS[key]}</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={formElementCSS}>
          <InputLabel>Download Format</InputLabel>
          <Select
            value={downloadFormat}
            onChange={(e) => setDownloadFormat(e.target.value)}
            label='Download Format'
            displayEmpty
            renderValue={(value) => {
              const key = Object.keys(DOWNLOAD_FORMATS).find(k => DOWNLOAD_FORMATS[k] === value)
              return DOWNLOAD_FORMAT_LABELS[key] || value
            }}
          >
            {Object.entries(DOWNLOAD_FORMATS).map(([key, value]) =>
              <MenuItem value={value} key={key}>{DOWNLOAD_FORMAT_LABELS[key]}</MenuItem>
            )}
          </Select>
        </FormControl>

        <DialogContentText sx={{ mt: 3 }}>
          Display Options
        </DialogContentText>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={localEcho}
                onChange={(e) => setLocalEcho(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            } label='Show input (local echo)'
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={timestamp}
                onChange={(e) => setTimestamp(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            } label='Show timestamps'
          />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DialogContentText sx={{ m: 0 }}>
            Keybind Options
          </DialogContentText>
          <a href='https://github.com/NanashiTheNameless/SerialTerminal?tab=readme-ov-file#keyboard-shortcuts' target='_blank' rel='noopener noreferrer' style={{ color: '#4a90e2', textDecoration: 'underline', fontSize: '0.9rem', cursor: 'pointer' }}>
            (RTFM)
          </a>
        </Box>

        <FormGroup>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={enableQuickHotkeys}
                  onChange={(e) => setEnableQuickHotkeys(e.target.checked)}
                  sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                />
              } label='Enable terminal quick hotkeys (Alt + key)'
            />
            <a href='https://github.com/NanashiTheNameless/SerialTerminal?tab=readme-ov-file#quick-hotkeys-customizable-in-settings' target='_blank' rel='noopener noreferrer' style={{ color: '#4a90e2', textDecoration: 'underline', fontSize: '0.85rem', cursor: 'pointer' }}>
              (RTFM)
            </a>
          </Box>
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={detectCtrlC}
                onChange={(e) => setDetectCtrlC(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            } label='Detect Ctrl+C (send SIGINT code 0x03)'
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={detectCtrlD}
                onChange={(e) => setDetectCtrlD(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            } label='Detect Ctrl+D (send EOF code 0x04)'
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={settingsShortcut}
                onChange={(e) => setSettingsShortcut(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            } label={`${KEYBOARD_SHORTCUTS.OPEN_SETTINGS.description} (${formatLabel(settingsShortcutKey, settingsShortcutShift, KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key)})`}
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={clearShortcut}
                onChange={(e) => setClearShortcut(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            } label={`${KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.description} (${formatLabel(clearShortcutKey, clearShortcutShift, KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key)})`}
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={disconnectShortcut}
                onChange={(e) => setDisconnectShortcut(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            } label={`${KEYBOARD_SHORTCUTS.DISCONNECT.description} (${formatLabel(disconnectShortcutKey, disconnectShortcutShift, KEYBOARD_SHORTCUTS.DISCONNECT.key)})`}
          />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        <FormGroup sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={advanced}
                onChange={(e) => setAdvanced(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            }
            label='Show Advanced Options'
          />
        </FormGroup>

        <Collapse in={advanced} timeout='auto' unmountOnExit>
          <Divider sx={{ my: 2 }} />

          {!allowArbitraryBaudrates && (
            <FormGroup sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowUncommonBaudrates}
                    onChange={(e) => setAllowUncommonBaudrates(e.target.checked)}
                    sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                  />
                }
                label='Allow Uncommon Baudrates'
              />
            </FormGroup>
          )}

          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allowArbitraryBaudrates}
                  onChange={(e) => setAllowArbitraryBaudrates(e.target.checked)}
                  sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                />
              }
              label='Allow Arbitrary Baudrates'
            />
          </FormGroup>

          <FormGroup sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={parseANSIOutput}
                  onChange={(e) => setParseANSIOutput(e.target.checked)}
                  sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                />
              }
              label='Parse ANSI Escape Sequences in Received Output'
            />
          </FormGroup>

          {enableQuickHotkeys && (
            <>
              <DialogContentText sx={{ mt: 2 }}>
                Terminal Hotkeys (Alt + key)
              </DialogContentText>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2, mt: 1 }}>
                <Box>
                  <Typography variant='body2' sx={{ color: '#ffffffcc', mb: 1, fontWeight: 600 }}>
                    Focus Input
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='quickFocus'
                    onClick={() => setCaptureTarget('quickFocus')}
                    ctrlKey={quickFocusKey}
                    shift={quickFocusShift}
                    label={formatAltLabel(quickFocusKey, quickFocusShift)}
                    modifierLabel='Alt'
                  />
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ color: '#ffffffcc', mb: 1, fontWeight: 600 }}>
                    Show History
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='quickHistory'
                    onClick={() => setCaptureTarget('quickHistory')}
                    ctrlKey={quickHistoryKey}
                    shift={quickHistoryShift}
                    label={formatAltLabel(quickHistoryKey, quickHistoryShift)}
                    modifierLabel='Alt'
                  />
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ color: '#ffffffcc', mb: 1, fontWeight: 600 }}>
                    Download Output
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='quickDownload'
                    onClick={() => setCaptureTarget('quickDownload')}
                    ctrlKey={quickDownloadKey}
                    shift={quickDownloadShift}
                    label={formatAltLabel(quickDownloadKey, quickDownloadShift)}
                    modifierLabel='Alt'
                  />
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ color: '#ffffffcc', mb: 1, fontWeight: 600 }}>
                    Clear Terminal
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='quickClear'
                    onClick={() => setCaptureTarget('quickClear')}
                    ctrlKey={quickClearKey}
                    shift={quickClearShift}
                    label={formatAltLabel(quickClearKey, quickClearShift)}
                    modifierLabel='Alt'
                  />
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ color: '#ffffffcc', mb: 1, fontWeight: 600 }}>
                    Open Settings
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='quickSettings'
                    onClick={() => setCaptureTarget('quickSettings')}
                    ctrlKey={quickSettingsKey}
                    shift={quickSettingsShift}
                    label={formatAltLabel(quickSettingsKey, quickSettingsShift)}
                    modifierLabel='Alt'
                  />
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ color: '#ffffffcc', mb: 1, fontWeight: 600 }}>
                    Disconnect
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='quickDisconnect'
                    onClick={() => setCaptureTarget('quickDisconnect')}
                    ctrlKey={quickDisconnectKey}
                    shift={quickDisconnectShift}
                    label={formatAltLabel(quickDisconnectKey, quickDisconnectShift)}
                    modifierLabel='Alt'
                  />
                </Box>
              </Box>
            </>
          )}

          {(settingsShortcut || clearShortcut || disconnectShortcut) && (
            <>
              <DialogContentText sx={{ mt: 2 }}>
                Rebindings
              </DialogContentText>

              {settingsShortcut && (
                <>
                  <Typography variant='subtitle1' sx={{ color: '#ffffffcc', mt: 2, fontWeight: 700 }}>
                    Open Settings
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='settings'
                    onClick={() => setCaptureTarget('settings')}
                    ctrlKey={settingsShortcutKey}
                    shift={settingsShortcutShift}
                    label={KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key}
                  />
                </>
              )}

              {clearShortcut && (
                <>
                  <Typography variant='subtitle1' sx={{ color: '#ffffffcc', mt: 2, fontWeight: 700 }}>
                    Clear Terminal
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='clear'
                    onClick={() => setCaptureTarget('clear')}
                    ctrlKey={clearShortcutKey}
                    shift={clearShortcutShift}
                    label={KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key}
                  />
                </>
              )}

              {disconnectShortcut && (
                <>
                  <Typography variant='subtitle1' sx={{ color: '#ffffffcc', mt: 2, fontWeight: 700 }}>
                    Disconnect
                  </Typography>
                  <KeyCapture
                    captureTarget={captureTarget}
                    currentTarget='disconnect'
                    onClick={() => setCaptureTarget('disconnect')}
                    ctrlKey={disconnectShortcutKey}
                    shift={disconnectShortcutShift}
                    label={KEYBOARD_SHORTCUTS.DISCONNECT.key}
                  />
                </>
              )}
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant='subtitle1' sx={{ color: '#ffffffcc', fontWeight: 700 }}>
            Control Aliases
          </Typography>
          <Typography variant='body2' sx={{ color: '#ffffff99', mt: 0.5 }}>
            Map Ctrl/⌘ + key to send a control code or ANSI sequence.
          </Typography>
          <Typography variant='body2' sx={{ color: '#ffffff77', mt: 1, fontSize: '0.85rem' }}>
            <strong>Formats:</strong> Hex (\x04), decimal (4), escapes (\n, \r, \t, \0), or ANSI ([97m, ESC[2J)
          </Typography>

          <KeybindList
            items={controlAliases}
            emptyMessage='No aliases yet.'
            selectedIndex={aliasEditIndex}
            onItemClick={(entry, index) => {
              setAliasEditIndex(index)
              setAliasKey(entry.key)
              setAliasShift(entry.shift)
              setAliasCode(entry.type === 'code' ? String(entry.value) : (entry.type === 'text' ? entry.value : ''))
              setCaptureTarget(null)
            }}
            onItemDelete={removeAlias}
            renderContent={(entry) => (
              <Typography variant='body2' sx={{ color: '#ffffffcc' }}>
                {entry.type === 'code'
                  ? `sends code ${entry.value}`
                  : `sends text "${entry.value}"`}
              </Typography>
            )}
          />

          <KeybindInputForm
            captureTarget={captureTarget}
            currentTarget='alias'
            onCaptureClick={() => setCaptureTarget('alias')}
            ctrlKey={aliasKey}
            shift={aliasShift}
            textValue={aliasCode}
            onTextChange={(e) => setAliasCode(e.target.value)}
            textPlaceholder='Control Code'
            textError={aliasCode.length > 0 && !aliasCodeValid}
            textHelperText={aliasHelperText}
            onSubmit={addAlias}
            submitDisabled={!aliasKeyValid || !aliasCodeValid}
            submitLabel={aliasEditIndex !== null ? 'Update' : 'Add'}
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant='subtitle1' sx={{ color: '#ffffffcc', fontWeight: 700 }}>
            Command Keybinds
          </Typography>
          <Typography variant='body2' sx={{ color: '#ffffff99', mt: 0.5 }}>
            Map Ctrl/⌘ + key to send any text string.
          </Typography>

          <KeybindList
            items={commandKeybinds}
            emptyMessage='No keybinds yet.'
            selectedIndex={keybindEditIndex}
            onItemClick={(entry, index) => {
              setKeybindEditIndex(index)
              setKeybindKey(entry.key)
              setKeybindShift(entry.shift)
              setKeybindText(entry.text)
            }}
            onItemDelete={removeKeybind}
            renderContent={(entry) => (
              <Typography variant='body2' sx={{ color: '#ffffffcc', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                sends &quot;{entry.text}&quot;
              </Typography>
            )}
          />

          <KeybindInputForm
            captureTarget={captureTarget}
            currentTarget='keybind'
            onCaptureClick={() => setCaptureTarget('keybind')}
            ctrlKey={keybindKey}
            shift={keybindShift}
            textValue={keybindText}
            onTextChange={(e) => setKeybindText(e.target.value)}
            textPlaceholder='Text'
            textError={keybindText.length > 0 && !keybindTextValid}
            textHelperText=''
            onSubmit={addKeybind}
            submitDisabled={!keybindKeyValid || !keybindTextValid}
            submitLabel={keybindEditIndex !== null ? 'Update' : 'Add'}
          />

        </Collapse>

      </DialogContent>

      <DialogActions>
        <Button onClick={reset} color='error'>Reset</Button>
        <Button onClick={cancel} color='secondary'>Cancel</Button>
        <Button onClick={save} color='primary'>Save</Button>
      </DialogActions>
    </Dialog>
  )
})

Settings.displayName = 'Settings'

Settings.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func,
  settings: PropTypes.object,
  save: PropTypes.func,
  openPort: PropTypes.bool
}

export default Settings
