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

import { BAUD_RATES, LINE_ENDING_VALUES, LINE_ENDING_LABELS, DEFAULT_SETTINGS, KEYBOARD_SHORTCUTS } from '../../constants'

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
  const [detectCtrl, setDetectCtrl] = React.useState(props.settings.detectCtrl !== false)
  const [settingsShortcut, setSettingsShortcut] = React.useState(props.settings.settingsShortcut !== false)
  const [clearShortcut, setClearShortcut] = React.useState(props.settings.clearShortcut === true)

  const cancel = () => {
    setBaudRate(props.settings.baudRate)
    setLineEnding(props.settings.lineEnding)
    setLocalEcho(props.settings.localEcho !== false)
    setTimestamp(props.settings.timestamp !== false)
    setDetectCtrl(props.settings.detectCtrl !== false)
    setSettingsShortcut(props.settings.settingsShortcut !== false)
    setClearShortcut(props.settings.clearShortcut === true)

    props.close()
  }

  const reset = () => {
    if (!props.openPort) setBaudRate(DEFAULT_SETTINGS.baudRate)
    setLineEnding(DEFAULT_SETTINGS.lineEnding)
    setLocalEcho(DEFAULT_SETTINGS.localEcho)
    setTimestamp(DEFAULT_SETTINGS.timestamp)
    setDetectCtrl(DEFAULT_SETTINGS.detectCtrl)
    setSettingsShortcut(DEFAULT_SETTINGS.settingsShortcut)
    setClearShortcut(DEFAULT_SETTINGS.clearShortcut)
  }

  const save = () => {
    props.save({
      baudRate,
      lineEnding,
      localEcho,
      timestamp,
      detectCtrl,
      settingsShortcut,
      clearShortcut
    })

    props.close()
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.close}
      disableScrollLock
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

        <DialogContentText sx={{ mt: 3 }}>
          Display Options
        </DialogContentText>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={localEcho}
                onChange={(e) => setLocalEcho(e.target.checked)}
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
              />
            } label='Show timestamps'
          />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        <DialogContentText>
          Keyboard Shortcuts
        </DialogContentText>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={detectCtrl}
                onChange={(e) => setDetectCtrl(e.target.checked)}
              />
            } label='Detect Ctrl+C, Ctrl+D'
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={settingsShortcut}
                onChange={(e) => setSettingsShortcut(e.target.checked)}
              />
            } label={`${KEYBOARD_SHORTCUTS.OPEN_SETTINGS.description} (${KEYBOARD_SHORTCUTS.OPEN_SETTINGS.label})`}
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={clearShortcut}
                onChange={(e) => setClearShortcut(e.target.checked)}
              />
            } label={`${KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.description} (${KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.label})`}
          />
        </FormGroup>

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
