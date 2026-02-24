/**
 * ANSI color and style codes parser
 * Converts ANSI escape sequences to CSS styles
 */

// ANSI color codes to CSS colors
const ANSI_COLORS = {
  30: '#000000', // black
  31: '#ff0000', // red
  32: '#00ff00', // green
  33: '#ffff00', // yellow
  34: '#0000ff', // blue
  35: '#ff00ff', // magenta
  36: '#00ffff', // cyan
  37: '#ffffff', // white
  90: '#808080', // bright black
  91: '#ff6b6b', // bright red
  92: '#51cf66', // bright green
  93: '#ffd93d', // bright yellow
  94: '#74c0fc', // bright blue
  95: '#ff8ed4', // bright magenta
  96: '#35d9d2', // bright cyan
  97: '#ffffff' // bright white
}

const ANSI_BG_COLORS = {
  40: '#000000', // black bg
  41: '#ff0000', // red bg
  42: '#00ff00', // green bg
  43: '#ffff00', // yellow bg
  44: '#0000ff', // blue bg
  45: '#ff00ff', // magenta bg
  46: '#00ffff', // cyan bg
  47: '#ffffff', // white bg
  100: '#808080', // bright black bg
  101: '#ff6b6b', // bright red bg
  102: '#51cf66', // bright green bg
  103: '#ffd93d', // bright yellow bg
  104: '#74c0fc', // bright blue bg
  105: '#ff8ed4', // bright magenta bg
  106: '#35d9d2', // bright cyan bg
  107: '#ffffff' // bright white bg
}

/**
 * Parse ANSI escape sequences and return styled segments
 * Returns array of { text, style } objects
 */
export const parseANSI = (text) => {
  if (!text || typeof text !== 'string') return [{ text: String(text), style: {} }]

  const segments = []
  const ansiRegex = /\u001b\[([0-9;]*?)([a-zA-Z])/g
  let lastIndex = 0
  let currentStyle = {}

  let match
  while ((match = ansiRegex.exec(text)) !== null) {
    // Add text before the ANSI code
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        style: { ...currentStyle }
      })
    }

    const codes = match[1] ? match[1].split(';').map(Number) : [0]
    const command = match[2]

    if (command === 'm') {
      // SGR (Select Graphic Rendition)
      codes.forEach(code => {
        if (code === 0) {
          currentStyle = {} // Reset
        } else if (code === 1) {
          currentStyle.fontWeight = 'bold'
        } else if (code === 3) {
          currentStyle.fontStyle = 'italic'
        } else if (code === 4) {
          currentStyle.textDecoration = 'underline'
        } else if (code === 22) {
          delete currentStyle.fontWeight
        } else if (code === 23) {
          delete currentStyle.fontStyle
        } else if (code === 24) {
          delete currentStyle.textDecoration
        } else if (ANSI_COLORS[code]) {
          currentStyle.color = ANSI_COLORS[code]
        } else if (ANSI_BG_COLORS[code]) {
          currentStyle.backgroundColor = ANSI_BG_COLORS[code]
        }
      })
    } else if (command === 'H' || command === 'f') {
      // Cursor positioning - ignore for now
    } else if (command === 'J') {
      // Clear display - ignore for now
    } else if (command === 'K') {
      // Clear line - ignore for now
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      style: { ...currentStyle }
    })
  }

  return segments.length > 0 ? segments : [{ text, style: {} }]
}

/**
 * Strip ANSI codes from text (for plain text export)
 */
export const stripANSI = (text) => {
  return String(text).replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '')
}
