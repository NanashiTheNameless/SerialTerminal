export const themedScrollbarSx = {
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
