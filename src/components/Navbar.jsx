import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Menu, CircleUserRound, Globe, CircleHelp, X, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Logo, Avatar } from './ui'
import Calendar from './Calendar'
import GuestPicker from './GuestPicker'
import { useApp, emptyGuests } from '../context/AppContext'
import { destinations, serviceCategories } from '../data/listings'
import { fmtShort, guestLabel, cx } from '../lib/utils'

export const TABS = [
  { key: 'all', label: 'All', emoji: '🌍' },
  { key: 'homes', label: 'Stays', emoji: '🛖' },
  { key: 'experiences', label: 'Experiences', emoji: '🎈' },
  { key: 'services', label: 'Services', emoji: '🛎️' },
]

function useClickOutside(ref, cb) {
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && cb()
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [ref, cb])
}

/* ------------------------------ User menu ------------------------------ */
function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { setModal, user, setUser, showToast } = useApp()
  const nav = useNavigate()
  useClickOutside(ref, () => setOpen(false))
  const Item = ({ children, onClick, bold }) => (
    <button onClick={() => { setOpen(false); onClick?.() }} className={cx('w-full text-left px-6 py-2.5 hover:bg-ink-bg text-[15px] flex items-center gap-3', bold && 'font-semibold')}>{children}</button>
  )
  return (
    <div className="relative flex items-center gap-2" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="w-11 h-11 rounded-full bg-ink-bg hover:bg-ink-line/60 flex items-center justify-center hidden sm:flex">
        {user ? <Avatar name={user.name} size={30} /> : <CircleUserRound size={26} strokeWidth={1.6} />}
      </button>
      <button onClick={() => setOpen((o) => !o)} className="w-11 h-11 rounded-full bg-ink-bg hover:bg-ink-line/60 flex items-center justify-center">
        <Menu size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-14 w-[330px] bg-white rounded-2xl shadow-float py-2 z-50 fade-in border border-black/5">
          {user && (<><div className="px-6 py-3 text-[15px]"><div className="font-semibold">Hi, {user.name}</div><div className="text-ink-soft text-sm">{user.email}</div></div><div className="border-t border-ink-line/70 my-1" /></>)}
          <Item onClick={() => nav('/wishlists')}>♡ Wishlists</Item>
          <Item onClick={() => showToast('Languages & currency: English (US) · USD $')}><Globe size={20} strokeWidth={1.6} /> Languages &amp; currency</Item>
          <Item onClick={() => showToast('Help Center — placeholder for demo')}><CircleHelp size={20} strokeWidth={1.6} /> Help Center</Item>
          <div className="border-t border-ink-line/70 my-2" />
          <button onClick={() => { setOpen(false); nav('/become-a-host') }} className="w-full text-left px-6 py-3 hover:bg-ink-bg flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-[15px]">List your property</div>
              <div className="text-sm text-ink-soft leading-snug">Feature your lodge or camp to premium travellers across Africa.</div>
            </div>
            <span className="text-4xl">🛖</span>
          </button>
          <div className="border-t border-ink-line/70 my-2" />
          <Item onClick={() => nav('/become-a-host')}>Refer a property</Item>
          <Item onClick={() => nav('/become-a-host#pricing')}>Partner plans &amp; pricing</Item>
          <Item onClick={() => showToast('Gift cards — coming soon')}>Gift cards</Item>
          <div className="border-t border-ink-line/70 my-2" />
          {user
            ? <Item onClick={() => { setUser(null); showToast('Logged out') }}>Log out</Item>
            : <Item onClick={() => setModal({ type: 'login' })}>Log in or sign up</Item>}
        </div>
      )}
    </div>
  )
}

/* ------------------------------ Search bar ------------------------------ */
function SearchBar({ tab, onDone }) {
  const { search, setSearch } = useApp()
  const nav = useNavigate()
  const [active, setActive] = useState(null) // 'where' | 'when' | 'who'
  const [svc, setSvc] = useState('')
  const ref = useRef(null)
  useClickOutside(ref, () => setActive(null))

  const submit = () => {
    setActive(null)
    const q = new URLSearchParams()
    if (search.where) q.set('where', search.where)
    if (search.checkIn) q.set('checkin', search.checkIn)
    if (search.checkOut) q.set('checkout', search.checkOut)
    nav(`/search?${q.toString()}`)
    onDone?.()
  }

  const seg = (key) => cx(
    'relative flex-1 text-left px-7 py-3.5 rounded-full transition cursor-pointer',
    active === key ? 'bg-white shadow-card z-10' : 'hover:bg-ink-line/40',
  )
  const third = tab === 'services' ? { label: 'Type of service', ph: 'Add service', val: svc } : { label: 'Who', ph: 'Add guests', val: guestLabel(search.guests) }
  const whenVal = search.checkIn ? `${fmtShort(search.checkIn)}${search.checkOut ? ' – ' + fmtShort(search.checkOut) : ''}` : ''

  return (
    <div ref={ref} className="relative w-full max-w-[850px] mx-auto">
      <div className={cx('flex items-center rounded-full border border-ink-line shadow-pill', active ? 'bg-ink-bg' : 'bg-white')}>
        <div className={seg('where')} onClick={() => setActive('where')}>
          <div className="text-[12px] font-semibold">Where</div>
          <input
            value={search.where}
            onChange={(e) => setSearch((s) => ({ ...s, where: e.target.value }))}
            placeholder={tab === 'experiences' ? 'Search by city or landmark' : 'Search destinations'}
            className="bg-transparent outline-none text-sm w-full placeholder:text-ink-soft truncate"
          />
          {active === 'where' && search.where && <button onClick={(e) => { e.stopPropagation(); setSearch((s) => ({ ...s, where: '' })) }} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-ink-line/60 rounded-full flex items-center justify-center"><X size={12} /></button>}
        </div>
        <div className="w-px h-8 bg-ink-line" />
        <div className={seg('when')} onClick={() => setActive('when')}>
          <div className="text-[12px] font-semibold">When</div>
          <div className={cx('text-sm truncate', whenVal ? 'text-ink' : 'text-ink-soft')}>{whenVal || 'Add dates'}</div>
        </div>
        <div className="w-px h-8 bg-ink-line" />
        <div className={cx(seg('who'), 'pr-2 flex items-center justify-between')} onClick={() => setActive('who')}>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold">{third.label}</div>
            <div className={cx('text-sm truncate', third.val ? 'text-ink' : 'text-ink-soft')}>{third.val || third.ph}</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); submit() }}
            className={cx('bg-brand hover:bg-brand-dark text-white rounded-full h-12 flex items-center justify-center gap-2 transition-all shrink-0', active ? 'px-4' : 'w-12')}
          >
            <Search size={17} strokeWidth={3} />
            {active && <span className="font-semibold">Search</span>}
          </button>
        </div>
      </div>

      {/* Popovers */}
      {active === 'where' && (
        <div className="absolute left-0 top-[calc(100%+12px)] w-[420px] bg-white rounded-[32px] shadow-float p-6 z-50 fade-in">
          <div className="text-xs font-semibold mb-3 px-2">Suggested destinations</div>
          <div className="max-h-[360px] overflow-y-auto">
            {destinations.filter((d) => d.name.toLowerCase().includes(search.where.toLowerCase())).map((d) => (
              <button key={d.name} onClick={() => { setSearch((s) => ({ ...s, where: d.name })); setActive('when') }} className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-ink-bg text-left">
                <div className="w-14 h-14 rounded-xl bg-ink-bg flex items-center justify-center"><MapPin size={22} /></div>
                <div><div className="font-medium">{d.name}</div><div className="text-sm text-ink-soft">{d.tag}</div></div>
              </button>
            ))}
          </div>
        </div>
      )}
      {active === 'when' && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-[760px] max-w-[95vw] bg-white rounded-[32px] shadow-float p-8 z-50 fade-in">
          <Calendar
            checkIn={search.checkIn}
            checkOut={search.checkOut}
            onChange={(a, b) => { setSearch((s) => ({ ...s, checkIn: a, checkOut: b })); if (a && b) setActive('who') }}
          />
        </div>
      )}
      {active === 'who' && tab !== 'services' && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-[400px] bg-white rounded-[32px] shadow-float px-8 py-4 z-50 fade-in">
          <GuestPicker value={search.guests} onChange={(g) => setSearch((s) => ({ ...s, guests: g }))} />
        </div>
      )}
      {active === 'who' && tab === 'services' && (
        <div className="absolute right-0 top-[calc(100%+12px)] w-[400px] bg-white rounded-[32px] shadow-float p-4 z-50 fade-in">
          {serviceCategories.map((c) => (
            <button key={c.name} onClick={() => { setSvc(c.name); setActive(null) }} className="w-full flex items-center gap-4 p-2 rounded-xl hover:bg-ink-bg text-left">
              <span className="w-12 h-12 rounded-xl bg-ink-bg flex items-center justify-center text-2xl">{c.emoji}</span>
              <span className="font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------ Compact pill ------------------------------ */
function CompactPill({ onClick, tab }) {
  const { search } = useApp()
  const emoji = TABS.find((t) => t.key === tab)?.emoji || '🛖'
  const when = search.checkIn ? `${fmtShort(search.checkIn)}${search.checkOut ? ' – ' + fmtShort(search.checkOut) : ''}` : 'Anytime'
  return (
    <button onClick={onClick} className="flex items-center rounded-full border border-ink-line shadow-pill hover:shadow-card transition pl-4 pr-2 py-1.5 bg-white text-[14px] font-medium">
      <span className="text-xl mr-2">{emoji}</span>
      <span className="px-3 truncate max-w-[160px]">{search.where ? `Stays in ${search.where}` : 'Anywhere'}</span>
      <span className="w-px h-6 bg-ink-line" />
      <span className="px-3 hidden sm:inline">{when}</span>
      <span className="w-px h-6 bg-ink-line hidden sm:inline" />
      <span className="px-3 text-ink-soft hidden sm:inline">{guestLabel(search.guests) || 'Add guests'}</span>
      <span className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white"><Search size={13} strokeWidth={3.5} /></span>
    </button>
  )
}

/* ------------------------------ Navbar ------------------------------ */
export default function Navbar({ variant = 'home', maxW = 'max-w-[1760px]', children }) {
  const [params, setParams] = useSearchParams()
  const loc = useLocation()
  const nav = useNavigate()
  const tab = loc.pathname === '/' ? (params.get('tab') || 'all') : 'homes'
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const h = () => {
      const y = window.scrollY
      setScrolled((prev) => (prev ? y > 8 : y > 90))
      if (y > 90) setExpanded(false)
    }
    h(); window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const big = (variant === 'home' && !scrolled) || expanded

  const setTab = (k) => {
    if (loc.pathname !== '/') nav(k === 'all' ? '/' : `/?tab=${k}`)
    else setParams(k === 'all' ? {} : { tab: k })
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <header className={cx('sticky top-0 z-40 bg-white transition-all', variant === 'home' ? 'bg-gradient-to-b from-white to-[#F7F7F7]' : '', 'border-b border-ink-line/70')}>
        <div className={cx('mx-auto px-6 md:px-10', maxW)}>
          <div className="h-20 flex items-center justify-between gap-4">
            <Link to="/" className="flex-1 min-w-0"><span className="hidden md:inline"><Logo /></span><span className="md:hidden"><Logo compact /></span></Link>

            {big ? (
              <nav className="hidden md:flex items-end gap-6 h-full">
                {TABS.map((t) => (
                  <button key={t.key} onClick={() => setTab(t.key)} className={cx('flex items-center gap-2 pb-4 pt-5 border-b-[3px] transition group', tab === t.key ? 'border-ink text-ink font-semibold' : 'border-transparent text-ink-soft hover:text-ink')}>
                    <span className="text-[30px] leading-none group-hover:scale-110 transition">{t.emoji}</span>
                    <span className="text-[15px]">{t.label}</span>
                  </button>
                ))}
              </nav>
            ) : (
              <CompactPill tab={tab} onClick={() => { setExpanded(true) }} />
            )}

            <div className="flex-1 flex items-center justify-end gap-2">
              <Link to="/become-a-host" className="hidden lg:block text-[15px] font-semibold px-4 py-3 rounded-full hover:bg-ink-bg whitespace-nowrap">List your property</Link>
              <UserMenu />
            </div>
          </div>

          {big && (
            <div className="pb-6 pt-1 hidden md:block fade-in">
              <SearchBar tab={tab} onDone={() => setExpanded(false)} />
            </div>
          )}
          {children}
        </div>
      </header>
      {expanded && <div className="fixed inset-0 bg-black/25 z-30" onClick={() => setExpanded(false)} />}
    </>
  )
}

/** Search-results filter chips (Filters | Price | Type of place) */
export function FilterChips({ onFilters }) {
  return (
    <div className="flex items-center justify-center gap-2 pb-3">
      <button onClick={onFilters} className="flex items-center gap-2 border border-ink-line rounded-full px-4 py-2 text-[13px] font-medium hover:border-ink"><SlidersHorizontal size={14} /> Filters</button>
      <span className="w-px h-6 bg-ink-line mx-1" />
      <button onClick={onFilters} className="flex items-center gap-1 border border-ink-line rounded-full px-4 py-2 text-[13px] font-medium hover:border-ink">Price <ChevronDown size={14} /></button>
      <button onClick={onFilters} className="flex items-center gap-1 border border-ink-line rounded-full px-4 py-2 text-[13px] font-medium hover:border-ink">Type of place <ChevronDown size={14} /></button>
    </div>
  )
}

export { emptyGuests }
