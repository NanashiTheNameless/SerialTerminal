import React, { forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'

import TerminalOutput from './TerminalOutput'
import TerminalInput from './TerminalInput'
import { CTRL_C, CTRL_D, MAX_HISTORY_LENGTH } from '../../constants'

// Main terminal interface for serial communication
const Terminal = forwardRef((props, ref) => {
  // User input from input field
  const [input, setInput] = React.useState('')

  // Currently received string
  const received = React.useRef('')

  // List of received lines
  const [history, setHistory] = React.useState([])

  // Expose clearHistory method to parent
  useImperativeHandle(ref, () => ({
    clearHistory: () => {
      setHistory([])
      received.current = ''
    }
  }))

  React.useEffect(
    () => {
      const str = `${received.current}${props.received.value}`
      const lines = str.split('\n')

      let newReceived = str
      const newLines = []

      if (lines.length > 1) {
        newReceived = lines.pop()

        lines.forEach(line => {
          newLines.push({
            type: 'output',
            value: `${line}`,
            time: props.received.time
          })
        })
      }
      
      // Apply history length limit
      setHistory((current) => {
        const combined = current.concat(newLines)
        if (combined.length > MAX_HISTORY_LENGTH) {
          return combined.slice(-MAX_HISTORY_LENGTH)
        }
        return combined
      })
      received.current = newReceived
    },
    [props.received]
  )

  const handleSend = () => {
    props.send(input)

    setHistory((current) => {
      const newHistory = [
        ...current,
        {
          type: 'userInput',
          value: input,
          time: new Date()
        }
      ]
      // Apply history length limit
      if (newHistory.length > MAX_HISTORY_LENGTH) {
        return newHistory.slice(-MAX_HISTORY_LENGTH)
      }
      return newHistory
    })
    setInput('')
  }

  const handleKeyDown = (e) => {
    const charCode = String.fromCharCode(e.which).toUpperCase()

    if (props.ctrlC && (e.ctrlKey || e.metaKey) && charCode === 'C') {
      e.preventDefault()
      props.sendRaw(CTRL_C.charCodeAt(0))
    }

    if (props.ctrlD && (e.ctrlKey || e.metaKey) && charCode === 'D') {
      e.preventDefault()
      props.sendRaw(CTRL_D.charCodeAt(0))
    }

    if (props.controlAliases && (e.ctrlKey || e.metaKey)) {
      const match = props.controlAliases.find(alias => alias && alias.key && alias.key.toUpperCase() === charCode)
      if (match && typeof match.code === 'number') {
        e.preventDefault()
        props.sendRaw(match.code)
      }
    }

    if (props.commandKeybinds && (e.ctrlKey || e.metaKey)) {
      const match = props.commandKeybinds.find(keybind => keybind && keybind.key && keybind.key.toUpperCase() === charCode && keybind.shift === (e.shiftKey))
      if (match && typeof match.text === 'string') {
        e.preventDefault()
        props.send(match.text)
        setHistory((current) => {
          const newHistory = [
            ...current,
            {
              type: 'userInput',
              value: match.text,
              time: new Date()
            }
          ]
          if (newHistory.length > MAX_HISTORY_LENGTH) {
            return newHistory.slice(-MAX_HISTORY_LENGTH)
          }
          return newHistory
        })
      }
    }
  }

  return (
    <Grid container spacing={1} sx={{ p: 0.75, flexGrow: 1, minHeight: 0, overflow: 'hidden' }} onKeyDown={handleKeyDown}>
      {/* Terminal Window */}
      <Grid item xs={12}>
        <TerminalOutput
          history={history}
          setHistory={setHistory}
          setInput={setInput}
          openSettings={props.openSettings}
          clearConfirmOpen={props.clearConfirmOpen}
          onClearRequest={props.onClearRequest}
          onClearConfirm={props.onClearConfirm}
          onClearCancel={props.onClearCancel}
          downloadFormat={props.downloadFormat}
          echo={props.echo}
          time={props.time}
        />
      </Grid>

      {/* Input Field & Send Button */}
      <Grid item xs={12}>
        <TerminalInput
          input={input}
          setInput={setInput}
          send={handleSend}
        />
      </Grid>
    </Grid>
  )
})

Terminal.displayName = 'Terminal'

Terminal.propTypes = {
  received: PropTypes.object,
  send: PropTypes.func,
  sendRaw: PropTypes.func,
  openSettings: PropTypes.func,
  showToast: PropTypes.func,
  clearConfirmOpen: PropTypes.bool,
  onClearRequest: PropTypes.func,
  onClearConfirm: PropTypes.func,
  onClearCancel: PropTypes.func,
  downloadFormat: PropTypes.string,
  echo: PropTypes.bool,
  time: PropTypes.bool,
  ctrlC: PropTypes.bool,
  ctrlD: PropTypes.bool,
  controlAliases: PropTypes.array,
  commandKeybinds: PropTypes.array
}

export default Terminal
