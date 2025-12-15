import React, { forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

const useFocus = () => {
  const htmlElRef = React.useRef(null)
  const setFocus = React.useCallback(() => {
    htmlElRef.current && htmlElRef.current.focus()
  }, [])

  return [htmlElRef, setFocus]
}

// Input field and send button for terminal commands
const TerminalInput = forwardRef((props, ref) => {
  const [inputFocus, setInputFocus] = useFocus()

  React.useEffect(() => {
    setInputFocus()
  }, [props.input, setInputFocus])

  // Expose focus method to parent so hotkeys can re-focus input
  useImperativeHandle(ref, () => ({
    focusInput: () => setInputFocus()
  }))

  return (
    <Grid container spacing={0} sx={{ width: '100%' }}>
      <Grid
        item sx={{
          flex: 1,
          paddingRight: '.5em'
        }}
      >
        <TextField
          label='Input'
          variant='outlined'
          onChange={(e) => props.setInput(e.target.value)}
          value={props.input}
          fullWidth
          onKeyDown={(e) => e.key === 'Enter' && props.send()}
          autoComplete='off'
          autoFocus
          inputRef={inputFocus}
        />
      </Grid>
      <Grid
        item sx={{
          width: '8rem'
        }}
      >
        <Button
          sx={{
            height: 56,
            color: '#fff',
            '&.Mui-disabled': {
              color: '#aaa'
            },
            '&.MuiButtonGroup-groupedTextHorizontal:not(:last-child)': {
              borderColor: '#777'
            }
          }}
          variant='contained'
          disableElevation
          onClick={() => props.send()}
          fullWidth
        >Send
        </Button>
      </Grid>
    </Grid>
  )
})

TerminalInput.displayName = 'TerminalInput'

TerminalInput.propTypes = {
  input: PropTypes.string,
  setInput: PropTypes.func,
  send: PropTypes.func
}

export default TerminalInput
