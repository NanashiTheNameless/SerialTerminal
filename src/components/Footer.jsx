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
          underline='always'
          color='inherit'
          rel='noreferrer'
          sx={{ fontWeight: 'bold' }}
        >
          {version.name}
        </Link>
      </Typography>

      <Typography
        align='center'
        display='block'
        variant='caption'
        sx={{
          color: '#ddd',
          mt: 0.5,
          mb: 0,
          fontSize: '0.75rem'
        }}
      >
        Download an offline capable version from the{' '}
        <Link
          href='https://github.com/NanashiTheNameless/SerialTerminal/releases/latest'
          target='_blank'
          underline='always'
          color='inherit'
          rel='noreferrer'
          sx={{ fontWeight: 'bold' }}
        >
          latest release on GitHub
        </Link>
        .
      </Typography>

      <Box sx={{ mx: 'auto', mt: 0 }}>
        <Typography align='center' display='block' sx={{ mb: 0.25 }}>
          This version is owned and maintained by{' '}
          <Link
            href='https://github.com/NanashiTheNameless/SerialTerminal'
            target='_blank'
            underline='always'
            color='inherit'
            rel='noreferrer'
            sx={{ fontWeight: 'bold' }}
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
          (The original was made by{' '}
          <Link
            href='https://github.com/SpacehuhnTech/serialterminal'
            target='_blank'
            underline='always'
            color='inherit'
            rel='noreferrer'
            sx={{ fontWeight: 'bold' }}
          >
            Spacehuhn
          </Link>
          )
        </Typography>
      </Box>
    </Box>
  )
}

export default Footer
