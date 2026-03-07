import React from 'react'
import PropTypes from 'prop-types'

import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import DeleteIcon from '@mui/icons-material/Delete'
import { ESPLoader, Transport } from 'esptool-js'

import { ALL_BAUD_RATES, COMMON_BAUD_RATES, DEFAULT_SETTINGS } from '../../constants'

const DEFAULT_ADDRESS = DEFAULT_SETTINGS.flashAddress
const DEFAULT_FLASH_BAUD = DEFAULT_SETTINGS.flashBaudRate
const MAX_LOG_LINES = 250
const FIRMWARE_PROXY_URL = 'https://cors.namelessnanashi.dev/?url='
const IS_OFFLINE_BUILD = import.meta.env.VITE_OFFLINE_BUILD === 'true'

const formElementCSS = {
  marginTop: 1,
  minWidth: '10em'
}

const firmwareSelectButtonSx = {
  justifyContent: 'flex-start',
  height: 56,
  px: 1.75,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '&.Mui-disabled': {
    color: 'var(--terminal-muted)',
    borderColor: 'var(--terminal-border)',
    WebkitTextFillColor: 'var(--terminal-muted)',
    opacity: 1
  }
}

const themedScrollbarSx = {
  scrollbarWidth: 'thin',
  scrollbarColor: 'var(--terminal-muted) transparent',
  '&::-webkit-scrollbar': {
    width: 8,
    height: 8
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
    borderRadius: 4
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'var(--terminal-muted)',
    borderRadius: 4
  },
  '&::-webkit-scrollbar-corner': {
    background: 'transparent',
    borderRadius: 4
  }
}

const dialogSx = {
  '& .MuiDialog-paper': {
    backgroundColor: 'var(--terminal-bg)',
    color: 'var(--terminal-fg)',
    border: '1px solid var(--terminal-border)'
  },
  '& .MuiDialogTitle-root, & .MuiDialogContentText-root, & .MuiTypography-root, & .MuiFormControlLabel-label': {
    color: 'var(--terminal-fg) !important'
  },
  '& .MuiDivider-root': {
    borderColor: 'var(--terminal-border)'
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--terminal-bg)',
    color: 'var(--terminal-fg)'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--terminal-border) !important'
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--terminal-user-input) !important'
  },
  '& .MuiInputLabel-root, & .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.Mui-disabled': {
    color: 'var(--terminal-fg) !important'
  },
  '& .MuiInputBase-input.Mui-disabled, & .MuiSelect-select.Mui-disabled': {
    WebkitTextFillColor: 'var(--terminal-muted) !important',
    color: 'var(--terminal-muted) !important',
    opacity: 1
  },
  '& .MuiInputBase-root.Mui-disabled .MuiSvgIcon-root': {
    color: 'var(--terminal-muted) !important',
    fill: 'var(--terminal-muted) !important'
  },
  '& .MuiFormControlLabel-root.Mui-disabled .MuiFormControlLabel-label': {
    color: 'var(--terminal-muted) !important'
  },
  '& .MuiCheckbox-root': {
    color: '#ffffffb3'
  },
  '& .MuiCheckbox-root.Mui-checked': {
    color: '#fff'
  },
  '& .MuiCheckbox-root.Mui-disabled': {
    color: 'var(--terminal-muted) !important'
  },
  '& .MuiCheckbox-root.Mui-disabled.Mui-checked': {
    color: 'var(--terminal-muted) !important'
  },
  '& .MuiSelect-icon, & .MuiSvgIcon-root': {
    color: 'var(--terminal-fg) !important',
    fill: 'var(--terminal-fg) !important'
  },
  '& .MuiLinearProgress-root': {
    backgroundColor: 'var(--terminal-border)'
  },
  '& .MuiLinearProgress-bar': {
    backgroundColor: 'var(--terminal-user-input)'
  },
  '& .MuiAlert-root': {
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
    color: 'var(--terminal-fg)',
    border: '1px solid rgba(248, 113, 113, 0.45)'
  },
  '& .MuiAlert-icon': {
    color: '#f87171'
  }
}

const footerButtonSx = {
  '&.Mui-disabled': {
    color: 'var(--terminal-muted)',
    WebkitTextFillColor: 'var(--terminal-muted)',
    opacity: 1
  }
}

let nextFirmwareEntryId = 1

const createFirmwareEntry = (address = DEFAULT_ADDRESS) => ({
  id: nextFirmwareEntryId++,
  file: null,
  url: '',
  address
})

const parseAddress = (value) => {
  const normalized = `${value || ''}`.trim().toLowerCase()
  if (normalized.length === 0) {
    throw new Error('Flash address is required')
  }

  let parsed
  if (/^0x[0-9a-f]+$/i.test(normalized)) {
    parsed = Number.parseInt(normalized.slice(2), 16)
  } else if (/^[0-9]+$/.test(normalized)) {
    parsed = Number.parseInt(normalized, 10)
  } else {
    throw new Error('Flash address must be a positive number (e.g. 0x0, 0x1000, 4096)')
  }

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error('Flash address must be a positive number (e.g. 0x0, 0x1000, 4096)')
  }

  return parsed
}

const uint8ArrayToBinaryString = (bytes) => {
  const chunkSize = 0x8000
  const chunks = []

  for (let index = 0; index < bytes.length; index += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(index, index + chunkSize)))
  }

  return chunks.join('')
}

const ESPToolFlasherDialog = ({ open, close, settings, updateSettings, onSuccess, onError }) => {
  const [firmwareEntries, setFirmwareEntries] = React.useState(() => [createFirmwareEntry(settings.flashAddress || DEFAULT_ADDRESS)])
  const [flashBaudRate, setFlashBaudRate] = React.useState(settings.flashBaudRate || DEFAULT_FLASH_BAUD)
  const [eraseAll, setEraseAll] = React.useState(settings.flashEraseAll !== false)
  const [advanced, setAdvanced] = React.useState(settings.advanced === true)
  const [allowUncommonBaudrates, setAllowUncommonBaudrates] = React.useState(settings.allowUncommonBaudrates === true)
  const [allowArbitraryBaudrates, setAllowArbitraryBaudrates] = React.useState(settings.allowArbitraryBaudrates === true)
  const [splitFirmwareFiles, setSplitFirmwareFiles] = React.useState(settings.splitFirmwareFiles === true)
  const [allowAnyFileFormat, setAllowAnyFileFormat] = React.useState(settings.allowAnyFileFormat === true)
  const [flashing, setFlashing] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState('')
  const [logs, setLogs] = React.useState([])
  const dialogContentRef = React.useRef(null)
  const logsRef = React.useRef(null)
  const progressSectionRef = React.useRef(null)
  const flashRunIdRef = React.useRef(0)
  const activeTransportRef = React.useRef(null)

  const appendLog = React.useCallback((line) => {
    const text = `${line ?? ''}`.trim()
    if (text.length === 0) return
    setLogs((current) => {
      const next = [...current, text]
      return next.length > MAX_LOG_LINES ? next.slice(-MAX_LOG_LINES) : next
    })
  }, [])

  const persistFlasherSettings = React.useCallback(() => {
    updateSettings({
      advanced,
      allowUncommonBaudrates,
      allowArbitraryBaudrates,
      flashBaudRate,
      flashAddress: firmwareEntries[0]?.address || settings.flashAddress || DEFAULT_ADDRESS,
      flashEraseAll: eraseAll,
      splitFirmwareFiles,
      allowAnyFileFormat
    })
  }, [
    advanced,
    allowAnyFileFormat,
    allowArbitraryBaudrates,
    allowUncommonBaudrates,
    eraseAll,
    flashBaudRate,
    firmwareEntries,
    settings.flashAddress,
    splitFirmwareFiles,
    updateSettings
  ])

  React.useEffect(() => {
    if (!open) return

    setFirmwareEntries([createFirmwareEntry(settings.flashAddress || DEFAULT_ADDRESS)])
    setFlashBaudRate(settings.flashBaudRate || DEFAULT_FLASH_BAUD)
    setEraseAll(settings.flashEraseAll !== false)
    setAdvanced(settings.advanced === true)
    setAllowUncommonBaudrates(settings.allowUncommonBaudrates === true)
    setAllowArbitraryBaudrates(settings.allowArbitraryBaudrates === true)
    setSplitFirmwareFiles(settings.splitFirmwareFiles === true)
    setAllowAnyFileFormat(settings.allowAnyFileFormat === true)
    setFlashing(false)
    setProgress(0)
    setError('')
    setLogs([])
  }, [
    open,
    settings.advanced,
    settings.allowAnyFileFormat,
    settings.allowArbitraryBaudrates,
    settings.allowUncommonBaudrates,
    settings.flashAddress,
    settings.flashBaudRate,
    settings.flashEraseAll,
    settings.splitFirmwareFiles
  ])

  React.useEffect(() => {
    if (allowArbitraryBaudrates === true) return

    const allowedRates = allowUncommonBaudrates === true ? ALL_BAUD_RATES : COMMON_BAUD_RATES
    if (!allowedRates.includes(flashBaudRate)) {
      setFlashBaudRate(DEFAULT_FLASH_BAUD)
    }
  }, [allowArbitraryBaudrates, allowUncommonBaudrates, flashBaudRate])

  React.useEffect(() => {
    if (!open || !logsRef.current) return
    logsRef.current.scrollTop = logsRef.current.scrollHeight
  }, [logs, open])

  React.useEffect(() => {
    if (!open || !flashing || !progressSectionRef.current || !dialogContentRef.current) return

    requestAnimationFrame(() => {
      dialogContentRef.current?.scrollTo({
        top: Math.max(progressSectionRef.current.offsetTop - 12, 0),
        behavior: 'smooth',
      })
    })
  }, [flashing, open])

  const finishClose = React.useCallback(() => {
    persistFlasherSettings()
    close()
  }, [close, persistFlasherSettings])

  const disconnectTransport = React.useCallback((transport) => {
    if (!transport) return

    const timeoutMs = 1500
    const cleanupPromise = transport.disconnect().catch((disconnectError) => {
      console.warn('[FLASHER] transport disconnect failed (ignored):', disconnectError)
    })

    let timeoutId
    void Promise.race([
      cleanupPromise,
      new Promise((resolve) => {
        timeoutId = setTimeout(() => {
          console.warn('[FLASHER] transport disconnect timed out (ignored)')
          resolve()
        }, timeoutMs)
      })
    ]).finally(() => {
      if (timeoutId) clearTimeout(timeoutId)
    })
  }, [])

  const isCurrentFlashRun = React.useCallback((runId) => flashRunIdRef.current === runId, [])
  const appendRunLog = React.useCallback((runId, line) => {
    if (!isCurrentFlashRun(runId)) return
    appendLog(line)
  }, [appendLog, isCurrentFlashRun])
  const cancelActiveFlash = React.useCallback(() => {
    flashRunIdRef.current += 1
    const transport = activeTransportRef.current
    activeTransportRef.current = null
    disconnectTransport(transport)
  }, [disconnectTransport])

  const handleClose = () => {
    if (flashing) {
      cancelActiveFlash()
      setFlashing(false)
      finishClose()
      return
    }
    finishClose()
  }

  const updateFirmwareEntry = (entryId, changes) => {
    setFirmwareEntries((current) => current.map((entry) => (
      entry.id === entryId ? { ...entry, ...changes } : entry
    )))
  }

  const addFirmwareEntry = () => {
    setFirmwareEntries((current) => [...current, createFirmwareEntry()])
  }

  const removeFirmwareEntry = (entryId) => {
    setFirmwareEntries((current) => {
      if (current.length <= 1) return current
      return current.filter((entry) => entry.id !== entryId)
    })
  }

  const allowedBaudRates = allowUncommonBaudrates === true ? ALL_BAUD_RATES : COMMON_BAUD_RATES
  const activeEntries = splitFirmwareFiles === true ? firmwareEntries : firmwareEntries.slice(0, 1)
  const fileAccept = allowAnyFileFormat === true ? undefined : '.bin,application/octet-stream'
  const fileButtonLabel = allowAnyFileFormat === true ? 'Select Firmware File' : 'Select Firmware (.bin)'
  const allowFirmwareUrlInput = IS_OFFLINE_BUILD !== true
  const hasFirmwareSource = React.useCallback((entry) => (
    entry.file != null || (allowFirmwareUrlInput && `${entry.url || ''}`.trim().length > 0)
  ), [allowFirmwareUrlInput])
  const downloadFirmwareFromUrl = React.useCallback(async (url, runId) => {
    if (allowFirmwareUrlInput !== true) {
      throw new Error('Firmware URLs are unavailable in the offline build. Select a local firmware file instead')
    }

    const readFirmwareResponse = async (response, sourceLabel, failurePrefix) => {
      if (!response.ok) {
        throw new Error(`${failurePrefix}: ${response.status} ${response.statusText}`.trim())
      }

      return {
        bytes: new Uint8Array(await response.arrayBuffer()),
        sourceLabel
      }
    }
    const proxyUrl = `${FIRMWARE_PROXY_URL}${encodeURIComponent(url)}`

    appendRunLog(runId, `Downloading ${url}...`)

    try {
      const response = await fetch(url)
      return await readFirmwareResponse(response, url, 'Failed to download firmware from URL')
    } catch (directError) {
      const directMessage = directError?.message || `${directError}`
      appendRunLog(runId, `Direct download failed (${directMessage}). Retrying via firmware proxy...`)
    }

    try {
      appendRunLog(runId, 'Trying firmware proxy: cors.namelessnanashi.dev')
      const proxyResponse = await fetch(proxyUrl)
      return await readFirmwareResponse(
        proxyResponse,
        `${url} (via cors.namelessnanashi.dev)`,
        'Failed to download firmware via cors.namelessnanashi.dev'
      )
    } catch (proxyError) {
      const proxyMessage = proxyError?.message || `${proxyError}`
      appendRunLog(runId, `Proxy failed (cors.namelessnanashi.dev): ${proxyMessage}`)
      throw proxyError
    }
  }, [allowFirmwareUrlInput, appendRunLog])

  const handleFlash = async () => {
    if (activeEntries.some((entry) => !hasFirmwareSource(entry))) {
      setError(
        allowFirmwareUrlInput
          ? (splitFirmwareFiles
              ? 'Select a file or enter a URL for every firmware entry'
              : 'Select a firmware file or enter a firmware URL first')
          : (splitFirmwareFiles
              ? 'Select a local firmware file for every firmware entry'
              : 'Select a local firmware file first')
      )
      return
    }

    if (!('serial' in navigator)) {
      setError('This browser does not support the Web Serial API')
      onError?.('Flashing failed: browser does not support Web Serial API')
      return
    }

    setError('')
    setProgress(0)
    setLogs([])
    setFlashing(true)

    flashRunIdRef.current += 1
    const runId = flashRunIdRef.current
    let transport
    let successMessage = ''
    let failureMessage = ''
    const throwIfCancelled = () => {
      if (!isCurrentFlashRun(runId)) {
        const cancellationError = new Error('Flash cancelled')
        cancellationError.name = 'AbortError'
        throw cancellationError
      }
    }

    try {
      const preparedFiles = await Promise.all(activeEntries.map(async (entry) => {
        const address = parseAddress(entry.address)
        const url = `${entry.url || ''}`.trim()
        let data
        let byteLength
        let sourceLabel

        if (entry.file) {
          const bytes = new Uint8Array(await entry.file.arrayBuffer())
          throwIfCancelled()
          data = uint8ArrayToBinaryString(bytes)
          byteLength = bytes.length
          sourceLabel = entry.file.name
        } else if (url.length > 0) {
          const download = await downloadFirmwareFromUrl(url, runId)
          throwIfCancelled()
          data = uint8ArrayToBinaryString(download.bytes)
          byteLength = download.bytes.length
          sourceLabel = download.sourceLabel
        } else {
          throw new Error('Firmware source is required')
        }

        appendRunLog(runId, `Loaded ${sourceLabel} (${byteLength} bytes) @ 0x${address.toString(16)}`)
        return {
          data,
          address
        }
      }))

      throwIfCancelled()
      appendRunLog(runId, 'Requesting serial port...')
      const port = await navigator.serial.requestPort({ filters: [] })
      throwIfCancelled()

      transport = new Transport(port, false)
      activeTransportRef.current = transport
      const terminal = {
        clean: () => {
          if (isCurrentFlashRun(runId)) setLogs([])
        },
        writeLine: (line) => appendRunLog(runId, line),
        write: (line) => appendRunLog(runId, line)
      }

      const loader = new ESPLoader({
        transport,
        baudrate: flashBaudRate,
        terminal
      })

      appendRunLog(runId, 'Connecting to target chip...')
      const chipName = await loader.main()
      throwIfCancelled()
      appendRunLog(runId, `Connected: ${chipName}`)

      appendRunLog(runId, 'Flashing firmware...')
      await loader.writeFlash({
        fileArray: preparedFiles.map(({ data, address }) => ({ data, address })),
        flashSize: 'keep',
        flashMode: 'keep',
        flashFreq: 'keep',
        after: 'hard_reset',
        eraseAll,
        compress: true,
        reportProgress: (_fileIndex, written, total) => {
          if (!isCurrentFlashRun(runId)) return
          const percent = total > 0 ? Math.round((written / total) * 100) : 0
          setProgress(Math.max(0, Math.min(100, percent)))
        }
      })
      throwIfCancelled()

      appendRunLog(runId, 'Flash complete')
      setProgress(100)
      successMessage = `Flashed ${preparedFiles.length} file${preparedFiles.length === 1 ? '' : 's'} successfully`
    } catch (flashError) {
      if (!isCurrentFlashRun(runId) || flashError?.name === 'AbortError') {
        return
      }

      if (flashError?.name === 'NotFoundError') {
        const cancelledMessage = 'Port selection was cancelled'
        appendRunLog(runId, cancelledMessage)
        setError(cancelledMessage)
        failureMessage = cancelledMessage
      } else {
        const message = flashError?.message || `${flashError}`
        const formatted = `Flashing failed: ${message}`
        appendRunLog(runId, formatted)
        setError(formatted)
        onError?.(formatted)
        failureMessage = formatted
      }
    }

    if (!isCurrentFlashRun(runId)) return

    activeTransportRef.current = null
    setFlashing(false)
    disconnectTransport(transport)

    if (failureMessage) return

    if (successMessage) {
      onSuccess?.(successMessage)
      finishClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableScrollLock
      maxWidth='md'
      fullWidth
      disableEscapeKeyDown={flashing}
      sx={dialogSx}
    >
      <DialogTitle>ESPTool Flasher</DialogTitle>
      <DialogContent ref={dialogContentRef} sx={themedScrollbarSx}>
        <DialogContentText>
          Firmware Image
        </DialogContentText>

        <Stack spacing={0}>
          {activeEntries.map((entry, index) => (
            <Box
              key={entry.id}
              sx={{
                ...formElementCSS,
                display: 'grid',
                gridTemplateColumns: splitFirmwareFiles === true ? { xs: '1fr', md: 'minmax(0, 1.5fr) minmax(180px, 1fr) auto' } : '1fr',
                gap: 1,
                alignItems: 'start'
              }}
            >
              <Stack spacing={1}>
                <Button
                  variant='outlined'
                  component='label'
                  disabled={flashing}
                  fullWidth
                  sx={firmwareSelectButtonSx}
                >
                  {entry.file ? entry.file.name : (splitFirmwareFiles ? `${fileButtonLabel} ${index + 1}` : fileButtonLabel)}
                  <input
                    hidden
                    type='file'
                    accept={fileAccept}
                    onChange={(event) => {
                      const selected = event.target.files?.[0]
                      if (!selected) return
                      updateFirmwareEntry(entry.id, {
                        file: selected,
                        url: ''
                      })
                    }}
                  />
                </Button>

                {allowFirmwareUrlInput && (
                  <TextField
                    label={splitFirmwareFiles ? `Firmware URL ${index + 1}` : 'Firmware URL'}
                    value={entry.url}
                    onChange={(event) => {
                      const nextUrl = event.target.value
                      updateFirmwareEntry(entry.id, {
                        url: nextUrl,
                        ...(nextUrl.trim().length > 0 ? { file: null } : {})
                      })
                    }}
                    placeholder='https://example.com/firmware.bin'
                    disabled={flashing}
                    helperText='Firmware direct-download URL only. If the host blocks CORS, the app will retry via cors.namelessnanashi.dev.'
                    FormHelperTextProps={{ sx: { color: '#ffffffb3 !important' } }}
                    fullWidth
                  />
                )}
              </Stack>

              {splitFirmwareFiles && (
                <TextField
                  label={`Address ${index + 1}`}
                  value={entry.address}
                  onChange={(event) => updateFirmwareEntry(entry.id, { address: event.target.value })}
                  placeholder='0x1000'
                  disabled={flashing}
                  helperText='0x1000'
                  FormHelperTextProps={{ sx: { color: '#ffffffb3 !important' } }}
                  fullWidth
                />
              )}

              {splitFirmwareFiles && (
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', md: 'center' }, pt: { xs: 0, md: 0.5 } }}>
                  <IconButton
                    aria-label={`Remove firmware ${index + 1}`}
                    onClick={() => removeFirmwareEntry(entry.id)}
                    disabled={flashing || activeEntries.length === 1}
                    color='error'
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          ))}

          {splitFirmwareFiles && (
            <Box sx={formElementCSS}>
              <Button variant='outlined' startIcon={<AddIcon />} onClick={addFirmwareEntry} disabled={flashing}>
                Add Firmware File
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <DialogContentText>
            Flash Options
          </DialogContentText>

          {!splitFirmwareFiles && (
            <TextField
              sx={formElementCSS}
              label='Flash Address'
              value={activeEntries[0]?.address || DEFAULT_ADDRESS}
              onChange={(event) => updateFirmwareEntry(activeEntries[0].id, { address: event.target.value })}
              placeholder='0x0'
              disabled={flashing}
              helperText='Examples: 0x0, 0x1000, 4096'
              FormHelperTextProps={{ sx: { color: '#ffffffb3 !important' } }}
              fullWidth
            />
          )}

          {allowArbitraryBaudrates !== true
            ? (
              <FormControl fullWidth sx={formElementCSS}>
                <InputLabel>Flash Baud Rate</InputLabel>
                <Select
                  value={flashBaudRate}
                  onChange={(event) => setFlashBaudRate(Number(event.target.value))}
                  disabled={flashing}
                  label='Flash Baud Rate'
                >
                  {allowedBaudRates.map(rate => (
                    <MenuItem key={rate} value={rate}>{rate} baud</MenuItem>
                  ))}
                </Select>
              </FormControl>
              )
            : (
              <TextField
                sx={formElementCSS}
                label='Flash Baud Rate'
                type='number'
                value={flashBaudRate}
                onChange={(event) => setFlashBaudRate(Number(event.target.value))}
                disabled={flashing}
                inputProps={{ min: 1, step: 1 }}
                fullWidth
              />
              )}

          <FormGroup>
            <FormControlLabel
              sx={formElementCSS}
              control={
                <Checkbox
                  checked={eraseAll}
                  onChange={(event) => setEraseAll(event.target.checked)}
                  disabled={flashing}
                  sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                />
              }
              label='Erase entire flash before writing'
            />
          </FormGroup>

          <Divider sx={{ my: 2 }} />

          <DialogContentText ref={progressSectionRef}>
            Flash Progress
          </DialogContentText>

          <Box sx={formElementCSS}>
            <Typography variant='body2' sx={{ mb: 0.75 }}>
              Progress: {progress}%
            </Typography>
            <LinearProgress variant='determinate' value={progress} />
          </Box>

          {error && (
            <Alert severity='error' sx={{ mt: 1 }}>{error}</Alert>
          )}

          <Paper
            ref={logsRef}
            variant='outlined'
            sx={{
              ...themedScrollbarSx,
              mt: 1,
              p: 1.25,
              maxHeight: 220,
              overflowY: 'auto',
              backgroundColor: 'var(--terminal-bg)',
              color: 'var(--terminal-fg)',
              borderColor: 'var(--terminal-border)'
            }}
          >
            {logs.length === 0
              ? (
                <Typography variant='body2' sx={{ color: '#ffffffb3' }}>
                  Flash logs will appear here.
                </Typography>
                )
              : logs.map((line, index) => (
                <Typography
                  key={`${line}-${index}`}
                  variant='body2'
                  sx={{
                    fontFamily: '"0xProto", monospace',
                    lineHeight: 1.45
                  }}
                >
                  {line}
                </Typography>
              ))}
          </Paper>

          <Collapse in={advanced} timeout='auto' unmountOnExit>
            <Divider sx={{ my: 2 }} />

            <DialogContentText>
              Advanced Options
            </DialogContentText>

            <DialogContentText sx={{ mt: 2 }}>
              Baud Rate Options
            </DialogContentText>

            {!allowArbitraryBaudrates && (
              <FormGroup sx={{ mt: 1, mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={allowUncommonBaudrates}
                      onChange={(event) => setAllowUncommonBaudrates(event.target.checked)}
                      sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                    />
                  }
                  label='Allow Uncommon Baudrates'
                />
              </FormGroup>
            )}

            <FormGroup sx={{ mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowArbitraryBaudrates}
                    onChange={(event) => setAllowArbitraryBaudrates(event.target.checked)}
                    sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                  />
                }
                label='Allow Arbitrary Baudrates'
              />
            </FormGroup>

            <DialogContentText sx={{ mt: 2 }}>
              Firmware File Options
            </DialogContentText>

            <FormGroup sx={{ mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={splitFirmwareFiles}
                    onChange={(event) => setSplitFirmwareFiles(event.target.checked)}
                    sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                  />
                }
                label='Split Firmware Files'
              />
            </FormGroup>

            <FormGroup sx={{ mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowAnyFileFormat}
                    onChange={(event) => setAllowAnyFileFormat(event.target.checked)}
                    sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
                  />
                }
                label='Allow Any File Format'
              />
            </FormGroup>
          </Collapse>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ alignItems: 'center' }}>
        <Box sx={{ mr: 'auto' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={advanced}
                onChange={(event) => setAdvanced(event.target.checked)}
                disabled={flashing}
                sx={{ color: '#ffffffb3', '&.Mui-checked': { color: '#fff' } }}
              />
            }
            label='Advanced mode'
          />
        </Box>

        <Button onClick={handleClose} color='secondary' sx={footerButtonSx}>Cancel</Button>
        <Button
          onClick={handleFlash}
          color='primary'
          disabled={flashing || activeEntries.some((entry) => !hasFirmwareSource(entry))}
          sx={footerButtonSx}
        >
          {flashing ? 'Flashing...' : 'Flash'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ESPToolFlasherDialog.propTypes = {
  open: PropTypes.bool,
  close: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  updateSettings: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  onError: PropTypes.func
}

export default ESPToolFlasherDialog
