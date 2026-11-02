import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Share, Heart, Grip, Star, ChevronDown, ChevronUp, Flag, X, ChevronLeft, CalendarX2, KeyRound, ShieldCheck,
  BadgeCheck, Film, ShieldAlert, ChevronRight, Award,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Calendar from '../components/Calendar'
import GuestPicker from '../components/GuestPicker'
import VideoTour from '../components/VideoTour'
import { Row, ListingCard } from '../components/Cards'
import { LocationMap } from '../components/Maps'
import { ModalShell } from '../components/Modals'
import { Img, Icon, Avatar } from '../components/ui'
import { useApp } from '../context/AppContext'
import { getListing, listings } from '../data/listings'
import { fmtPrice, fmtSlash, fmtLong, nightsBetween, guestLabel, defaultDates, fromISO, cx } from '../lib/utils'

const W = 'max-w-[1120px] mx-auto px-6 md:px-10'

/* ---------- Photos modal ---------- */
function PhotosModal({ l, onClose, startVideo }) {
  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto fade-in">
      <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 h-16">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-ink-bg"><ChevronLeft size={20} /></button>
        <div className="flex gap-2 text-sm font-semibold"><button className="px-3 py-2 rounded-lg hover:bg-ink-bg underline flex items-center gap-2"><Share size={15} /> Share</button></div>
      </div>
      <div className="max-w-[760px] mx-auto px-6 pb-16 space-y-2">
        <h2 className="text-[26px] font-semibold mb-6">Photo &amp; video tour</h2>
        <div id="video" className={cx('rounded-xl overflow-hidden', startVideo && 'ring-2 ring-brand')}>
          <VideoTour images={l.images} title={l.title} src={l.video} className="aspect-video" />
        </div>
        {l.images.map((src, i) => (
          <Img key={i} src={src} alt={l.title} seed={`${l.id}-${i}`} className={cx('w-full', i % 3 === 0 ? 'aspect-[3/2]' : 'aspect-square inline-block w-[calc(50%-4px)]', i % 3 === 2 && 'ml-2')} />
        ))}
      </div>
    </div>
  )
}

/* ---------- Amenities modal ---------- */
function AmenitiesModal({ l, onClose }) {
  return (
    <ModalShell onClose={onClose} width="max-w-[720px]">
      <div className="px-6 h-16 flex items-center"><button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-ink-bg"><X size={18} /></button></div>
      <div className="px-8 pb-8">
        <h3 className="text-[26px] font-semibold mb-6">What this place offers</h3>
        {l.amenities.map((a) => (
          <div key={a.label} className="flex items-center gap-4 py-5 border-b border-ink-line/70"><Icon name={a.icon} size={26} strokeWidth={1.4} /><span>{a.label}</span></div>
        ))}
        <h4 className="text-[18px] font-semibold mt-8 mb-2">Not included</h4>
        <div className="flex items-center gap-4 py-5 border-b border-ink-line/70 text-ink-soft line-through"><Icon name="Tv" size={26} strokeWidth={1.4} />Television in rooms (by design)</div>
      </div>
    </ModalShell>
  )
}

/* ---------- Booking card ---------- */
function BookingCard({ l, checkIn, checkOut, setDates, guests, setGuests, onReserve }) {
  const [open, setOpen] = useState(null) // 'dates' | 'guests'
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(null)
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])
  const nights = nightsBetween(checkIn, checkOut)
  const cancelBy = checkIn ? new Date(fromISO(checkIn).getTime() - 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : null

  return (
    <div ref={ref} className="space-y-6">
      <div className="rounded-xl border border-ink-line/70 shadow-card px-5 py-4 flex items-center justify-center gap-3 text-[15px] font-semibold">
        <span className="text-xl">🏷️</span> Prices include all fees
      </div>
      <div className="rounded-xl border border-ink-line/70 shadow-card p-6 relative">
        <div className="mb-5">
          {nights ? <><span className="text-[22px] font-semibold underline">{fmtPrice(l.price * nights)}</span> <span>for {nights} night{nights > 1 ? 's' : ''}</span></>
            : <><span className="text-[22px] font-semibold">Add dates for prices</span></>}
        </div>
        <div className="rounded-lg border border-ink-soft/60">
          <button onClick={() => setOpen(open === 'dates' ? null : 'dates')} className="grid grid-cols-2 w-full text-left">
            <div className={cx('px-3 py-2.5 border-r border-ink-soft/60 rounded-tl-lg', open === 'dates' && 'ring-2 ring-ink')}><div className="text-[10px] font-bold uppercase">Check-in</div><div className="text-sm">{checkIn ? fmtSlash(checkIn) : 'Add date'}</div></div>
            <div className="px-3 py-2.5"><div className="text-[10px] font-bold uppercase">Checkout</div><div className="text-sm">{checkOut ? fmtSlash(checkOut) : 'Add date'}</div></div>
          </button>
          <button onClick={() => setOpen(open === 'guests' ? null : 'guests')} className={cx('w-full text-left px-3 py-2.5 border-t border-ink-soft/60 flex items-center justify-between rounded-b-lg', open === 'guests' && 'ring-2 ring-ink')}>
            <div><div className="text-[10px] font-bold uppercase">Guests</div><div className="text-sm">{guestLabel(guests) || '1 guest'}</div></div>
            {open === 'guests' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {open === 'guests' && (
          <div className="absolute left-6 right-6 top-[188px] bg-white rounded-lg shadow-float border border-black/5 px-4 pb-4 z-30 fade-in">
            <GuestPicker value={guests} onChange={setGuests} max={l.guests} allowPets={false} />
            <p className="text-xs text-ink-soft mt-1">This place has a maximum of {l.guests} guests, not including infants. Pets aren't allowed.</p>
            <div className="text-right mt-3"><button onClick={() => setOpen(null)} className="font-semibold underline px-2 py-1 rounded hover:bg-ink-bg">Close</button></div>
          </div>
        )}
        {open === 'dates' && (
          <div className="absolute right-0 top-16 w-[680px] max-w-[90vw] bg-white rounded-2xl shadow-float border border-black/5 p-6 z-30 fade-in">
            <div className="mb-4"><div className="text-[22px] font-semibold">{nights ? `${nights} nights` : 'Select dates'}</div><div className="text-sm text-ink-soft">{checkIn && checkOut ? `${fmtLong(checkIn)} - ${fmtLong(checkOut)}` : 'Add your travel dates for exact pricing'}</div></div>
            <Calendar checkIn={checkIn} checkOut={checkOut} onChange={(a, b) => { setDates(a, b); if (a && b) setOpen(null) }} />
          </div>
        )}

        {cancelBy && <div className="mt-4 bg-ink-bg rounded-lg text-center text-[13px] py-2">Free cancellation before <span className="font-semibold">{cancelBy}</span></div>}
        <button onClick={onReserve} className="btn-brand w-full py-3.5 mt-4 text-[16px] rounded-full">Reserve</button>
        <p className="text-center text-sm mt-3">You won't be charged yet</p>
        {nights > 0 && (
          <div className="mt-5 pt-4 border-t border-ink-line/70 space-y-3 text-[15px]">
            <div className="flex justify-between"><span className="underline">{fmtPrice(l.price)} x {nights} nights</span><span>{fmtPrice(l.price * nights)}</span></div>
            <div className="flex justify-between"><span className="underline">Book and Stay service fee</span><span className="text-emerald-700 font-medium">$0</span></div>
            <div className="flex justify-between font-semibold pt-3 border-t border-ink-line/70"><span>Total</span><span>{fmtPrice(l.price * nights)}</span></div>
          </div>
        )}
      </div>
      <button className="mx-auto flex items-center gap-3 text-sm text-ink-soft underline font-semibold"><Flag size={15} /> Report this listing</button>
    </div>
  )
}

/* ---------- Page ---------- */
export default function ListingPage() {
  const { id } = useParams()
  const l = getListing(id) || listings[0]
  const { setModal, favorites, toggleFavorite, search, showToast } = useApp()
  const [d1, d2] = defaultDates()
  const [checkIn, setCheckIn] = useState(search.checkIn || d1)
  const [checkOut, setCheckOut] = useState(search.checkOut || d2)
  const [guests, setGuests] = useState(search.guests.adults ? search.guests : { adults: 1, children: 0, infants: 0, pets: 0 })
  const [photos, setPhotos] = useState(null) // null | 'photos' | 'video'
  const [amen, setAmen] = useState(false)
  const [showSub, setShowSub] = useState(false)
  const [showSubPrice, setShowSubPrice] = useState(false)
  const [expanded, setExpanded] = useState({})
  const photosRef = useRef(null)
  const cardRef = useRef(null)
  const nights = nightsBetween(checkIn, checkOut)
  const setDates = (a, b) => { setCheckIn(a); setCheckOut(b) }

  useEffect(() => {
    const h = () => {
      const p = photosRef.current?.getBoundingClientRect()
      const c = cardRef.current?.getBoundingClientRect()
      setShowSub(p ? p.bottom < 0 : false)
      setShowSubPrice(c ? c.bottom < 80 : false)
    }
    h(); window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [id])

  const reserve = () => {
    if (!checkIn || !checkOut) { showToast('Please add your check-in and checkout dates'); return }
    setModal({ type: 'inquiry', listing: l, checkIn, checkOut, guests })
  }
  const scrollTo = (sid) => document.getElementById(sid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const fav = favorites.has(l.id)
  const nearby = listings.filter((x) => x.id !== l.id).sort((a, b) => (a.country === l.country ? -1 : 1) - (b.country === l.country ? -1 : 1))

  return (
    <div className="min-h-screen">
      <Navbar variant="listing" maxW="max-w-[1120px]" />

      {/* Sticky sub-nav (Photos · Amenities · Reviews · Location) */}
      <div className={cx('fixed top-0 inset-x-0 z-50 bg-white border-b border-ink-line/70 transition', showSub ? 'translate-y-0' : '-translate-y-full')}>
        <div className={cx(W, 'h-20 flex items-center justify-between')}>
          <nav className="flex gap-6 text-sm font-semibold">
            {[['photos', 'Photos'], ['amenities', 'Amenities'], ['reviews', 'Reviews'], ['location', 'Location']].map(([k, t]) => (
              <button key={k} onClick={() => scrollTo(k)} className="py-7 border-b-4 border-transparent hover:border-ink">{t}</button>
            ))}
          </nav>
          {showSubPrice && (
            <div className="flex items-center gap-6 fade-in">
              <div className="text-sm leading-tight hidden sm:block">
                <div><span className="font-semibold underline">{fmtPrice(l.price * (nights || 1))}</span></div>
                <div className="text-xs">for {nights || 1} night{nights === 1 ? '' : 's'}</div>
                <div className="text-[11px] flex items-center gap-1"><Star size={9} className="fill-ink" /> {l.rating}</div>
              </div>
              <button onClick={reserve} className="btn-brand rounded-full px-8 py-3">Reserve</button>
            </div>
          )}
        </div>
      </div>

      <main className={cx(W, 'pt-6')}>
        {/* Title */}
        <div className="flex items-center justify-between gap-4" id="photos">
          <h1 className="text-[26px] font-semibold tracking-tight">{l.title}</h1>
          <div className="flex gap-1 text-sm font-semibold shrink-0">
            <button onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('Link copied to clipboard') }} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-bg"><Share size={15} /> <span className="underline hidden sm:inline">Share</span></button>
            <button onClick={() => toggleFavorite(l.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-bg"><Heart size={15} className={fav ? 'fill-brand text-brand' : ''} /> <span className="underline hidden sm:inline">{fav ? 'Saved' : 'Save'}</span></button>
          </div>
        </div>

        {/* Photo grid */}
        <div ref={photosRef} className="relative mt-6 grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[420px] rounded-2xl overflow-hidden">
          <button onClick={() => setPhotos('photos')} className="col-span-4 md:col-span-2 row-span-2 relative group"><Img src={l.images[0]} alt={l.title} seed={l.id} className="w-full h-full group-hover:brightness-90 transition" /></button>
          {l.images.slice(1, 5).map((src, i) => (
            <button key={i} onClick={() => setPhotos('photos')} className="hidden md:block relative group"><Img src={src} alt={l.title} seed={`${l.id}-${i + 1}`} className="w-full h-full group-hover:brightness-90 transition" /></button>
          ))}
          <div className="absolute bottom-5 right-5 flex gap-2">
            <button onClick={() => setPhotos('video')} className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black"><Film size={15} /> Watch video tour</button>
            <button onClick={() => setPhotos('photos')} className="bg-white border border-ink text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-ink-bg"><Grip size={15} /> Show all photos</button>
          </div>
        </div>

        {/* Two-column body */}
        <div className="grid lg:grid-cols-[1fr_372px] gap-16 xl:gap-24 mt-8">
          <div className="min-w-0">
            <h2 className="text-[22px] font-semibold">{l.type} in {l.location}</h2>
            <div className="text-[16px]">{l.guests} guests · {l.bedrooms} bedrooms · {l.beds} beds · {l.baths} baths</div>
            <div className="flex items-center gap-1 font-semibold mt-1"><Star size={14} className="fill-ink" /> {l.rating} · <button onClick={() => scrollTo('reviews')} className="underline">{l.reviewsCount} reviews</button></div>
            <span className="inline-block mt-2 text-[11px] font-medium bg-ink-bg text-ink-soft rounded px-1.5 py-0.5">Free cancellation</span>

            {l.guestFavorite && (
              <div className="mt-6 border border-ink-line rounded-2xl px-6 py-5 flex items-center gap-6">
                <div className="flex items-center gap-1 font-bold text-[17px] leading-tight text-center"><Award size={30} />Guest<br />favorite</div>
                <div className="flex-1 text-[15px] font-medium">One of the most loved properties on Book and Stay, according to guests</div>
                <div className="text-center"><div className="text-[20px] font-bold">{l.rating}</div><div className="text-[10px]">★★★★★</div></div>
              </div>
            )}

            <div className="flex items-center gap-4 py-6 mt-6 border-y border-ink-line/70">
              <Avatar name={l.host.name} size={42} />
              <div>
                <div className="font-semibold text-[16px]">Hosted by {l.host.name}</div>
                <div className="text-sm text-ink-soft">Verified Premium Partner · Featured since {l.host.since}</div>
              </div>
              <BadgeCheck className="ml-auto text-brand" size={26} />
            </div>

            <div className="py-8 space-y-6 border-b border-ink-line/70">
              {l.highlights.map((h) => (
                <div key={h.title} className="flex gap-6">
                  <Icon name={h.icon} size={24} strokeWidth={1.5} className="shrink-0 mt-0.5" />
                  <div><div className="font-semibold">{h.title}</div><div className="text-sm text-ink-soft">{h.text}</div></div>
                </div>
              ))}
            </div>

            <div className="py-8 border-b border-ink-line/70 text-[16px] leading-relaxed whitespace-pre-line">{l.description}</div>

            {/* Video tour inline */}
            <div className="py-10 border-b border-ink-line/70">
              <h2 className="text-[22px] font-semibold mb-1">Take the video tour</h2>
              <p className="text-ink-soft text-sm mb-5">Every Book and Stay property is showcased with a cinematic walkthrough.</p>
              <VideoTour images={l.images} title={l.title} src={l.video} className="aspect-video rounded-2xl" autoPlay={false} />
            </div>

            {/* Amenities */}
            <div id="amenities" className="py-10 border-b border-ink-line/70 scroll-mt-24">
              <h2 className="text-[22px] font-semibold mb-6">What this place offers</h2>
              <div className="grid sm:grid-cols-2 gap-y-5 gap-x-6">
                {l.amenities.slice(0, 10).map((a) => (
                  <div key={a.label} className="flex items-center gap-4 text-[16px]"><Icon name={a.icon} size={24} strokeWidth={1.4} />{a.label}</div>
                ))}
              </div>
              <button onClick={() => setAmen(true)} className="mt-8 bg-ink-bg hover:bg-ink-line/60 rounded-lg px-6 py-3 font-semibold">Show all {l.amenities.length} amenities</button>
            </div>

            {/* Calendar */}
            <div className="py-10">
              <h2 className="text-[22px] font-semibold">{nights ? `${nights} nights in ${l.city}` : 'Select check-in date'}</h2>
              <p className="text-sm text-ink-soft mb-6">{checkIn && checkOut ? `${fmtLong(checkIn)} - ${fmtLong(checkOut)}` : 'Add your travel dates for exact pricing'}</p>
              <Calendar checkIn={checkIn} checkOut={checkOut} onChange={setDates} />
            </div>
          </div>

          <aside className="hidden lg:block">
            <div ref={cardRef} className="sticky top-28">
              <BookingCard l={l} checkIn={checkIn} checkOut={checkOut} setDates={setDates} guests={guests} setGuests={setGuests} onReserve={reserve} />
            </div>
          </aside>
        </div>

        {/* Reviews */}
        <section id="reviews" className="py-12 border-t border-ink-line/70 scroll-mt-24">
          <h2 className="text-[26px] font-semibold flex items-center gap-2"><Star size={22} className="fill-ink" /> {l.rating} · {l.reviewsCount} reviews</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 pb-8 border-b border-ink-line/70 text-sm">
            {[['Cleanliness', 4.9], ['Accuracy', 5.0], ['Check-in', 4.9], ['Communication', 5.0], ['Location', 5.0], ['Value', 4.8]].map(([k, v]) => (
              <div key={k} className="md:border-r last:border-0 border-ink-line/70"><div className="font-semibold">{k}</div><div className="text-[18px] font-semibold">{v.toFixed(1)}</div></div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-x-24 gap-y-10 mt-10">
            {l.reviews.map((r, i) => (
              <div key={i}>
                <div className="flex items-center gap-3">
                  <Avatar name={r.name} src={r.avatar} size={48} />
                  <div><div className="font-semibold">{r.name}</div><div className="text-sm text-ink-soft">{r.from}</div></div>
                </div>
                <div className="text-[13px] mt-2 flex items-center gap-1.5"><span className="text-[10px] tracking-tight">★★★★★</span> · <span className="font-semibold">{r.when}</span> · <span className="text-ink-soft">{r.stay}</span></div>
                <p className={cx('mt-1 text-[16px] leading-relaxed', !expanded[i] && 'line-clamp-3')}>{r.text}</p>
                {r.text.length > 140 && <button onClick={() => setExpanded((e) => ({ ...e, [i]: !e[i] }))} className="mt-2 font-semibold underline">{expanded[i] ? 'Show less' : 'Show more'}</button>}
              </div>
            ))}
          </div>
          <button className="mt-10 border border-ink rounded-lg px-6 py-3 font-semibold hover:bg-ink-bg">Show all {l.reviewsCount} reviews</button>
        </section>

        {/* Location */}
        <section id="location" className="py-12 border-t border-ink-line/70 scroll-mt-24">
          <h2 className="text-[22px] font-semibold">Where you'll be</h2>
          <div className="font-semibold mt-6">{l.location}</div>
          <p className="mt-2 text-[16px]">{l.region} — a gateway to some of Africa's most celebrated wildlife and landscapes, with game reserves, cultural villages and breathtaking scenery just beyond your door.</p>
          <div className="h-[380px] md:h-[480px] mt-6 relative z-0"><LocationMap lat={l.lat} lng={l.lng} /></div>
          <p className="mt-6 text-[16px]">Exact location will be provided by the property after your inquiry is confirmed.</p>
        </section>

        {/* Meet your host */}
        <section className="py-12 border-t border-ink-line/70">
          <h2 className="text-[22px] font-semibold mb-8">Meet your host</h2>
          <div className="grid md:grid-cols-[380px_1fr] gap-12 items-start">
            <div className="rounded-3xl shadow-float p-8 flex flex-col items-center text-center">
              <div className="relative"><Avatar name={l.host.name} size={104} /><span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-brand flex items-center justify-center border-2 border-white"><ShieldCheck size={16} className="text-white" /></span></div>
              <div className="text-[26px] font-bold mt-3 leading-tight">{l.host.name}</div>
              <div className="text-xs mt-1">Verified Premium Partner · Featured since {l.host.since}</div>
            </div>
            <div className="max-w-md">
              {l.host.cohosts?.length > 0 && (<>
                <div className="font-semibold">Co-hosts</div>
                <div className="flex items-center gap-3 mt-3">{l.host.cohosts.map((c) => <div key={c.name} className="flex items-center gap-3"><Avatar name={c.name} src={c.avatar} size={36} /> {c.name}</div>)}</div>
              </>)}
              <div className="font-semibold mt-6">Host details</div>
              <p className="text-[15px] mt-1">Response rate: 100%<br />Responds within an hour</p>
              <button onClick={reserve} className="mt-6 bg-ink-bg hover:bg-ink-line/60 rounded-lg px-6 py-3 font-semibold">Message host</button>
              <div className="flex items-start gap-3 mt-6 pt-6 border-t border-ink-line/70 text-xs text-ink-soft">
                <ShieldAlert size={18} className="text-brand shrink-0" />
                To help protect your stay, always use Book and Stay to send your first inquiry to properties.
              </div>
            </div>
          </div>
        </section>

        {/* Things to know */}
        <section className="py-12 border-t border-ink-line/70">
          <h2 className="text-[22px] font-semibold mb-6">Things to know</h2>
          <div className="grid md:grid-cols-3 gap-8 text-[15px]">
            <div><CalendarX2 size={24} strokeWidth={1.5} /><div className="font-semibold mt-4 mb-2">Cancellation policy</div><p className="text-ink-soft">Free cancellation up to 30 days before check-in. Cancel within 30 days for a partial refund. Review this property's full policy for details.</p><button className="underline font-semibold mt-2">Learn more</button></div>
            <div><KeyRound size={24} strokeWidth={1.5} /><div className="font-semibold mt-4 mb-2">Lodge rules</div><p className="text-ink-soft">Check-in: {l.rules.checkin}<br />Checkout before {l.rules.checkout}<br />{l.guests} guests maximum<br />Guided walks only after dark</p><button className="underline font-semibold mt-2">Learn more</button></div>
            <div><ShieldCheck size={24} strokeWidth={1.5} /><div className="font-semibold mt-4 mb-2">Safety &amp; property</div><p className="text-ink-soft">24/7 Askari escort between tents<br />Wildlife roams freely — unfenced camp<br />First-aid & flying doctors cover</p><button className="underline font-semibold mt-2">Learn more</button></div>
          </div>
        </section>

        {/* More stays nearby */}
        <section className="py-8 border-t border-ink-line/70">
          <Row title="More stays nearby" pager>
            {nearby.map((x) => <ListingCard key={x.id} l={x} nights={nights || 2} width="w-[calc(50%-8px)] md:w-[calc(20%-13px)]" />)}
          </Row>
        </section>
      </main>

      {/* Breadcrumbs + explore */}
      <div className="bg-ink-bg mt-8 border-t border-ink-line/70">
        <div className={cx(W, 'py-6 text-sm flex items-center gap-2 border-b border-ink-line/70')}>
          <Link to="/" className="hover:underline">Book and Stay</Link><ChevronRight size={14} />
          <Link to={`/search?where=${l.country}`} className="hover:underline">{l.country}</Link><ChevronRight size={14} />
          <span>{l.region}</span><ChevronRight size={14} />
          <span>{l.city}</span>
        </div>
        <div className={cx(W, 'py-10')}>
          <h2 className="text-[22px] font-semibold mb-6">Explore other options in and around {l.country}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5">
            {['Mombasa', 'Naivasha', 'Malindi', 'Arusha', 'Nanyuki', 'Kisumu', 'Nakuru', 'Watamu', 'Diani'].map((c) => (
              <Link to={`/search?where=${c}`} key={c} className="text-sm group"><div className="font-semibold group-hover:underline">{c}</div><div className="text-ink-soft">Premium stays</div></Link>
            ))}
          </div>
          <h2 className="text-[22px] font-semibold mt-12 mb-6">Other types of stays on Book and Stay</h2>
          <div className="grid md:grid-cols-3 gap-y-5 text-sm font-semibold">
            {[`${l.city} safari lodges`, `${l.city} tented camps`, `Stays with a pool in ${l.city}`, `Luxury villas in ${l.country}`, `Unique stays in ${l.country}`, `Family lodges in ${l.country}`].map((t) => (
              <Link key={t} to="/search" className="hover:underline">{t}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile reserve bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-ink-line/70 px-6 py-4 flex items-center justify-between z-40">
        <div className="text-sm"><span className="font-semibold underline">{fmtPrice(l.price * (nights || 1))}</span> for {nights || 1} nights<div className="text-xs">{fmtLong(checkIn)} – {fmtLong(checkOut)}</div></div>
        <button onClick={reserve} className="btn-brand rounded-lg px-8 py-3">Reserve</button>
      </div>

      <Footer inspirationOn={false} maxW="max-w-[1120px]" />
      {photos && <PhotosModal l={l} startVideo={photos === 'video'} onClose={() => setPhotos(null)} />}
      {amen && <AmenitiesModal l={l} onClose={() => setAmen(false)} />}
    </div>
  )
}
