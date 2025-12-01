import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import GlobalStyles from '@mui/material/GlobalStyles'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <GlobalStyles
      styles={{
        body: {
          margin: 0,
          backgroundColor: 'var(--terminal-bg)',
          color: 'var(--terminal-fg)'
        },

        '.MuiAppBar-root, .MuiPaper-root.MuiAppBar-root': {
          backgroundColor: 'var(--header-bg) !important',
          color: 'var(--terminal-fg) !important'
        },

        '.MuiAppBar-root .MuiIconButton-root, .MuiAppBar-root .MuiButton-root': {
          color: 'var(--terminal-fg) !important'
        },

        '.MuiAppBar-root .MuiIconButton-root:hover, .MuiAppBar-root .MuiButton-root:hover, .MuiAppBar-root .MuiIconButton-root:active, .MuiAppBar-root .MuiButton-root:active': {
          backgroundColor: 'var(--terminal-border) !important',
          color: 'var(--terminal-fg) !important'
        },

        '.MuiAppBar-root .MuiIconButton-root.Mui-disabled, .MuiAppBar-root .MuiButton-root.Mui-disabled': {
          color: 'var(--terminal-muted) !important'
        },

        '.MuiAppBar-root .MuiTouchRipple-child': {
          backgroundColor: 'var(--terminal-fg) !important'
        },

        '.MuiInputLabel-root, .MuiOutlinedInput-root, .MuiDialog-paper, .MuiDialogContentText-root, .MuiSelect-root, .MuiFilledInput-root': {
          color: 'var(--terminal-fg) !important'
        },

        '.MuiOutlinedInput-root, .MuiDialog-paper, .MuiFilledInput-root': {
          backgroundColor: 'var(--terminal-bg) !important'
        },

        '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--terminal-user-input) !important'
        },

        '.MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--terminal-border) !important'
        },

        '.MuiSelect-icon, .MuiSelect-iconOutlined, .MuiSelect-iconFilled, .MuiSelect-iconStandard, .MuiSelect-icon .MuiSvgIcon-root, .MuiSelect-icon svg, .MuiSelect-icon path, .MuiSelect-icon.Mui-disabled, .MuiSelect-icon.Mui-disabled .MuiSvgIcon-root, .Mui-disabled .MuiSelect-icon, .Mui-disabled .MuiSelect-icon .MuiSvgIcon-root': {
          color: 'var(--terminal-fg) !important',
          fill: 'var(--terminal-fg) !important'
        },

        '.MuiListItemIcon-root, .MuiListItemIcon-root .MuiSvgIcon-root, .MuiListItemIcon-root svg, .MuiListItemIcon-root path': {
          color: 'var(--terminal-fg) !important',
          fill: 'var(--terminal-fg) !important'
        },

        '.MuiFilledInput-input.Mui-disabled, .MuiSelect-select.Mui-disabled, .MuiInputBase-input.Mui-disabled, .MuiFilledInput-root.Mui-disabled .MuiFilledInput-input': {
          WebkitTextFillColor: 'var(--terminal-muted) !important',
          color: 'var(--terminal-muted) !important'
        }
      }}
    />
    <App />
  </React.StrictMode>
)
