import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react'
import { Img } from './ui'
import { useApp } from '../context/AppContext'
import { fmtPrice, cx } from '../lib/utils'

/** Heart / save button overlay */
export function HeartBtn({ id, className = '' }) {
  const { favorites, toggleFavorite } = useApp()
  const on = favorites.has(id)
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id) }}
      className={cx('transition active:scale-90 hover:scale-110', className)}
      aria-label="Save"
    >
      <Heart size={24} strokeWidth={2} className={on ? 'fill-brand text-white' : 'fill-black/50 text-white'} />
    </button>
  )
}

export function Badge({ children }) {
  return <span className="bg-white/95 text-ink text-[12px] font-semibold px-2.5 py-1 rounded-full shadow-sm">{children}</span>
}

/** Horizontal section row with title + "→" chip + prev/next arrows (Airbnb homepage pattern). */
export function Row({ title, subtitle, to, children, pager = false }) {
  const ref = useRef(null)
  const [state, setState] = useState({ l: false, r: true, page: 1, pages: 1 })
  const update = () => {
    const el = ref.current; if (!el) return
    const pages = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth))
    setState({
      l: el.scrollLeft > 4,
      r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      pages,
      page: Math.min(pages, Math.round(el.scrollLeft / el.clientWidth) + 1),
    })
  }
  useEffect(() => { update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update) }, [])
  const go = (d) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.9, behavior: 'smooth' })

  return (
    <section className="py-5">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-[22px] font-semibold flex items-center gap-2 tracking-tight">
            {to ? <Link to={to} className="flex items-center gap-2 group">{title}<span className="w-7 h-7 rounded-full bg-ink-bg flex items-center justify-center group-hover:bg-ink-line/60"><ArrowRight size={15} /></span></Link> : title}
          </h2>
          {subtitle && <p className="text-sm text-ink-soft mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {pager && <span className="text-sm mr-2">{state.page} / {state.pages}</span>}
          <button className="arrow-btn" disabled={!state.l} onClick={() => go(-1)}><ChevronLeft size={14} /></button>
          <button className="arrow-btn" disabled={!state.r} onClick={() => go(1)}><ChevronRight size={14} /></button>
        </div>
      </div>
      <div ref={ref} onScroll={update} className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x">
        {children}
      </div>
    </section>
  )
}

/** Compact square listing card used in homepage rows. */
export function ListingCard({ l, nights = 2, width = 'w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(16.66%-14px)]' }) {
  return (
    <Link to={`/rooms/${l.id}`} className={cx('shrink-0 snap-start group', width)}>
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-bg">
        <Img src={l.images[0]} alt={l.title} seed={l.id} className="w-full h-full group-hover:scale-105 transition duration-500" />
        {l.guestFavorite && <div className="absolute top-3 left-3"><Badge>Guest favorite</Badge></div>}
        {!l.guestFavorite && l.premium && <div className="absolute top-3 left-3"><Badge>✦ Premium</Badge></div>}
        <HeartBtn id={l.id} className="absolute top-3 right-3" />
      </div>
      <div className="mt-2 text-[14px] leading-snug">
        <div className="font-semibold truncate">{l.type} in {l.city}</div>
        <div className="text-ink-soft truncate text-[13px]">{l.title}</div>
        <div className="text-ink-soft text-[13px]">
          {fmtPrice(l.price * nights)} for {nights} nights · <Star size={10} className="inline -mt-0.5 fill-ink-soft" /> {l.rating}
        </div>
      </div>
    </Link>
  )
}

/** Experience / service card (time badge or "Trending"/"Original" badge) */
export function ExperienceCard({ e, kind = 'experience' }) {
  return (
    <Link to={kind === 'experience' ? `/experiences/${e.id}` : `/services/${e.id}`} className="shrink-0 snap-start group w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(16.66%-14px)]">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink-bg">
        <Img src={e.img} alt={e.title} seed={e.id} className="w-full h-full group-hover:scale-105 transition duration-500" />
        {kind === 'experience' && <div className="absolute top-3 left-3">{e.badge ? <Badge>{e.badge === 'Original' ? '🌿 Original' : e.badge}</Badge> : <Badge>{e.time}</Badge>}</div>}
        <HeartBtn id={e.id} className="absolute top-3 right-3" />
      </div>
      <div className="mt-2 text-[14px] leading-snug">
        <div className="font-semibold line-clamp-2">{kind === 'experience' ? `${e.city}: ${e.title}` : `${e.title} by ${e.by}`}</div>
        <div className="text-ink-soft text-[13px]">
          From {fmtPrice(e.price)} / guest{e.rating ? <> · <Star size={10} className="inline -mt-0.5 fill-ink-soft" /> {e.rating}</> : null}
        </div>
        {e.min && <div className="text-ink-soft text-[13px]">Minimum {fmtPrice(e.min)} to book</div>}
      </div>
    </Link>
  )
}
