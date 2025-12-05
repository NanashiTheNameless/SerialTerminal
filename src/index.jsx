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
          color: 'var(--terminal-fg)',
          overflow: 'hidden',
          fontFamily: '"0xProto", sans-serif'
        },

        'html, body, #root': {
          height: '100%',
          overflow: 'hidden'
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

        '.MuiInputLabel-root, .MuiDialog-paper, .MuiDialogContentText-root': {
          color: 'var(--terminal-fg) !important',
          fontFamily: '"0xProto", sans-serif !important'
        },

        '.MuiOutlinedInput-root, .MuiSelect-root, .MuiFilledInput-root, .MuiInputBase-root, .MuiInputBase-input': {
          color: 'var(--terminal-fg) !important',
          fontFamily: '"0xProto", monospace !important',
          fontVariantLigatures: 'normal',
          fontFeatureSettings: '"liga" 1, "calt" 1'
        },

        '.MuiDialogTitle-root, .MuiDialogContentText-root, .MuiFormControlLabel-label, .MuiMenuItem-root, .MuiButton-root': {
          fontFamily: '"0xProto", sans-serif !important'
        },

        '.MuiTypography-root, .MuiLink-root, .MuiBox-root, .MuiButtonBase-root': {
          fontFamily: '"0xProto", sans-serif !important'
        },

        '.MuiAlert-root, .MuiPaper-root': {
          fontFamily: '"0xProto", sans-serif !important'
        },

        '.MuiList-root, .MuiPopover-root .MuiPaper-root, .MuiMenu-paper': {
          backgroundColor: 'var(--terminal-bg) !important',
          color: 'var(--terminal-fg) !important'
        },

        '.MuiMenuItem-root:hover': {
          backgroundColor: 'var(--terminal-border) !important'
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
        },

        '.button-label': {
          paddingLeft: '0.5rem'
        }
      }}
    />
    <App />
  </React.StrictMode>
)
