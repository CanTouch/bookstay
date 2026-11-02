// Small shared helpers
export const fmtPrice = (n) => `$${Number(n).toLocaleString('en-US')}`

export const toISO = (d) => {
  if (!d) return null
  const x = new Date(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}
export const fromISO = (s) => {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const nightsBetween = (a, b) => {
  if (!a || !b) return 0
  return Math.max(0, Math.round((fromISO(b) - fromISO(a)) / 86400000))
}
export const fmtShort = (s) => s ? fromISO(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
export const fmtLong = (s) => s ? fromISO(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
export const fmtSlash = (s) => s ? fromISO(s).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''

export const guestLabel = (g) => {
  const n = (g?.adults || 0) + (g?.children || 0)
  if (!n) return ''
  let s = `${n} guest${n > 1 ? 's' : ''}`
  if (g.infants) s += `, ${g.infants} infant${g.infants > 1 ? 's' : ''}`
  if (g.pets) s += `, ${g.pets} pet${g.pets > 1 ? 's' : ''}`
  return s
}

// Default demo dates: two weeks from today, 2 nights
export const defaultDates = () => {
  const a = new Date(); a.setDate(a.getDate() + 14)
  const b = new Date(a); b.setDate(b.getDate() + 2)
  return [toISO(a), toISO(b)]
}

export const cx = (...c) => c.filter(Boolean).join(' ')
