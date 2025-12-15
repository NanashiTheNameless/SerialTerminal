import React from 'react'
import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import HistoryIcon from '@mui/icons-material/History'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import DownloadIcon from '@mui/icons-material/Download'
import SettingsIcon from '@mui/icons-material/Settings'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import TerminalIcon from '@mui/icons-material/Terminal'

import { parseANSI, stripANSI } from '../../utils/ansiParser'
import { DEFAULT_SETTINGS } from '../../constants'
import './TerminalOutput.css'
import { quickHotkeysPropType } from './propTypes'

const TerminalOutput = React.memo((props) => {
  const {
    quickHotkeys,
    focusInput,
    onClearRequest,
    openSettings,
    onDisconnect,
    history,
    downloadFormat,
    time
  } = props

  // User input history window
  const [historyOpen, setHistoryOpen] = React.useState(false)
  // Format selection dialog
  const [formatDialogOpen, setFormatDialogOpen] = React.useState(false)
  const [selectedFormat, setSelectedFormat] = React.useState('txt')
  const containerRef = React.useRef(null)

  const performDownload = React.useCallback((format) => {
    let content = ''
    let filename = `terminal-output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`
    let mimeType = 'text/plain'

    switch (format) {
      case 'txt':
        content = history.map(line => {
          const timePrefix = time ? `${line.time.toTimeString().substring(0, 8)} ` : ''
          const prefix = line.type === 'userInput' ? '> ' : '< '
          const cleanValue = stripANSI(line.value)
          return `${timePrefix}${prefix}${cleanValue}`
        }).join('\n')
        filename += '.txt'
        mimeType = 'text/plain'
        break

      case 'csv':
        content = 'Timestamp,Type,Value\n' + history.map(line => {
          const time = line.time.toISOString()
          const cleanValue = stripANSI(line.value)
          const value = `"${cleanValue.replace(/"/g, '""')}"`
          return `${time},${line.type},${value}`
        }).join('\n')
        filename += '.csv'
        mimeType = 'text/csv'
        break

      case 'json':
        content = JSON.stringify(history.map(line => ({
          timestamp: line.time.toISOString(),
          type: line.type,
          value: line.value
        })), null, 2)
        filename += '.json'
        mimeType = 'application/json'
        break

      case 'md':
        content = '# Terminal Output\n\n'
        content += `Generated: ${new Date().toISOString()}\n\n`
        content += '## Session Log\n\n'
        history.forEach(line => {
          const timePrefix = time ? `${line.time.toTimeString().substring(0, 8)} ` : ''
          const cleanValue = stripANSI(line.value)
          if (line.type === 'userInput') {
            content += `**${timePrefix}Input:**\n\`\`\`\n${cleanValue}\n\`\`\`\n\n`
          } else {
            content += `${timePrefix}Output:\n\`\`\`\n${cleanValue}\n\`\`\`\n\n`
          }
        })
        filename += '.md'
        mimeType = 'text/markdown'
        break

      default:
        content = history.map(line => stripANSI(line.value)).join('\n')
        filename += '.txt'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [history, time])

  const handleDownload = React.useCallback(() => {
    if (!history || history.length === 0) return

    const format = downloadFormat || 'ask'
    if (format === 'ask') {
      setSelectedFormat('txt')
      setFormatDialogOpen(true)
      return
    }

    performDownload(format)
  }, [history, downloadFormat, performDownload])

  const handleFormatConfirm = () => {
    performDownload(selectedFormat)
    setFormatDialogOpen(false)
  }

  // Keep view pinned to most recent output
  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [props.history.length])

  // Keyboard shortcuts for accessibility inside the log
  React.useEffect(() => {
    const hotkeys = quickHotkeys || {}
    if (hotkeys.enabled === false) return

    const focusKey = (hotkeys.focus || DEFAULT_SETTINGS.quickFocusKey).toLowerCase()
    const historyKey = (hotkeys.history || DEFAULT_SETTINGS.quickHistoryKey).toLowerCase()
    const downloadKey = (hotkeys.download || DEFAULT_SETTINGS.quickDownloadKey).toLowerCase()
    const clearKey = (hotkeys.clear || DEFAULT_SETTINGS.quickClearKey).toLowerCase()
    const settingsKey = (hotkeys.settings || DEFAULT_SETTINGS.quickSettingsKey).toLowerCase()
    const disconnectKey = (hotkeys.disconnect || DEFAULT_SETTINGS.quickDisconnectKey).toLowerCase()
    const focusShift = hotkeys.focusShift === true || DEFAULT_SETTINGS.quickFocusShift === true
    const historyShift = hotkeys.historyShift === true || DEFAULT_SETTINGS.quickHistoryShift === true
    const downloadShift = hotkeys.downloadShift === true || DEFAULT_SETTINGS.quickDownloadShift === true
    const clearShift = hotkeys.clearShift === true || DEFAULT_SETTINGS.quickClearShift === true
    const settingsShift = hotkeys.settingsShift === true || DEFAULT_SETTINGS.quickSettingsShift === true
    const disconnectShift = hotkeys.disconnectShift === true || DEFAULT_SETTINGS.quickDisconnectShift === true

    const handler = (e) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key?.toLowerCase()
        if (key === focusKey && (!!focusShift === e.shiftKey)) {
          e.preventDefault()
          focusInput?.()
          return
        }
        if (key === historyKey && (!!historyShift === e.shiftKey)) {
          e.preventDefault()
          setHistoryOpen(true)
          return
        }
        if (key === downloadKey && (!!downloadShift === e.shiftKey)) {
          e.preventDefault()
          handleDownload()
          return
        }
        if (key === clearKey && (!!clearShift === e.shiftKey)) {
          e.preventDefault()
          onClearRequest?.()
          return
        }
        if (key === settingsKey && (!!settingsShift === e.shiftKey)) {
          e.preventDefault()
          openSettings?.()
          return
        }
        if (key === disconnectKey && (!!disconnectShift === e.shiftKey)) {
          e.preventDefault()
          onDisconnect?.()
          return
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [quickHotkeys, focusInput, onClearRequest, openSettings, onDisconnect, handleDownload])

  return (
    <section className='terminalOutput' aria-label='Terminal output'>

      {/* Buttons */}
      <ButtonGroup variant='text' className='terminalButtons' aria-label='Terminal controls'>

        {/* Clear */}
        <Button onClick={props.onClearRequest} aria-label='Clear terminal history'>
          <HighlightOffIcon color='inherit' />
        </Button>

        {/* History */}
        <Button onClick={() => setHistoryOpen(true)} aria-label='Open command history'>
          <HistoryIcon color='inherit' />
        </Button>

        {/* Download */}
        <Button onClick={handleDownload} aria-label='Download terminal output' disabled={!props.history || props.history.length === 0}>
          <DownloadIcon color='inherit' />
        </Button>

        {/* Settings */}
        <Button onClick={props.openSettings} aria-label='Open settings'>
          <SettingsIcon color='inherit' />
        </Button>
      </ButtonGroup>

      {/* Text */}
      <Box className='codeContainer' aria-live='polite' role='log' ref={containerRef}>
        {props.history.filter(line => (line.type === 'output' || props.echo)).map((line, i) => {
          const segments = props.parseANSIOutput ? parseANSI(line.value) : [{ text: line.value, style: {} }]
          return (
            <div key={i} className={`codeLine ${line.type}`}>
              {props.time && (
                <span className='time'>{line.time.toTimeString().substring(0, 8)}</span>
              )}
              <span className={`value ${line.type}`}>
                {segments.map((segment, idx) => (
                  <span key={idx} style={segment.style}>{segment.text}</span>
                ))}
              </span>
            </div>
          )
        })}
      </Box>

      {/* Clear Confirmation Dialog */}
      <Dialog
        open={props.clearConfirmOpen}
        onClose={props.onClearCancel}
        aria-labelledby='clear-dialog-title'
      >
        <DialogTitle id='clear-dialog-title'>
          Clear Terminal History?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will clear all terminal output. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClearCancel}>Cancel</Button>
          <Button onClick={props.onClearConfirm} color='primary' autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Popup */}
      <Dialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        aria-labelledby='history-dialog-title'
      >
        <DialogTitle id='history-dialog-title'>
          History
        </DialogTitle>
        <List sx={{ minWidth: '10em' }}>
          {props.history.filter(line => line.type === 'userInput').map((line, i) => (
            <ListItem
              button key={i} onClick={() => {
                props.setInput(line.value)
                setHistoryOpen(false)
              }}
            >
              <ListItemIcon>
                <TerminalIcon />
              </ListItemIcon>
              <ListItemText primary={line.value} />
            </ListItem>
          ))}
        </List>
      </Dialog>

      {/* Format Selection Dialog */}
      <Dialog
        open={formatDialogOpen}
        onClose={() => setFormatDialogOpen(false)}
        aria-labelledby='format-dialog-title'
      >
        <DialogTitle id='format-dialog-title'>
          Select Download Format
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose the format for downloading terminal output:
          </DialogContentText>
          <RadioGroup
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <FormControlLabel value="txt" control={<Radio />} label="Plain Text (.txt)" />
            <FormControlLabel value="csv" control={<Radio />} label="CSV (.csv)" />
            <FormControlLabel value="json" control={<Radio />} label="JSON (.json)" />
            <FormControlLabel value="md" control={<Radio />} label="Markdown (.md)" />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormatDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleFormatConfirm} color='primary' autoFocus>
            Download
          </Button>
        </DialogActions>
      </Dialog>

    </section>
  )
})

TerminalOutput.displayName = 'TerminalOutput'

TerminalOutput.propTypes = {
  history: PropTypes.array.isRequired,
  setHistory: PropTypes.func.isRequired,
  setInput: PropTypes.func.isRequired,
  openSettings: PropTypes.func.isRequired,
  clearConfirmOpen: PropTypes.bool,
  onClearRequest: PropTypes.func,
  onClearConfirm: PropTypes.func,
  onClearCancel: PropTypes.func,
  onDisconnect: PropTypes.func,
  downloadFormat: PropTypes.string,
  echo: PropTypes.bool,
  time: PropTypes.bool,
  parseANSIOutput: PropTypes.bool,
  focusInput: PropTypes.func,
  quickHotkeys: quickHotkeysPropType
}

export default TerminalOutput
