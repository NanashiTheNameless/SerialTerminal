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

import './TerminalOutput.css'

const TerminalOutput = React.memo((props) => {
  // User input history window
  const [historyOpen, setHistoryOpen] = React.useState(false)
  // Format selection dialog
  const [formatDialogOpen, setFormatDialogOpen] = React.useState(false)
  const [selectedFormat, setSelectedFormat] = React.useState('txt')

  const handleDownload = () => {
    if (!props.history || props.history.length === 0) return

    const format = props.downloadFormat || 'ask'
    if (format === 'ask') {
      setSelectedFormat('txt')
      setFormatDialogOpen(true)
      return
    }

    performDownload(format)
  }

  const performDownload = (format) => {
    let content = ''
    let filename = `terminal-output-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`
    let mimeType = 'text/plain'

    switch (format) {
      case 'txt':
        content = props.history.map(line => {
          const time = props.time ? `${line.time.toTimeString().substring(0, 8)} ` : ''
          const prefix = line.type === 'userInput' ? '> ' : '< '
          return `${time}${prefix}${line.value}`
        }).join('\n')
        filename += '.txt'
        mimeType = 'text/plain'
        break

      case 'csv':
        content = 'Timestamp,Type,Value\n' + props.history.map(line => {
          const time = line.time.toISOString()
          const value = `"${line.value.replace(/"/g, '""')}"`
          return `${time},${line.type},${value}`
        }).join('\n')
        filename += '.csv'
        mimeType = 'text/csv'
        break

      case 'json':
        content = JSON.stringify(props.history.map(line => ({
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
        props.history.forEach(line => {
          const time = props.time ? `${line.time.toTimeString().substring(0, 8)} ` : ''
          if (line.type === 'userInput') {
            content += `**${time}Input:**\n\`\`\`\n${line.value}\n\`\`\`\n\n`
          } else {
            content += `${time}Output:\n\`\`\`\n${line.value}\n\`\`\`\n\n`
          }
        })
        filename += '.md'
        mimeType = 'text/markdown'
        break

      default:
        content = props.history.map(line => line.value).join('\n')
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
  }

  const handleFormatConfirm = () => {
    performDownload(selectedFormat)
    setFormatDialogOpen(false)
  }

  return (
    <pre className='terminalOutput' aria-label='Terminal output'>

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
      <Box className='codeContainer' aria-live='polite'>
        <code>
          {props.history.filter(line => (line.type === 'output' || props.echo)).map((line, i) => (
            <p key={i}>
              <span className='time'>{props.time && `${line.time.toTimeString().substring(0, 8)} `}</span>
              <span className={line.type}>{line.value}</span>
            </p>
          ))}
        </code>
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

    </pre>
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
  downloadFormat: PropTypes.string,
  echo: PropTypes.bool,
  time: PropTypes.bool
}

export default TerminalOutput
