import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export const emptyGuests = { adults: 0, children: 0, infants: 0, pets: 0 }

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => new Set())
  const [search, setSearch] = useState({ where: '', checkIn: null, checkOut: null, guests: emptyGuests })
  // modal: null | { type: 'login' } | { type: 'inquiry', listing, checkIn, checkOut, guests } | { type: 'commitment' }
  const [modal, setModal] = useState(null)
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState(null)

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); showToast('Removed from wishlist') }
      else { next.add(id); showToast('Saved to wishlist') }
      return next
    })
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    clearTimeout(window.__bsToast)
    window.__bsToast = setTimeout(() => setToast(null), 2200)
  }

  return (
    <AppContext.Provider value={{ favorites, toggleFavorite, search, setSearch, modal, setModal, user, setUser, toast, showToast }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
