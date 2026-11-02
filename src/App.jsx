import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import SearchPage from './pages/Search'
import ListingPage from './pages/Listing'
import HostPage from './pages/Host'
import ExperiencePage from './pages/Experience'
import Wishlists from './pages/Wishlists'
import Modals from './components/Modals'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/rooms/:id" element={<ListingPage />} />
        <Route path="/experiences/:id" element={<ExperiencePage kind="experience" />} />
        <Route path="/services/:id" element={<ExperiencePage kind="service" />} />
        <Route path="/become-a-host" element={<HostPage />} />
        <Route path="/wishlists" element={<Wishlists />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Modals />
    </>
  )
}
