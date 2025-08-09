import React from 'react'

import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import version from '../version.js'

const Footer = () => {
  return (
    <Box sx={{ marginTop: 'auto' }}>
      {/* Version */}
      <Typography variant='caption' align='center' display='block' sx={{ color: '#ddd', mb: 0 }}>
        <Link
          href='https://github.com/NanashiTheNameless/SerialTerminal'
          target='_blank'
          underline='hover'
          color='inherit'
        >
          {version.name}
        </Link>
      </Typography>

      <Box sx={{ mx: 'auto', mt: 0 }}>
        <Typography align='center' display='block' sx={{ mb: 0.25 }}>
          This version owned by{' '}
          <Link
            href='https://github.com/NanashiTheNameless/SerialTerminal'
            target='_blank'
            underline='hover'
            color='inherit'
          >
            NanashiTheNameless
          </Link>
          !
        </Typography>

        <Typography
          align='center'
          display='block'
          variant='caption'
          sx={{
            color: 'var(--terminal-time)',
            mt: 0,
            mb: 0,
            fontStyle: 'italic',
            fontSize: '0.70rem',
            lineHeight: 1.05,
            letterSpacing: 0
          }}
        >
          (Original Made by{' '}
          <Link href='https://spacehuhn.com' target='_blank' underline='hover' color='inherit'>
            Spacehuhn
          </Link>
          )
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer
