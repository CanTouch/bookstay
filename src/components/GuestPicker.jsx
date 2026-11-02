import { Minus, Plus } from 'lucide-react'

const ROWS = [
  { key: 'adults', label: 'Adults', sub: 'Age 13+' },
  { key: 'children', label: 'Children', sub: 'Ages 2–12' },
  { key: 'infants', label: 'Infants', sub: 'Under 2' },
  { key: 'pets', label: 'Pets', sub: 'Bringing a service animal?', link: true },
]

/** Guest counter rows (Adults / Children / Infants / Pets). */
export default function GuestPicker({ value, onChange, max = 16, allowPets = true }) {
  const total = value.adults + value.children
  const set = (k, d) => {
    const next = { ...value, [k]: Math.max(0, value[k] + d) }
    // adding children/infants/pets implies at least one adult
    if (k !== 'adults' && d > 0 && next.adults === 0) next.adults = 1
    onChange(next)
  }
  return (
    <div>
      {ROWS.map((r, i) => {
        const v = value[r.key]
        const plusDisabled =
          (r.key === 'pets' && !allowPets) ||
          ((r.key === 'adults' || r.key === 'children') && total >= max) ||
          (r.key === 'infants' && v >= 5) || (r.key === 'pets' && v >= 5)
        const minusDisabled = v === 0 || (r.key === 'adults' && v === 1 && (value.children || value.infants || value.pets))
        return (
          <div key={r.key} className={`flex items-center justify-between py-4 ${i < ROWS.length - 1 ? 'border-b border-ink-line/70' : ''}`}>
            <div>
              <div className="font-semibold text-[15px]">{r.label}</div>
              <div className={`text-sm ${r.link ? 'underline font-semibold text-ink' : 'text-ink-soft'}`}>{r.sub}</div>
            </div>
            <div className="flex items-center gap-3">
              <button disabled={minusDisabled} onClick={() => set(r.key, -1)} className="w-8 h-8 rounded-full border border-ink-line flex items-center justify-center hover:border-ink disabled:opacity-25 disabled:hover:border-ink-line">
                <Minus size={14} />
              </button>
              <span className="w-5 text-center tabular-nums">{v}</span>
              <button disabled={plusDisabled} onClick={() => set(r.key, 1)} className="w-8 h-8 rounded-full border border-ink-line flex items-center justify-center hover:border-ink disabled:opacity-25 disabled:hover:border-ink-line">
                <Plus size={14} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
