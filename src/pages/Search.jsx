import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Star, Map as MapIcon, List, X } from 'lucide-react'
import Navbar, { FilterChips } from '../components/Navbar'
import Footer from '../components/Footer'
import { HeartBtn, Badge } from '../components/Cards'
import { PriceMap } from '../components/Maps'
import { Img } from '../components/ui'
import { ModalShell } from '../components/Modals'
import { listings } from '../data/listings'
import { fmtPrice, fmtShort, nightsBetween, defaultDates, cx } from '../lib/utils'

function Carousel({ images, alt, seed, className }) {
  const [i, setI] = useState(0)
  const go = (e, d) => { e.preventDefault(); e.stopPropagation(); setI((x) => (x + d + images.length) % images.length) }
  return (
    <div className={cx('relative overflow-hidden group/c bg-ink-bg', className)}>
      <div className="flex h-full transition-transform duration-300" style={{ transform: `translateX(-${i * 100}%)` }}>
        {images.map((src, k) => <Img key={k} src={src} alt={alt} seed={`${seed}-${k}`} className="w-full h-full shrink-0" />)}
      </div>
      {i > 0 && <button onClick={(e) => go(e, -1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover/c:opacity-100 transition"><ChevronLeft size={14} /></button>}
      {i < images.length - 1 && <button onClick={(e) => go(e, 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 group-hover/c:opacity-100 transition"><ChevronRight size={14} /></button>}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, k) => <span key={k} className={cx('w-1.5 h-1.5 rounded-full', k === i ? 'bg-white' : 'bg-white/55')} />)}
      </div>
    </div>
  )
}

function WideCard({ l, nights, dates, onHover }) {
  return (
    <Link to={`/rooms/${l.id}`} onMouseEnter={() => onHover(l.id)} onMouseLeave={() => onHover(null)} className="flex flex-col sm:flex-row gap-5 p-3 rounded-3xl shadow-card hover:shadow-float transition bg-white relative">
      <div className="relative sm:w-[42%] shrink-0">
        <Carousel images={l.images} alt={l.title} seed={l.id} className="aspect-[4/3] rounded-2xl" />
        {l.guestFavorite && <div className="absolute top-3 left-3"><Badge>Guest favorite</Badge></div>}
      </div>
      <div className="flex-1 py-2 pr-12 flex flex-col">
        <div className="text-[19px] font-semibold">{l.type} in {l.city}</div>
        <div className="text-ink-soft text-[15px] mt-0.5">{l.subtitle}</div>
        <div className="text-ink-soft text-[15px]">{l.bedrooms} bedrooms · {l.beds} beds · {l.baths} baths</div>
        <div className="text-ink-soft text-[15px]">{dates}</div>
        <div className="mt-auto pt-4 flex items-center gap-2 text-[15px]">
          <span className="underline font-semibold">{fmtPrice(l.price * nights)}</span> for {nights} nights
          <span>·</span><Star size={13} className="fill-ink" /> {l.rating} ({l.reviewsCount})
        </div>
      </div>
      <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-ink-bg flex items-center justify-center"><HeartBtn id={l.id} className="[&_svg]:fill-transparent [&_svg]:text-ink" /></div>
    </Link>
  )
}

function GridCard({ l, nights, dates, onHover }) {
  return (
    <Link to={`/rooms/${l.id}`} onMouseEnter={() => onHover(l.id)} onMouseLeave={() => onHover(null)} className="group">
      <div className="relative">
        <Carousel images={l.images} alt={l.title} seed={l.id} className="aspect-[1/0.95] rounded-2xl" />
        {l.guestFavorite && <div className="absolute top-3 left-3"><Badge>Guest favorite</Badge></div>}
        <HeartBtn id={l.id} className="absolute top-3 right-3" />
      </div>
      <div className="mt-3 text-[15px] leading-snug">
        <div className="flex justify-between gap-2"><span className="font-semibold truncate">{l.type} in {l.city}</span><span className="flex items-center gap-1 shrink-0"><Star size={12} className="fill-ink" /> {l.rating}</span></div>
        <div className="text-ink-soft truncate">{l.title}</div>
        <div className="text-ink-soft">{l.beds} beds · {dates}</div>
        <div className="mt-1"><span className="underline font-semibold">{fmtPrice(l.price * nights)}</span> for {nights} nights</div>
      </div>
    </Link>
  )
}

const TYPES = [['safari', 'Safari lodges & camps'], ['beach', 'Beach villas'], ['unique', 'Unique stays'], ['mountain', 'Mountain & vineyard']]

function FiltersModal({ value, onChange, onClose, count }) {
  const [v, setV] = useState(value)
  return (
    <ModalShell onClose={onClose} width="max-w-[640px]">
      <div className="flex items-center justify-between px-6 h-16 border-b border-ink-line/70">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-ink-bg"><X size={18} /></button>
        <div className="font-bold">Filters</div><div className="w-8" />
      </div>
      <div className="p-6 space-y-8">
        <div>
          <h4 className="text-[20px] font-semibold">Type of place</h4>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {TYPES.map(([k, label]) => (
              <button key={k} onClick={() => setV((x) => ({ ...x, types: x.types.includes(k) ? x.types.filter((t) => t !== k) : [...x.types, k] }))}
                className={cx('border rounded-xl p-4 text-left font-medium transition', v.types.includes(k) ? 'border-ink ring-1 ring-ink bg-ink-bg' : 'border-ink-line hover:border-ink')}>{label}</button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-[20px] font-semibold">Price range</h4>
          <p className="text-sm text-ink-soft">Nightly prices before taxes</p>
          <input type="range" min={300} max={1500} step={50} value={v.max} onChange={(e) => setV((x) => ({ ...x, max: +e.target.value }))} className="w-full mt-5 accent-brand" />
          <div className="flex justify-between text-sm mt-1"><span>$300</span><span className="font-semibold">Up to {fmtPrice(v.max)}{v.max >= 1500 ? '+' : ''}</span></div>
        </div>
        <div>
          <h4 className="text-[20px] font-semibold">Top picks</h4>
          <label className="flex items-center justify-between mt-4 cursor-pointer">
            <span><span className="font-medium">Guest favorites</span><br /><span className="text-sm text-ink-soft">The most loved properties on Book and Stay</span></span>
            <input type="checkbox" checked={v.fav} onChange={(e) => setV((x) => ({ ...x, fav: e.target.checked }))} className="w-5 h-5 accent-ink" />
          </label>
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-4 border-t border-ink-line/70">
        <button onClick={() => setV({ types: [], max: 1500, fav: false })} className="font-semibold underline">Clear all</button>
        <button onClick={() => { onChange(v); onClose() }} className="bg-ink text-white font-semibold px-6 py-3 rounded-lg hover:bg-black">Show {count(v)} places</button>
      </div>
    </ModalShell>
  )
}

export default function SearchPage() {
  const [params] = useSearchParams()
  const where = params.get('where') || ''
  const type = params.get('type')
  const [d1, d2] = defaultDates()
  const checkIn = params.get('checkin') || d1
  const checkOut = params.get('checkout') || d2
  const nights = nightsBetween(checkIn, checkOut) || 2
  const dates = `${fmtShort(checkIn)} – ${fmtShort(checkOut)}`
  const [active, setActive] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState({ types: type ? [type] : [], max: 1500, fav: false })

  const apply = (f) => {
    const w = where.toLowerCase()
    let r = listings.filter((l) => !w || [l.city, l.country, l.location, l.region, l.title].some((s) => s.toLowerCase().includes(w)))
    if (!r.length) r = listings
    return r.filter((l) => (!f.types.length || f.types.includes(l.category)) && (f.max >= 1500 || l.price <= f.max) && (!f.fav || l.guestFavorite))
  }
  const results = useMemo(() => apply(filters), [where, filters])
  const exact = listings.some((l) => [l.city, l.country, l.location, l.region, l.title].some((s) => s.toLowerCase().includes(where.toLowerCase())))
  const [first, ...rest] = results

  return (
    <div className="min-h-screen">
      <Navbar variant="search">
        <FilterChips onFilters={() => setFiltersOpen(true)} />
      </Navbar>
      <main className="max-w-[1760px] mx-auto px-6 md:px-10 pt-6">
        <div className="flex gap-8">
          <div className={cx('flex-1 min-w-0', showMap && 'hidden lg:block')}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[22px] font-semibold tracking-tight">
                {results.length} premium {results.length === 1 ? 'stay' : 'stays'} {where && exact ? `in ${where}` : 'across Africa'}
              </h1>
              <div className="hidden sm:flex items-center gap-2 text-[15px] font-semibold"><span className="text-xl">🏷️</span> Prices include all fees</div>
            </div>
            {!results.length && <p className="text-ink-soft">No stays match these filters. <button className="underline font-semibold" onClick={() => setFilters({ types: [], max: 1500, fav: false })}>Clear filters</button></p>}
            {first && <WideCard l={first} nights={nights} dates={dates} onHover={setActive} />}
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-10 mt-10">
              {rest.map((l) => <GridCard key={l.id} l={l} nights={nights} dates={dates} onHover={setActive} />)}
            </div>
          </div>
          <div className={cx('lg:w-[42%] shrink-0', showMap ? 'block w-full' : 'hidden lg:block')}>
            <div className="sticky top-[150px] h-[calc(100vh-170px)]">
              <PriceMap listings={results} activeId={active} setActiveId={setActive} nights={nights} />
            </div>
          </div>
        </div>
      </main>
      <button onClick={() => setShowMap((s) => !s)} className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-30 bg-ink text-white font-semibold px-5 py-3.5 rounded-full shadow-float flex items-center gap-2 text-sm">
        {showMap ? <><List size={16} /> Show list</> : <><MapIcon size={16} /> Show map</>}
      </button>
      {filtersOpen && <FiltersModal value={filters} onChange={setFilters} onClose={() => setFiltersOpen(false)} count={(f) => apply(f).length} />}
      <Footer inspirationOn={false} />
    </div>
  )
}
