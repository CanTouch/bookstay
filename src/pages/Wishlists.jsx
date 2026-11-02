import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ListingCard } from '../components/Cards'
import { useApp } from '../context/AppContext'
import { listings } from '../data/listings'

export default function Wishlists() {
  const { favorites } = useApp()
  const saved = listings.filter((l) => favorites.has(l.id))
  return (
    <div className="min-h-screen">
      <Navbar variant="listing" />
      <main className="max-w-[1760px] mx-auto px-6 md:px-10 py-10 min-h-[50vh]">
        <h1 className="text-[32px] font-semibold tracking-tight mb-8">Wishlists</h1>
        {saved.length === 0 ? (
          <div>
            <div className="text-[22px] font-semibold">Create your first wishlist</div>
            <p className="text-ink-soft mt-2">As you search, tap the heart icon to save your favourite lodges and experiences.</p>
            <Link to="/" className="inline-block mt-6 bg-ink text-white font-semibold px-6 py-3 rounded-lg">Start exploring</Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">{saved.map((l) => <ListingCard key={l.id} l={l} />)}</div>
        )}
      </main>
      <Footer inspirationOn={false} />
    </div>
  )
}
