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
import { DEFAULT_SETTINGS, LINE_ENDING_VALUES, TOAST_DURATION } from './constants'

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
    'settings',
    DEFAULT_SETTINGS,
    (error) => {
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

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      callback: () => {
        if (settings.settingsShortcut !== false) {
          setSettingsOpen(true)
        }
      }
    },
    {
      key: 'l',
      ctrl: true,
      callback: () => {
        if (settings.clearShortcut === true && terminalRef.current) {
          terminalRef.current.clearHistory()
          setToast({ open: true, severity: 'info', value: 'History cleared!' })
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

  const connect = () => {
    if (!serial.supported()) {
      console.error('Serial not supported')
      return
    }

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
        <Header />

        {/* Homepage or Terminal */}
        {isMobile
          ? <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <Alert severity='warning' sx={{ maxWidth: 575 }}>
                <Box component='div' sx={{ fontWeight: 600, mb: 0.5 }}>
                  This tool is not supported on mobile devices.
                </Box>
                <Box component='div' sx={{ mb: 0.5 }}>
                  This is a technical limitation of the{' '}
                  <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API' target='blank'>
                    WebSerial API
                  </a>.
                </Box>
                <Box component='div' sx={{ mb: 0.5 }}>
                  Please use a desktop browser that supports the WebSerial API.
                </Box>
                <Box component='div'>
                  Learn more about{' '}
                  <a href='https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility' target='blank'>
                    browser compatibility
                  </a>.
                </Box>
              </Alert>
            </Box>
          : connected
              ? <Terminal
                  ref={terminalRef}
                  received={received}
                  send={handleSend}
                  sendRaw={handleRawSend}
                  openSettings={() => setSettingsOpen(true)}
                  echo={settings.localEcho !== false}
                  time={settings.timestamp !== false}
                  ctrl={settings.detectCtrl !== false}
                />
              : <Home
                  connect={connect}
                  supported={serial.supported}
                  openSettings={() => setSettingsOpen(true)}
                />}

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
