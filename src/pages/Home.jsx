import { Link, useSearchParams } from 'react-router-dom'
import { BadgeCheck, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Row, ListingCard, ExperienceCard } from '../components/Cards'
import VideoTour from '../components/VideoTour'
import { Img } from '../components/ui'
import { destinations, listings, experiences, services, serviceCategories } from '../data/listings'
import { fmtPrice } from '../lib/utils'

const W = 'max-w-[1760px] mx-auto px-6 md:px-10'

function DestinationRow({ title = 'Destinations for you' }) {
  return (
    <Row title={title}>
      {destinations.map((d) => (
        <Link key={d.name} to={`/search?where=${encodeURIComponent(d.name)}`} className="shrink-0 snap-start w-[calc(33.33%-11px)] sm:w-[calc(20%-13px)] lg:w-[calc(10%-14.5px)] min-w-[110px] group">
          <div className="aspect-[1.05] rounded-2xl overflow-hidden bg-ink-bg">
            <Img src={d.img} alt={d.name} seed={d.name} className="w-full h-full group-hover:scale-105 transition duration-500" />
          </div>
          <div className="mt-2 text-[14px] font-semibold">{d.name}</div>
          <div className="text-[12px] text-ink-soft leading-tight">{d.tag}</div>
        </Link>
      ))}
    </Row>
  )
}

function ServicesGrid() {
  return (
    <Row title="Find services near you">
      {serviceCategories.map((c) => (
        <Link key={c.name} to="/?tab=services" className="shrink-0 snap-start w-[calc(33.33%-11px)] sm:w-[calc(20%-13px)] lg:w-[calc(14.28%-14px)] min-w-[120px] group">
          <div className="aspect-square rounded-2xl bg-ink-bg flex items-center justify-center text-[64px] group-hover:scale-[1.03] transition">
            <span className="drop-shadow-md group-hover:scale-110 transition">{c.emoji}</span>
          </div>
          <div className="mt-2 text-[14px] font-semibold">{c.name}</div>
        </Link>
      ))}
    </Row>
  )
}

function FeaturedPartner() {
  const l = listings[1]
  return (
    <section className="py-6">
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-0 rounded-3xl overflow-hidden border border-ink-line/70 shadow-pill">
        <VideoTour images={l.images} title={l.title} src={l.video} className="h-[300px] sm:h-[420px]" />
        <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-[#FFF8F0] to-white">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-brand"><BadgeCheck size={16} /> Verified Premium Partner</div>
          <h3 className="text-[28px] md:text-[34px] font-bold leading-tight tracking-tight mt-3">{l.title}</h3>
          <p className="text-ink-soft mt-1">{l.location} · {l.subtitle}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/90 line-clamp-4">{l.description}</p>
          <div className="flex items-center gap-4 mt-6">
            <Link to={`/rooms/${l.id}`} className="btn-brand px-6 py-3.5 inline-flex items-center gap-2">View property <ArrowRight size={16} /></Link>
            <div className="text-sm"><span className="font-semibold">{fmtPrice(l.price)}</span> <span className="text-ink-soft">/ night</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PartnerBanner() {
  return (
    <section className="py-8">
      <div className="relative rounded-3xl overflow-hidden bg-ink text-white">
        <Img src={listings[0].images[0]} alt="" seed="banner" className="absolute inset-0 w-full h-full opacity-40" />
        <div className="relative p-10 md:p-14 max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-widest text-white/80">For lodges, camps &amp; villas</div>
          <h3 className="text-3xl md:text-[42px] font-bold leading-tight mt-3">Showcase your property to the world's most discerning travellers.</h3>
          <p className="mt-4 text-white/85 text-[16px]">Video-first listings, a verified premium badge and direct guest inquiries — with zero commission on your bookings.</p>
          <Link to="/become-a-host" className="inline-flex mt-7 bg-white text-ink font-semibold px-6 py-3.5 rounded-lg hover:bg-ink-bg">List your property</Link>
        </div>
      </div>
    </section>
  )
}

const byCat = (c) => listings.filter((l) => l.category === c)
const inCountry = (c) => listings.filter((l) => l.country === c)

export default function Home() {
  const [params] = useSearchParams()
  const tab = params.get('tab') || 'all'

  return (
    <div className="min-h-screen">
      <Navbar variant="home" />
      <main className={`${W} pt-4`}>
        {tab === 'all' && (
          <>
            <DestinationRow />
            <FeaturedPartner />
            <Row title="Popular safari lodges & camps" to="/search?type=safari">{byCat('safari').concat(byCat('unique')).map((l) => <ListingCard key={l.id} l={l} />)}</Row>
            <ServicesGrid />
            <Row title="Beach escapes on the Indian Ocean" to="/search?where=Zanzibar">{byCat('beach').concat(byCat('mountain'), byCat('safari')).map((l) => <ListingCard key={l.id} l={l} />)}</Row>
            <Row title="Unforgettable experiences" subtitle="Hosted by Africa's most passionate guides" to="/?tab=experiences">{experiences.map((e) => <ExperienceCard key={e.id} e={e} />)}</Row>
            <PartnerBanner />
          </>
        )}

        {tab === 'homes' && (
          <>
            <DestinationRow />
            <Row title="Popular stays in Kenya" to="/search?where=Kenya">{inCountry('Kenya').concat(inCountry('Tanzania')).map((l) => <ListingCard key={l.id} l={l} />)}</Row>
            <Row title="Great lodges for your next safari" subtitle="Plus, enjoy guest-favourite perks when you book direct." to="/search">{[...new Set(listings.filter((l) => l.guestFavorite).concat(byCat('safari')))].map((l) => <ListingCard key={l.id} l={l} />)}</Row>
            <Row title="Available next month in Zanzibar & the coast" to="/search?where=Zanzibar">{[...new Set(byCat('beach').concat(listings))].slice(0, 10).map((l) => <ListingCard key={l.id} l={l} />)}</Row>
            <Row title="Unique stays with unique features" subtitle="Star beds, treehouses, crater-edge villas and more" to="/search?type=unique">{byCat('unique').concat(byCat('mountain')).map((l) => <ListingCard key={l.id} l={l} />)}</Row>
          </>
        )}

        {tab === 'experiences' && (
          <>
            <Row title="Tomorrow in Nairobi" to="/search?where=Nairobi">{experiences.map((e) => <ExperienceCard key={e.id} e={{ ...e, badge: null }} />)}</Row>
            <Row title="Book and Stay Originals" subtitle="Hosted by Africa's most interesting people">{[...experiences].reverse().map((e) => <ExperienceCard key={e.id} e={{ ...e, badge: 'Original' }} />)}</Row>
            <Row title="Experiences in the Masai Mara" to="/search?where=Masai%20Mara">{experiences.map((e) => <ExperienceCard key={e.id} e={{ ...e, badge: 'Trending' }} />)}</Row>
          </>
        )}

        {tab === 'services' && (
          <>
            <Row title="Services in Nairobi">{services.map((s) => <ExperienceCard key={s.id} e={s} kind="service" />)}</Row>
            <ServicesGrid />
            <Row title="Lodge services across East Africa">{[...services].reverse().map((s) => <ExperienceCard key={s.id} e={s} kind="service" />)}</Row>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
