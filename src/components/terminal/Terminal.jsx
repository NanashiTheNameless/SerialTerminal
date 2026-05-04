import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import PropTypes from 'prop-types'
import { useHotkeys } from 'react-hotkeys-hook'

import Grid from '@mui/material/Grid'

import TerminalOutput from './TerminalOutput'
import TerminalInput from './TerminalInput'
import { CTRL_C, CTRL_D, MAX_HISTORY_LENGTH } from '../../constants'
import { quickHotkeysPropType } from './propTypes'
import { matchesKeybind } from '../../utils/keybinds'

// Helper to get character code from control character string
const getControlCode = (ctrlChar) => ctrlChar.charCodeAt(0)
const Terminal = forwardRef((props, ref) => {
  // User input from input field
  const [input, setInput] = React.useState('')

  // Ref to the input component to allow keyboard focus shortcuts
  const inputRef = useRef(null)

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

  // Helper to find a keybind match
  const findKeybindMatch = (keybinds, event) => {
    return keybinds?.find(kb => matchesKeybind(event, { key: kb?.key, shift: kb?.shift === true, modifier: kb?.modifier || 'primary' }))
  }

  const handleKeyDown = (e) => {
    // Check Ctrl+C
    if (props.ctrlC && matchesKeybind(e, { key: 'c', primary: true })) {
      e.preventDefault()
      props.sendRaw(getControlCode(CTRL_C))
      return
    }

    // Check Ctrl+D
    if (props.ctrlD && matchesKeybind(e, { key: 'd', primary: true })) {
      e.preventDefault()
      props.sendRaw(getControlCode(CTRL_D))
      return
    }

    // Check control aliases
    const aliasMatch = findKeybindMatch(props.controlAliases, e)
    if (aliasMatch) {
      e.preventDefault()
      // Handle both raw codes and text sequences
      if (aliasMatch.type === 'code' && typeof aliasMatch.value === 'number') {
        props.sendRaw(aliasMatch.value)
      } else if (aliasMatch.type === 'text' && typeof aliasMatch.value === 'string') {
        props.send(aliasMatch.value)
      }
      return
    }

    // Check command keybinds
    const commandMatch = findKeybindMatch(props.commandKeybinds, e)
    if (commandMatch && typeof commandMatch.text === 'string') {
      e.preventDefault()
      props.send(commandMatch.text)
      setHistory((current) => {
        const newHistory = [
          ...current,
          {
            type: 'userInput',
            value: commandMatch.text,
            time: new Date()
          }
        ]
        return newHistory.length > MAX_HISTORY_LENGTH ? newHistory.slice(-MAX_HISTORY_LENGTH) : newHistory
      })
    }
  }

  useHotkeys('*', handleKeyDown, {
    enableOnFormTags: true
  }, [
    props.ctrlC,
    props.ctrlD,
    props.controlAliases,
    props.commandKeybinds,
    props.sendRaw,
    props.send
  ])

  return (
    <Grid container spacing={1} sx={{ p: 0.75, flexGrow: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Terminal Window */}
      <Grid sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <TerminalOutput
          history={history}
          setHistory={setHistory}
          setInput={setInput}
          focusInput={() => inputRef.current?.focusInput?.()}
          openSettings={props.openSettings}
          clearConfirmOpen={props.clearConfirmOpen}
          onClearRequest={props.onClearRequest}
          onClearConfirm={props.onClearConfirm}
          onClearCancel={props.onClearCancel}
          onDisconnect={props.onDisconnect}
          downloadFormat={props.downloadFormat}
          echo={props.echo}
          time={props.time}
          parseANSIOutput={props.parseANSIOutput}
          quickHotkeys={props.quickHotkeys}
        />
      </Grid>

      {/* Input Field & Send Button */}
      <Grid sx={{ flexShrink: 0 }}>
        <TerminalInput
          ref={inputRef}
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
  onDisconnect: PropTypes.func,
  downloadFormat: PropTypes.string,
  echo: PropTypes.bool,
  time: PropTypes.bool,
  ctrlC: PropTypes.bool,
  ctrlD: PropTypes.bool,
  controlAliases: PropTypes.array,
  commandKeybinds: PropTypes.array,
  parseANSIOutput: PropTypes.bool,
  quickHotkeys: quickHotkeysPropType
}

export default Terminal
