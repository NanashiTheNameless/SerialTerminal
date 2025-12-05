import React from 'react'
import PropTypes from 'prop-types'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CancelIcon from '@mui/icons-material/Cancel'

// Application header bar
const Header = ({ isConnected = false, onDisconnect }) => {
  return (
    <AppBar
      position='static'
      sx={{
        background: '#2c387e'
      }}
    >
      <Toolbar>
        <img
          src='/logoSerial.svg'
          alt='Logo'
          height='30px'
        />

        <Typography
          variant='h6'
          component='h1'
          noWrap
          sx={{
            flexGrow: 1,
            fontFamily: '"0xProto"',
            fontWeight: 700
          }}
        >
          &nbsp;&nbsp;Serial Terminal
        </Typography>

        {isConnected && (
          <Tooltip title='Connected - Click to disconnect'>
            <Button
              onClick={onDisconnect}
              sx={{ color: '#fff', mr: 1 }}
            >
              <CancelIcon />
            </Button>
          </Tooltip>
        )}

        <Tooltip title='Launch another terminal window'>
          <Button
            sx={{ color: '#fff' }}
            target='_blank'
            href='#'
          >
            <AddCircleIcon />
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

Header.propTypes = {
  isConnected: PropTypes.bool,
  onDisconnect: PropTypes.func
}

export default Header
