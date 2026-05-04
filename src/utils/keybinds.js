export const normalizeKey = (key, fallback = '') => {
  const normalized = `${key || fallback || ''}`.trim().toLowerCase()
  return normalized.length === 1 ? normalized : ''
}

export const KEYBIND_MODIFIER_VALUES = {
  PRIMARY: 'primary',
  CTRL: 'ctrl',
  SUPER: 'super',
  ALT: 'alt'
}

export const KEYBIND_MODIFIER_LABELS = {
  [KEYBIND_MODIFIER_VALUES.PRIMARY]: 'Ctrl/Cmd',
  [KEYBIND_MODIFIER_VALUES.CTRL]: 'Ctrl',
  [KEYBIND_MODIFIER_VALUES.SUPER]: 'Super',
  [KEYBIND_MODIFIER_VALUES.ALT]: 'Alt'
}

const MODIFIER_ALIASES = {
  cmd: KEYBIND_MODIFIER_VALUES.SUPER,
  command: KEYBIND_MODIFIER_VALUES.SUPER,
  meta: KEYBIND_MODIFIER_VALUES.SUPER,
  win: KEYBIND_MODIFIER_VALUES.SUPER,
  windows: KEYBIND_MODIFIER_VALUES.SUPER,
  mod: KEYBIND_MODIFIER_VALUES.PRIMARY
}

export const normalizeModifier = (modifier, fallback = KEYBIND_MODIFIER_VALUES.PRIMARY) => {
  const normalized = `${modifier || fallback || ''}`.trim().toLowerCase()
  const aliased = MODIFIER_ALIASES[normalized] || normalized
  return Object.values(KEYBIND_MODIFIER_VALUES).includes(aliased) ? aliased : fallback
}

export const modifierToBinding = (modifier) => {
  switch (normalizeModifier(modifier)) {
    case KEYBIND_MODIFIER_VALUES.CTRL:
      return { ctrl: true }
    case KEYBIND_MODIFIER_VALUES.SUPER:
      return { meta: true }
    case KEYBIND_MODIFIER_VALUES.ALT:
      return { alt: true }
    case KEYBIND_MODIFIER_VALUES.PRIMARY:
    default:
      return { primary: true }
  }
}

export const keybind = ({ key, shift = false, modifier = KEYBIND_MODIFIER_VALUES.PRIMARY, label } = {}) => ({
  key,
  shift: shift === true,
  modifier: normalizeModifier(modifier),
  label,
  ...modifierToBinding(modifier)
})

export const getEventKey = (event) => {
  return event.key?.length === 1 ? event.key.toLowerCase() : ''
}

export const matchesKeybind = (event, binding) => {
  const key = normalizeKey(binding?.key)
  if (!key || getEventKey(event) !== key) return false

  const normalizedBinding = binding?.modifier
    ? keybind(binding)
    : binding
  const wantsShift = normalizedBinding.shift === true
  const wantsAlt = normalizedBinding.alt === true
  const wantsPrimary = normalizedBinding.primary === true

  if (event.shiftKey !== wantsShift || event.altKey !== wantsAlt) return false

  if (wantsPrimary) {
    return (event.ctrlKey || event.metaKey) && !(event.ctrlKey && event.metaKey)
  }

  const wantsCtrl = normalizedBinding.ctrl === true
  const wantsMeta = normalizedBinding.meta === true
  return event.ctrlKey === wantsCtrl && event.metaKey === wantsMeta
}

export const describeKeybind = (binding) => {
  const normalizedBinding = binding?.modifier
    ? keybind(binding)
    : binding
  const parts = []
  if (normalizedBinding.primary === true) {
    parts.push(KEYBIND_MODIFIER_LABELS[KEYBIND_MODIFIER_VALUES.PRIMARY])
  } else if (normalizedBinding.ctrl === true) {
    parts.push(KEYBIND_MODIFIER_LABELS[KEYBIND_MODIFIER_VALUES.CTRL])
  } else if (normalizedBinding.meta === true) {
    parts.push(KEYBIND_MODIFIER_LABELS[KEYBIND_MODIFIER_VALUES.SUPER])
  }
  if (normalizedBinding.alt === true) parts.push(KEYBIND_MODIFIER_LABELS[KEYBIND_MODIFIER_VALUES.ALT])
  if (normalizedBinding.shift === true) parts.push('Shift')
  parts.push((normalizeKey(normalizedBinding.key) || '�').toUpperCase())
  return parts.join('+')
}

export const keybindSignature = (binding) => {
  const key = normalizeKey(binding?.key)
  if (!key) return ''
  const normalizedBinding = binding?.modifier
    ? keybind(binding)
    : binding

  return [
    normalizedBinding.primary === true ? 'primary' : '',
    normalizedBinding.ctrl === true ? 'ctrl' : '',
    normalizedBinding.meta === true ? 'super' : '',
    normalizedBinding.alt === true ? 'alt' : '',
    normalizedBinding.shift === true ? 'shift' : '',
    key
  ].filter(Boolean).join('+')
}

export const findKeybindConflicts = (bindings) => {
  const seen = new Map()

  for (const binding of bindings.filter(Boolean)) {
    const signature = keybindSignature(binding)
    if (!signature) continue

    const existing = seen.get(signature)
    if (existing) {
      return [existing, binding]
    }

    seen.set(signature, binding)
  }

  return null
}
