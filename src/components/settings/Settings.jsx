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
  const [captureTarget, setCaptureTarget] = React.useState(null)
  const [advanced, setAdvanced] = React.useState(false)
  const [controlAliases, setControlAliases] = React.useState(props.settings.customControlAliases || [])
  const [aliasKey, setAliasKey] = React.useState('')
  const [aliasShift, setAliasShift] = React.useState(false)
  const [aliasCode, setAliasCode] = React.useState('')
  const [commandKeybinds, setCommandKeybinds] = React.useState(props.settings.commandKeybinds || [])
  const [keybindKey, setKeybindKey] = React.useState('')
  const [keybindShift, setKeybindShift] = React.useState(false)
  const [keybindText, setKeybindText] = React.useState('')

  const formatLabel = (key, shift, fallbackKey) => {
    const finalKey = (key || fallbackKey || '').toUpperCase()
    return `Ctrl${shift ? '+Shift' : ''}+${finalKey}`
  }

  const aliasKeyValid = aliasKey.trim().length === 1
  const aliasCodeNumber = Number(aliasCode)
  const aliasCodeValid = Number.isInteger(aliasCodeNumber) && aliasCodeNumber >= 0 && aliasCodeNumber <= 255

  const keybindKeyValid = keybindKey.trim().length === 1
  const keybindTextValid = keybindText.trim().length > 0

  const addAlias = () => {
    if (!aliasKeyValid || !aliasCodeValid) return
    const normalizedKey = aliasKey.trim().toLowerCase()
    const exists = controlAliases.some((entry) => entry.key === normalizedKey && entry.shift === aliasShift)
    if (exists) {
      const shiftLabel = aliasShift ? 'Ctrl+Shift+' : 'Ctrl+'
      alert(`${shiftLabel}${normalizedKey.toUpperCase()} is already mapped. Delete the existing alias first.`)
      return
    }
    setControlAliases((prev) => [...prev, { key: normalizedKey, shift: aliasShift, code: aliasCodeNumber }])
    setAliasKey('')
    setAliasShift(false)
    setAliasCode('')
  }

  const removeAlias = (index) => {
    setControlAliases((prev) => prev.filter((_, i) => i !== index))
  }

  const addKeybind = () => {
    if (!keybindKeyValid || !keybindTextValid) return
    const normalizedKey = keybindKey.trim().toLowerCase()
    const exists = commandKeybinds.some((entry) => entry.key === normalizedKey && entry.shift === keybindShift)
    if (exists) {
      const shiftLabel = keybindShift ? 'Ctrl+Shift+' : 'Ctrl+'
      alert(`${shiftLabel}${normalizedKey.toUpperCase()} is already mapped. Delete the existing keybind first.`)
      return
    }
    setCommandKeybinds((prev) => [...prev, { key: normalizedKey, shift: keybindShift, text: keybindText.trim() }])
    setKeybindKey('')
    setKeybindShift(false)
    setKeybindText('')
  }

  const removeKeybind = (index) => {
    setCommandKeybinds((prev) => prev.filter((_, i) => i !== index))
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
    setControlAliases(props.settings.customControlAliases || [])
    setAliasKey('')
    setAliasShift(false)
    setAliasCode('')
    setCommandKeybinds(props.settings.commandKeybinds || [])
    setKeybindKey('')
    setKeybindShift(false)
    setKeybindText('')
    setAdvanced(false)

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

      // Only accept single printable keys for simplicity
      if (e.key && e.key.length === 1) {
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
    setControlAliases(DEFAULT_SETTINGS.customControlAliases)
    setAliasKey('')
    setAliasShift(false)
    setAliasCode('')
    setCommandKeybinds(DEFAULT_SETTINGS.commandKeybinds || [])
    setKeybindKey('')
    setKeybindShift(false)
    setKeybindText('')
    setAdvanced(false)
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
      commandKeybinds: commandKeybinds
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

          <DialogContentText sx={{ mt: 2 }}>
            Rebindings
          </DialogContentText>

          <Typography variant='subtitle1' sx={{ color: '#ffffffcc', mt: 2, fontWeight: 700 }}>
            Open Settings
          </Typography>
          <Box
            role='button'
            tabIndex={0}
            onClick={() => setCaptureTarget('settings')}
            onFocus={() => setCaptureTarget('settings')}
            sx={{
              ...formElementCSS,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.75,
              mt: 0.75,
              borderRadius: 1.5,
              border: '1px solid #666',
              backgroundColor: '#1a1a1a',
              cursor: 'pointer'
            }}
          >
            <Box sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.75,
              borderRadius: 1.25,
              border: '1px solid #ccc',
              backgroundColor: '#2e2e2e',
              fontWeight: 700,
              letterSpacing: 0.75,
              fontSize: '1rem',
              color: '#fff'
            }}>
              <span>Ctrl</span>
              {settingsShortcutShift && <span>Shift</span>}
              <span>{(settingsShortcutKey || KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key).toUpperCase()}</span>
            </Box>
            <Typography variant='body2' sx={{ color: '#ffffffcc' }}>
              {captureTarget === 'settings' ? 'Press a key (Esc to cancel)' : 'Click then press a key'}
            </Typography>
          </Box>

          <Typography variant='subtitle1' sx={{ color: '#ffffffcc', mt: 2, fontWeight: 700 }}>
            Clear Terminal
          </Typography>
          <Box
            role='button'
            tabIndex={0}
            onClick={() => setCaptureTarget('clear')}
            onFocus={() => setCaptureTarget('clear')}
            sx={{
              ...formElementCSS,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.75,
              mt: 0.75,
              borderRadius: 1.5,
              border: '1px solid #666',
              backgroundColor: '#1a1a1a',
              cursor: 'pointer'
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
              {clearShortcutShift && <span>Shift</span>}
              <span>{(clearShortcutKey || KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key).toUpperCase()}</span>
            </Box>
            <Typography variant='body2' sx={{ color: '#ffffffcc' }}>
              {captureTarget === 'clear' ? 'Press a key (Esc to cancel)' : 'Click then press a key'}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant='subtitle1' sx={{ color: '#ffffffcc', fontWeight: 700 }}>
            Control Aliases
          </Typography>
          <Typography variant='body2' sx={{ color: '#ffffff99', mt: 0.5 }}>
            Map Ctrl/⌘ + key to send a control code.
          </Typography>

          <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {controlAliases.length === 0 && (
              <Typography variant='body2' sx={{ color: '#ffffff80' }}>
                No aliases yet.
              </Typography>
            )}
            {controlAliases.map((entry, index) => (
              <Box
                key={`${entry.key}-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.25,
                  borderRadius: 1.25,
                  border: '1px solid #555',
                  backgroundColor: '#1e1e1e'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                    {entry.shift && <span>Shift</span>}
                    <span>{(entry.key || '').toUpperCase()}</span>
                  </Box>
                  <Typography variant='body2' sx={{ color: '#ffffffcc' }}>
                    sends code {entry.code}
                  </Typography>
                </Box>
                <IconButton aria-label='Delete alias' size='small' onClick={() => removeAlias(index)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center', flexWrap: 'nowrap', width: '100%' }}>
            <Box
              role='button'
              tabIndex={0}
              onClick={() => setCaptureTarget('alias')}
              onFocus={() => setCaptureTarget('alias')}
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
                {aliasShift && <span>Shift</span>}
                <span>{aliasKey ? aliasKey.toUpperCase() : '?'}</span>
              </Box>
              <Typography variant='body2' sx={{ color: '#ffffffcc' }}>
                {captureTarget === 'alias' ? 'Press a key (Esc to cancel)' : 'Click then press a key'}
              </Typography>
            </Box>
            <TextField
              placeholder='Code (0-255)'
              variant='outlined'
              value={aliasCode}
              onChange={(e) => setAliasCode(e.target.value)}
              type='number'
              inputProps={{ min: 0, max: 255 }}
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
              Add
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
              <Box
                key={`${entry.key}-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.25,
                  borderRadius: 1.25,
                  border: '1px solid #555',
                  backgroundColor: '#1e1e1e'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                    {entry.shift && <span>Shift</span>}
                    <span>{(entry.key || '').toUpperCase()}</span>
                  </Box>
                  <Typography variant='body2' sx={{ color: '#ffffffcc', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    sends "{entry.text}"
                  </Typography>
                </Box>
                <IconButton aria-label='Delete keybind' size='small' onClick={() => removeKeybind(index)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center', flexWrap: 'nowrap', width: '100%' }}>
            <Box
              role='button'
              tabIndex={0}
              onClick={() => setCaptureTarget('keybind')}
              onFocus={() => setCaptureTarget('keybind')}
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
                {keybindShift && <span>Shift</span>}
                <span>{keybindKey ? keybindKey.toUpperCase() : '?'}</span>
              </Box>
              <Typography variant='body2' sx={{ color: '#ffffffcc' }}>
                {captureTarget === 'keybind' ? 'Press a key (Esc to cancel)' : 'Click then press a key'}
              </Typography>
            </Box>
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
              Add
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
