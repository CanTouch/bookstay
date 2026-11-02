import { useState } from 'react'
import { ChevronLeft, ChevronRight, Keyboard } from 'lucide-react'
import { toISO, fromISO, cx } from '../lib/utils'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function Month({ year, month, checkIn, checkOut, onPick, hover, setHover }) {
  const first = new Date(year, month, 1)
  const days = new Date(year, month + 1, 0).getDate()
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const cells = Array(first.getDay()).fill(null).concat(Array.from({ length: days }, (_, i) => i + 1))
  const ci = checkIn && fromISO(checkIn)
  const co = checkOut && fromISO(checkOut)
  const hv = hover && fromISO(hover)

  return (
    <div className="w-full">
      <div className="text-center font-semibold text-[15px] mb-4">
        {first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
      <div className="grid grid-cols-7 text-[11px] font-semibold text-ink-soft mb-1">
        {DOW.map((d, i) => <div key={i} className="text-center py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const date = new Date(year, month, d)
          const iso = toISO(date)
          const past = date < today
          const isStart = ci && +date === +ci
          const isEnd = co && +date === +co
          const end = co || (ci && hv && hv > ci ? hv : null)
          const inRange = ci && end && date > ci && date < end
          const rangeEdge = ci && end && (isStart || +date === +end)
          return (
            <div
              key={i}
              className={cx(
                'relative h-11 flex items-center justify-center',
                inRange && 'bg-ink-bg',
                rangeEdge && isStart && 'bg-gradient-to-r from-transparent from-50% to-ink-bg to-50%',
                rangeEdge && !isStart && 'bg-gradient-to-l from-transparent from-50% to-ink-bg to-50%',
              )}
            >
              <button
                disabled={past}
                onClick={() => onPick(iso)}
                onMouseEnter={() => setHover(iso)}
                className={cx(
                  'w-11 h-11 rounded-full text-[14px] font-semibold relative z-10 transition',
                  past ? 'text-ink-line line-through cursor-default' : 'hover:border hover:border-ink',
                  (isStart || isEnd) && 'bg-ink text-white hover:border-0',
                )}
              >
                {d}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Dual-month range calendar (matches the "2 nights in Nairobi" calendar). */
export default function Calendar({ checkIn, checkOut, onChange, months = 2, showFooter = true }) {
  const base = checkIn ? fromISO(checkIn) : new Date()
  const [view, setView] = useState({ y: base.getFullYear(), m: base.getMonth() })
  const [hover, setHover] = useState(null)
  const now = new Date()
  const canPrev = view.y > now.getFullYear() || (view.y === now.getFullYear() && view.m > now.getMonth())

  const shift = (n) => setView(({ y, m }) => {
    const d = new Date(y, m + n, 1)
    return { y: d.getFullYear(), m: d.getMonth() }
  })

  const pick = (iso) => {
    if (!checkIn || (checkIn && checkOut)) return onChange(iso, null)
    if (iso <= checkIn) return onChange(iso, null)
    onChange(checkIn, iso)
  }

  const list = Array.from({ length: months }, (_, i) => {
    const d = new Date(view.y, view.m + i, 1)
    return { y: d.getFullYear(), m: d.getMonth() }
  })

  return (
    <div onMouseLeave={() => setHover(null)}>
      <div className="relative">
        <button className="absolute left-0 top-0 p-1.5 rounded-full hover:bg-ink-bg disabled:opacity-20" disabled={!canPrev} onClick={() => shift(-1)}>
          <ChevronLeft size={18} />
        </button>
        <button className="absolute right-0 top-0 p-1.5 rounded-full hover:bg-ink-bg" onClick={() => shift(1)}>
          <ChevronRight size={18} />
        </button>
        <div className={cx('grid gap-12', months === 2 ? 'md:grid-cols-2' : '')}>
          {list.map(({ y, m }, i) => (
            <div key={`${y}-${m}`} className={i > 0 ? 'hidden md:block' : ''}>
              <Month year={y} month={m} checkIn={checkIn} checkOut={checkOut} onPick={pick} hover={hover} setHover={setHover} />
            </div>
          ))}
        </div>
      </div>
      {showFooter && (
        <div className="flex items-center justify-between mt-4">
          <Keyboard size={22} className="text-ink" />
          <button className="text-sm font-semibold underline underline-offset-2 px-2 py-1 rounded-lg hover:bg-ink-bg" onClick={() => onChange(null, null)}>
            Clear dates
          </button>
        </div>
      )}
    </div>
  )
}
