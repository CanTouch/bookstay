import { useParams, Link } from 'react-router-dom'
import { Star, Clock, Users, Languages, Send } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Img } from '../components/ui'
import { Row, ExperienceCard } from '../components/Cards'
import { useApp } from '../context/AppContext'
import { experiences, services, listings } from '../data/listings'
import { fmtPrice, defaultDates } from '../lib/utils'

/** Lightweight detail page for experiences & services, reusing the direct inquiry flow. */
export default function ExperiencePage({ kind }) {
  const { id } = useParams()
  const pool = kind === 'experience' ? experiences : services
  const e = pool.find((x) => x.id === id) || pool[0]
  const { setModal } = useApp()
  const [a, b] = defaultDates()
  const title = kind === 'experience' ? e.title : `${e.title} by ${e.by}`
  const pseudoListing = {
    ...listings[0], id: e.id, title, type: kind === 'experience' ? 'Experience' : 'Service', price: e.price, images: [e.img],
    rating: e.rating || 4.9, reviewsCount: 64, host: { ...listings[0].host, name: kind === 'experience' ? 'Experience host' : e.by },
  }
  const inquire = () => setModal({ type: 'inquiry', listing: pseudoListing, checkIn: a, checkOut: b, guests: { adults: 2, children: 0, infants: 0, pets: 0 } })

  return (
    <div className="min-h-screen">
      <Navbar variant="listing" maxW="max-w-[1120px]" />
      <main className="max-w-[1120px] mx-auto px-6 md:px-10 pt-8">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <Img src={e.img} alt={title} seed={e.id} className="w-full aspect-square rounded-3xl" />
          <div className="md:sticky md:top-28">
            <div className="text-sm text-ink-soft">{kind === 'experience' ? e.city : 'Lodge service'}</div>
            <h1 className="text-[32px] font-bold leading-tight tracking-tight mt-1">{title}</h1>
            {e.rating && <div className="flex items-center gap-1 mt-2 font-semibold"><Star size={14} className="fill-ink" /> {e.rating} · <span className="underline">64 reviews</span></div>}
            <div className="mt-6 space-y-4 border-y border-ink-line/70 py-6">
              <div className="flex gap-4"><Clock size={22} strokeWidth={1.5} /> <div><div className="font-semibold">{kind === 'experience' ? `Starts ${e.time}` : 'Flexible timing'}</div><div className="text-sm text-ink-soft">3–4 hours</div></div></div>
              <div className="flex gap-4"><Users size={22} strokeWidth={1.5} /> <div><div className="font-semibold">Private or small group</div><div className="text-sm text-ink-soft">Up to 8 guests</div></div></div>
              <div className="flex gap-4"><Languages size={22} strokeWidth={1.5} /> <div><div className="font-semibold">Hosted in English & Swahili</div></div></div>
            </div>
            <p className="mt-6 text-[16px] leading-relaxed">A curated Book and Stay {kind} led by local experts. Placeholder description — replace with the partner's own copy, highlights, itinerary and inclusions.</p>
            <div className="mt-8 rounded-2xl shadow-card border border-ink-line/70 p-6 flex items-center justify-between">
              <div><span className="text-[22px] font-semibold">From {fmtPrice(e.price)}</span> <span className="text-ink-soft">/ guest</span>{e.min && <div className="text-sm text-ink-soft">Minimum {fmtPrice(e.min)} to book</div>}</div>
              <button onClick={inquire} className="btn-brand px-6 py-3.5 rounded-full flex items-center gap-2"><Send size={16} /> Inquire</button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-ink-line/70 pt-4">
          <Row title={kind === 'experience' ? 'More experiences' : 'More services'}>
            {pool.filter((x) => x.id !== e.id).map((x) => <ExperienceCard key={x.id} e={x} kind={kind} />)}
          </Row>
        </div>
      </main>
      <Footer inspirationOn={false} maxW="max-w-[1120px]" />
    </div>
  )
}
