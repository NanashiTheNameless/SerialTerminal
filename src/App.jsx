import React from 'react'

// Material-UI components
import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// Page components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/pages/Home'
import Terminal from './components/terminal/Terminal'
import Settings from './components/settings/Settings'
import ErrorMessage from './components/common/ErrorMessage'
import ErrorBoundary from './components/common/ErrorBoundary'

// Modules
import Serial from './modules/Serial'

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

// Constants
import { DEFAULT_SETTINGS, TOAST_DURATION, KEYBOARD_SHORTCUTS } from './constants'

function App () {
  // Serial Module
  const [serial] = React.useState(new Serial())

  // Terminal ref for imperative methods
  const terminalRef = React.useRef(null)

  // Connection Flag
  const [connected, setConnected] = React.useState(false)

  // Receive Buffer
  const [received, setReceived] = React.useState({ time: new Date(), value: '' })

  // Connect/Disconnect Toast Open
  const [toast, setToast] = React.useState({ open: false, severity: 'info', value: '' })

  // Settings Window Open
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  // Error Window
  const [errorOpen, setErrorOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  // Settings with localStorage persistence
  const [settings, setSettings] = useLocalStorage(
    'setting:',
    DEFAULT_SETTINGS,
    () => {
      setToast({
        open: true,
        severity: 'warning',
        value: 'Settings could not be saved (localStorage unavailable)'
      })
    }
  )

  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || (window.opera ? window.opera.toString() : '')
    setIsMobile(/android|iphone|ipad|ipod|mobile|tablet/i.test(ua))
  }, [])

  // Clear confirmation dialog state
  const [clearConfirmOpen, setClearConfirmOpen] = React.useState(false)

  const settingsShortcutKey = (settings.settingsShortcutKey || KEYBOARD_SHORTCUTS.OPEN_SETTINGS.key).toLowerCase()
  const clearShortcutKey = (settings.clearShortcutKey || KEYBOARD_SHORTCUTS.CLEAR_TERMINAL.key).toLowerCase()
  const disconnectShortcutKey = (settings.disconnectShortcutKey || KEYBOARD_SHORTCUTS.DISCONNECT.key).toLowerCase()
  const settingsShortcutShift = settings.settingsShortcutShift === true
  const clearShortcutShift = settings.clearShortcutShift === true
  const disconnectShortcutShift = settings.disconnectShortcutShift === true
  const detectCtrlC = settings.detectCtrlC !== undefined ? settings.detectCtrlC !== false : (settings.detectCtrl !== false)
  const detectCtrlD = settings.detectCtrlD !== undefined ? settings.detectCtrlD !== false : (settings.detectCtrl !== false)
  const disconnectShortcut = settings.disconnectShortcut === true
  const customControlAliases = settings.customControlAliases || []
  const commandKeybinds = settings.commandKeybinds || []
  const quickHotkeys = {
    enabled: settings.enableQuickHotkeys !== false,
    focus: settings.quickFocusKey || DEFAULT_SETTINGS.quickFocusKey,
    history: settings.quickHistoryKey || DEFAULT_SETTINGS.quickHistoryKey,
    download: settings.quickDownloadKey || DEFAULT_SETTINGS.quickDownloadKey,
    clear: settings.quickClearKey || DEFAULT_SETTINGS.quickClearKey,
    settings: settings.quickSettingsKey || DEFAULT_SETTINGS.quickSettingsKey,
    focusShift: settings.quickFocusShift === true,
    historyShift: settings.quickHistoryShift === true,
    downloadShift: settings.quickDownloadShift === true,
    clearShift: settings.quickClearShift === true,
    settingsShift: settings.quickSettingsShift === true
  }

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: settingsShortcutKey,
      ctrl: true,
      shift: settingsShortcutShift,
      callback: () => {
        if (settings.settingsShortcut !== false) {
          setSettingsOpen(true)
        }
      }
    },
    {
      key: clearShortcutKey,
      ctrl: true,
      shift: clearShortcutShift,
      callback: () => {
        if (settings.clearShortcut === true) {
          if (clearConfirmOpen) {
            // Second press - confirm clear
            if (terminalRef.current) {
              terminalRef.current.clearHistory()
              setToast({ open: true, severity: 'success', value: 'History cleared!' })
            }
            setClearConfirmOpen(false)
          } else {
            // First press - show confirmation
            setClearConfirmOpen(true)
          }
        }
      }
    },
    {
      key: disconnectShortcutKey,
      ctrl: true,
      shift: disconnectShortcutShift,
      callback: () => {
        if (disconnectShortcut && connected) {
          handleDisconnect()
        }
      }
    }
  ], true)

  const saveSettings = (newSettings) => {
    serial.setBaudRate(newSettings.baudRate)
    setSettings(newSettings)
    setToast({ open: true, severity: 'success', value: 'Settings saved!' })
  }

  const closeToast = () => {
    setToast({ ...toast, open: false })
  }

  // Setup serial callbacks when component mounts
  React.useEffect(() => {
    serial.onSuccess = () => {
      setConnected(true)
      setToast({ open: true, severity: 'success', value: 'Connected!' })
    }

    serial.onFail = () => {
      setConnected(false)
      setToast({ open: true, severity: 'error', value: 'Lost connection!' })
    }

    serial.onReceive = (value) => {
      setReceived({
        time: new Date(),
        value: `${value}`
      })
    }
  }, [serial])

  const connect = () => {
    if (!serial.supported()) {
      console.error('Serial not supported')
      return
    }

    serial.requestPort().then(res => {
      if (res !== '') {
        setErrorMessage(res)
        setErrorOpen(true)
      }
    })
  }

  const handleSend = (str) => {
    const lineEnding = settings.lineEnding === 'none' ? '' : settings.lineEnding
    serial.send(`${str}${lineEnding}`)
  }

  const handleRawSend = (byte) => {
    serial.sendByte(byte)
  }

  const handleDisconnect = () => {
    serial.close()
    setConnected(false)
    setToast({ open: true, severity: 'info', value: 'Disconnected' })
  }

  return (
    <ErrorBoundary>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}
      >
        {/* Header */}
        <Header isConnected={connected} onDisconnect={handleDisconnect} />

        {/* Homepage or Terminal */}
        {isMobile
          ? (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <Alert severity='warning' sx={{ maxWidth: 575 }}>
                <Box component='div' sx={{ fontWeight: 600, mb: 0.5 }}>
                  This tool is not supported on mobile devices.
                </Box>
                <Box component='div' sx={{ mb: 0.5 }}>
                  This is a technical limitation of the{' '}
                  <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API' target='_blank' rel='noopener noreferrer'>
                    WebSerial API
                  </a>.
                </Box>
                <Box component='div' sx={{ mb: 0.5 }}>
                  Please use a desktop browser that supports the WebSerial API.
                </Box>
                <Box component='div'>
                  Learn more about{' '}
                  <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility' target='_blank' rel='noopener noreferrer'>
                    browser compatibility
                  </a>.
                </Box>
              </Alert>
            </Box>
            )
          : connected
            ? (
              <Terminal
                ref={terminalRef}
                received={received}
                send={handleSend}
                sendRaw={handleRawSend}
                openSettings={() => setSettingsOpen(true)}
                showToast={(message, severity = 'info') => setToast({ open: true, severity, value: message })}
                clearConfirmOpen={clearConfirmOpen}
                onClearRequest={() => setClearConfirmOpen(true)}
                onClearConfirm={() => {
                  if (terminalRef.current) {
                    terminalRef.current.clearHistory()
                    setToast({ open: true, severity: 'success', value: 'History cleared!' })
                  }
                  setClearConfirmOpen(false)
                }}
                onClearCancel={() => setClearConfirmOpen(false)}
                onDisconnect={handleDisconnect}
                downloadFormat={settings.downloadFormat}
                echo={settings.localEcho !== false}
                time={settings.timestamp !== false}
                ctrlC={detectCtrlC}
                ctrlD={detectCtrlD}
                disconnectShortcut={disconnectShortcut}
                controlAliases={customControlAliases}
                commandKeybinds={commandKeybinds}
                parseANSIOutput={settings.parseANSIOutput !== false}
                quickHotkeys={quickHotkeys}
              />
              )
            : (
              <Home
                connect={connect}
                supported={serial.supported}
                openSettings={() => setSettingsOpen(true)}
              />
              )}

        {/* Settings Window */}
        <Settings
          open={settingsOpen}
          close={() => setSettingsOpen(false)}
          settings={settings}
          save={saveSettings}
          openPort={connected}
        />

        {/* (Dis)connected Toast */}
        <Snackbar open={toast.open} autoHideDuration={TOAST_DURATION} onClose={closeToast}>
          <Alert onClose={closeToast} severity={toast.severity}>
            {toast.value}
          </Alert>
        </Snackbar>

        {/* Error Message Window */}
        <ErrorMessage
          open={errorOpen}
          close={() => setErrorOpen(false)}
          message={errorMessage}
        />

        {/* Footer */}
        <Footer />
      </Box>
    </ErrorBoundary>
  )
}

export default App
