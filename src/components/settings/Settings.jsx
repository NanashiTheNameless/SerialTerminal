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

import { BAUD_RATES, LINE_ENDING_VALUES, LINE_ENDING_LABELS, DOWNLOAD_FORMATS, DOWNLOAD_FORMAT_LABELS, DEFAULT_SETTINGS, KEYBOARD_SHORTCUTS } from '../../constants'

const formElementCSS = {
  marginTop: 1,
  minWidth: '10em'
}

// Reusable KeybindDisplay component for showing Ctrl+Key combinations
const KeybindDisplay = ({ ctrlKey, shift, label }) => (
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
  }}>
    <span>Ctrl</span>
    {shift && <span>Shift</span>}
    <span>{(ctrlKey || label || '').toUpperCase()}</span>
  </Box>
)

KeybindDisplay.propTypes = {
  ctrlKey: PropTypes.string,
  shift: PropTypes.bool,
  label: PropTypes.string
}

// Reusable KeyCapture component for capturing key presses
const KeyCapture = ({ captureTarget, currentTarget, onClick, ctrlKey, shift, label }) => (
  <Box
    role='button'
    tabIndex={0}
    onClick={onClick}
    onFocus={onClick}
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
    }}>
      <span>Ctrl</span>
      {shift && <span>Shift</span>}
      <span>{ctrlKey ? ctrlKey.toUpperCase() : (label ? label.toUpperCase() : '?')}</span>
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
  label: PropTypes.string
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
    <IconButton aria-label='Delete' size='small' onClick={(e) => { e.stopPropagation(); onDelete(); }}>
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

// Settings dialog for configuring serial connection parameters
const Settings = React.memo((props) => {
  const [baudRate, setBaudRate] = React.useState(props.settings.baudRate)
  const [lineEnding, setLineEnding] = React.useState(props.settings.lineEnding)
  const [localEcho, setLocalEcho] = React.useState(props.settings.localEcho !== false)
  const [timestamp, setTimestamp] = React.useState(props.settings.timestamp !== false)
  const legacyDetectCtrl = props.settings.detectCtrl
  const [detectCtrlC, setDetectCtrlC] = React.useState(props.settings.detectCtrlC !== undefined ? props.settings.detectCtrlC !== false : legacyDetectCtrl !== false)
  const [detectCtrlD, setDetectCtrlD] = React.useState(props.settings.detectCtrlD !== undefined ? props.settings.detectCtrlD !== false : legacyDetectCtrl !== false)
  const [settingsShortcut, setSettingsShortcut] = React.useState(props.settings.settingsShortcut !== false)
  const [clearShortcut, setClearShortcut] = React.useState(props.settings.clearShortcut === true)
  const [settingsShortcutKey, setSettingsShortcutKey] = React.useState((props.settings.settingsShortcutKey || KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key).toLowerCase())
  const [clearShortcutKey, setClearShortcutKey] = React.useState((props.settings.clearShortcutKey || KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key).toLowerCase())
  const [settingsShortcutShift, setSettingsShortcutShift] = React.useState(props.settings.settingsShortcutShift === true)
  const [clearShortcutShift, setClearShortcutShift] = React.useState(props.settings.clearShortcutShift === true)
  const [downloadFormat, setDownloadFormat] = React.useState(props.settings.downloadFormat || 'ask')
  const [advanced, setAdvanced] = React.useState(props.settings.advanced === true)
  const [captureTarget, setCaptureTarget] = React.useState(null)
  const [parseANSIOutput, setParseANSIOutput] = React.useState(props.settings.parseANSIOutput !== false)
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

  const formatLabel = (key, shift, fallbackKey) => {
    const finalKey = (key || fallbackKey || '').toUpperCase()
    return `Ctrl${shift ? '+Shift' : ''}+${finalKey}`
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
      '\\n': 10,    // newline
      '\\r': 13,    // carriage return
      '\\t': 9,     // tab
      '\\0': 0,     // null
      '\\\\': 92   // backslash
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

  const keybindKeyValid = keybindKey.trim().length === 1
  const keybindTextValid = keybindText.trim().length > 0

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
        alert(`${shiftLabel}${normalizedKey.toUpperCase()} is already mapped. Delete the existing alias first.`)
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
        alert(`${shiftLabel}${normalizedKey.toUpperCase()} is already mapped. Delete the existing keybind first.`)
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
    setBaudRate(props.settings.baudRate)
    setLineEnding(props.settings.lineEnding)
    setLocalEcho(props.settings.localEcho !== false)
    setTimestamp(props.settings.timestamp !== false)
    setDetectCtrlC(props.settings.detectCtrlC !== undefined ? props.settings.detectCtrlC !== false : legacyDetectCtrl !== false)
    setDetectCtrlD(props.settings.detectCtrlD !== undefined ? props.settings.detectCtrlD !== false : legacyDetectCtrl !== false)
    setSettingsShortcut(props.settings.settingsShortcut !== false)
    setClearShortcut(props.settings.clearShortcut === true)
    setSettingsShortcutKey((props.settings.settingsShortcutKey || KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key).toLowerCase())
    setClearShortcutKey((props.settings.clearShortcutKey || KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key).toLowerCase())
    setSettingsShortcutShift(props.settings.settingsShortcutShift === true)
    setClearShortcutShift(props.settings.clearShortcutShift === true)
    setDownloadFormat(props.settings.downloadFormat || 'ask')
    setParseANSIOutput(props.settings.parseANSIOutput !== false)
    setAdvanced(props.settings.advanced === true)
    setControlAliases(props.settings.customControlAliases || [])
    setAliasKey('')
    setAliasShift(false)
    setAliasCode('')
    setCommandKeybinds(props.settings.commandKeybinds || [])
    setKeybindKey('')
    setKeybindShift(false)
    setKeybindText('')

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
        if (captureTarget === 'alias') {
          setAliasKey(normalized)
          setAliasShift(shiftHeld)
        }
        if (captureTarget === 'keybind') {
          setKeybindKey(normalized)
          setKeybindShift(shiftHeld)
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

  const reset = () => {
    if (!props.openPort) setBaudRate(DEFAULT_SETTINGS.baudRate)
    setLineEnding(DEFAULT_SETTINGS.lineEnding)
    setLocalEcho(DEFAULT_SETTINGS.localEcho)
    setTimestamp(DEFAULT_SETTINGS.timestamp)
    setDetectCtrlC(DEFAULT_SETTINGS.detectCtrlC)
    setDetectCtrlD(DEFAULT_SETTINGS.detectCtrlD)
    setSettingsShortcut(DEFAULT_SETTINGS.settingsShortcut)
    setClearShortcut(DEFAULT_SETTINGS.clearShortcut)
    setSettingsShortcutKey(DEFAULT_SETTINGS.settingsShortcutKey)
    setClearShortcutKey(DEFAULT_SETTINGS.clearShortcutKey)
    setSettingsShortcutShift(DEFAULT_SETTINGS.settingsShortcutShift)
    setClearShortcutShift(DEFAULT_SETTINGS.clearShortcutShift)
    setDownloadFormat(DEFAULT_SETTINGS.downloadFormat)
    setParseANSIOutput(DEFAULT_SETTINGS.parseANSIOutput)
    setAdvanced(DEFAULT_SETTINGS.advanced)
    setControlAliases(DEFAULT_SETTINGS.customControlAliases)
    setAliasKey('')
    setAliasShift(false)
    setAliasCode('')
    setCommandKeybinds(DEFAULT_SETTINGS.commandKeybinds || [])
    setKeybindKey('')
    setKeybindShift(false)
    setKeybindText('')
  }

  const save = () => {
    // Check for conflicts between Settings and Clear shortcuts
    if (settingsShortcut && clearShortcut &&
        settingsShortcutKey === clearShortcutKey &&
        settingsShortcutShift === clearShortcutShift) {
      alert('Open Settings and Clear Terminal cannot use the same keybind!')
      return
    }

    const normalizedSettingsKey = (settingsShortcutKey || KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key).toLowerCase()
    const normalizedClearKey = (clearShortcutKey || KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key).toLowerCase()

    props.save({
      baudRate,
      lineEnding,
      localEcho,
      timestamp,
      settingsShortcut,
      clearShortcut,
      detectCtrlC,
      detectCtrlD,
      settingsShortcutKey: normalizedSettingsKey,
      clearShortcutKey: normalizedClearKey,
      settingsShortcutShift,
      clearShortcutShift,
      downloadFormat,
      customControlAliases: controlAliases,
      commandKeybinds: commandKeybinds,
      parseANSIOutput,
      advanced
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

        <FormControl fullWidth sx={formElementCSS}>
          <InputLabel>Baud Rate {props.openPort && '(Requires Reconnect)'}</InputLabel>
          <Select
            value={baudRate}
            onChange={(e) => setBaudRate(Number(e.target.value))}
            label='baudrate'
            disabled={props.openPort}
          >
            {BAUD_RATES.map(baud =>
              <MenuItem value={baud} key={baud}>{baud} baud</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={formElementCSS}>
          <InputLabel notched={true}>Line Ending</InputLabel>
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
          <InputLabel notched={true}>Download Format</InputLabel>
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

        <DialogContentText>
          Keybind Options
        </DialogContentText>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={detectCtrlC}
                onChange={(e) => setDetectCtrlC(e.target.checked)}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            } label='Detect Ctrl+C'
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
            } label='Detect Ctrl+D'
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
            label='Advanced Options'
          />
        </FormGroup>

        <Collapse in={advanced} timeout='auto' unmountOnExit>
          <Divider sx={{ my: 2 }} />

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

          <DialogContentText sx={{ mt: 2 }}>
            Rebindings
          </DialogContentText>

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

          <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {controlAliases.length === 0 && (
              <Typography variant='body2' sx={{ color: '#ffffff80' }}>
                No aliases yet.
              </Typography>
            )}
            {controlAliases.map((entry, index) => (
              <KeybindListItem
                key={`${entry.key}-${index}`}
                entry={entry}
                index={index}
                isSelected={aliasEditIndex === index}
                onClick={() => {
                  setAliasKey(entry.key)
                  setAliasShift(entry.shift)
                  setAliasCode(entry.type === 'code' ? String(entry.value) : (entry.type === 'text' ? entry.value : ''))
                  setCaptureTarget(null)
                  setAliasEditIndex(index)
                }}
                onDelete={() => removeAlias(index)}
              >
                <Typography variant='body2' sx={{ color: '#ffffffcc' }}>
                  sends code {entry.code}
                </Typography>
              </KeybindListItem>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center', flexWrap: 'nowrap', width: '100%' }}>
            <KeyCapture
              captureTarget={captureTarget}
              currentTarget='alias'
              onClick={() => setCaptureTarget('alias')}
              ctrlKey={aliasKey}
              shift={aliasShift}
            />
            <TextField
              placeholder='Control Code'
              variant='outlined'
              value={aliasCode}
              onChange={(e) => setAliasCode(e.target.value)}
              helperText={aliasCode && aliasCodeValid ? `= byte ${aliasCodeParsed}` : ''}
              sx={{
                marginTop: 0.75,
                minWidth: '10em',
                width: 'auto',
                '& .MuiOutlinedInput-root': { height: '56px' }
              }}
              size='small'
              error={aliasCode.length > 0 && !aliasCodeValid}
            />
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={addAlias}
              disabled={!aliasKeyValid || !aliasCodeValid}
              sx={{
                marginTop: 0.75,
                height: '56px',
                color: '#fff',
                borderColor: '#fff',
                '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.38)', borderColor: 'rgba(255, 255, 255, 0.12)' }
              }}
            >
              {aliasEditIndex !== null ? 'Update' : 'Add'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant='subtitle1' sx={{ color: '#ffffffcc', fontWeight: 700 }}>
            Command Keybinds
          </Typography>
          <Typography variant='body2' sx={{ color: '#ffffff99', mt: 0.5 }}>
            Map Ctrl/⌘ + key to send any text string.
          </Typography>

          <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {commandKeybinds.length === 0 && (
              <Typography variant='body2' sx={{ color: '#ffffff80' }}>
                No keybinds yet.
              </Typography>
            )}
            {commandKeybinds.map((entry, index) => (
              <KeybindListItem
                key={`${entry.key}-${index}`}
                entry={entry}
                index={index}
                isSelected={keybindEditIndex === index}
                onClick={() => {
                  setKeybindEditIndex(index)
                  setKeybindKey(entry.key)
                  setKeybindShift(entry.shift)
                  setKeybindText(entry.text)
                }}
                onDelete={() => removeKeybind(index)}
              >
                <Typography variant='body2' sx={{ color: '#ffffffcc', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  sends &quot;{entry.text}&quot;
                </Typography>
              </KeybindListItem>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center', flexWrap: 'nowrap', width: '100%' }}>
            <KeyCapture
              captureTarget={captureTarget}
              currentTarget='keybind'
              onClick={() => setCaptureTarget('keybind')}
              ctrlKey={keybindKey}
              shift={keybindShift}
            />
            <TextField
              placeholder='Text'
              variant='outlined'
              value={keybindText}
              onChange={(e) => setKeybindText(e.target.value)}
              sx={{
                marginTop: 0.75,
                minWidth: '10em',
                width: 'auto',
                '& .MuiOutlinedInput-root': { height: '56px' }
              }}
              size='small'
              error={keybindText.length > 0 && !keybindTextValid}
            />
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={addKeybind}
              disabled={!keybindKeyValid || !keybindTextValid}
              sx={{
                marginTop: 0.75,
                height: '56px',
                color: '#fff',
                borderColor: '#fff',
                '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.38)', borderColor: 'rgba(255, 255, 255, 0.12)' }
              }}
            >
              {keybindEditIndex !== null ? 'Update' : 'Add'}
            </Button>
          </Box>

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
