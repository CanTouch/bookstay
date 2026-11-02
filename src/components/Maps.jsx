import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Img } from './ui'
import { fmtPrice } from '../lib/utils'

const TILE = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const ATTR = '&copy; OpenStreetMap &copy; CARTO'

const pricePin = (label, active) => L.divIcon({
  className: 'pin-wrap',
  html: `<span class="price-pin ${active ? 'active' : ''}">${label}</span>`,
  iconSize: [0, 0],
})
const homePin = L.divIcon({
  className: 'pin-wrap',
  html: `<div class="home-pin"><svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 3 2 12h3v8h5v-6h4v6h5v-8h3z"/></svg></div>`,
  iconSize: [0, 0],
})

function FitBounds({ points }) {
  const map = useMap()
  useEffect(() => {
    if (!points.length) return
    if (points.length === 1) map.setView(points[0], 8)
    else map.fitBounds(points, { padding: [50, 50] })
  }, [JSON.stringify(points)])
  return null
}

/** Search-results map with floating price pills. */
export function PriceMap({ listings, activeId, setActiveId, nights = 2 }) {
  const pts = listings.map((l) => [l.lat, l.lng])
  return (
    <MapContainer center={[-2, 35]} zoom={5} scrollWheelZoom className="w-full h-full rounded-2xl" zoomControl>
      <TileLayer url={TILE} attribution={ATTR} />
      <FitBounds points={pts} />
      {listings.map((l) => (
        <Marker
          key={l.id}
          position={[l.lat, l.lng]}
          icon={pricePin(fmtPrice(l.price * nights), activeId === l.id)}
          zIndexOffset={activeId === l.id ? 1000 : 0}
          eventHandlers={{ mouseover: () => setActiveId?.(l.id), mouseout: () => setActiveId?.(null) }}
        >
          <Popup closeButton={false} offset={[0, -8]}>
            <Link to={`/rooms/${l.id}`} className="block w-[240px] -m-[13px] -mx-[20px] text-ink no-underline">
              <Img src={l.images[0]} alt={l.title} seed={l.id} className="w-full h-40 rounded-t-xl" />
              <div className="p-3">
                <div className="flex justify-between text-[14px] font-semibold"><span className="truncate">{l.type} in {l.city}</span><span className="flex items-center gap-1 shrink-0"><Star size={11} className="fill-ink" />{l.rating}</span></div>
                <div className="text-ink-soft text-[13px] truncate">{l.title}</div>
                <div className="text-[13px] mt-1"><span className="font-semibold underline">{fmtPrice(l.price * nights)}</span> for {nights} nights</div>
              </div>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

/** Single-property "Where you'll be" map. */
export function LocationMap({ lat, lng }) {
  return (
    <MapContainer center={[lat, lng]} zoom={11} scrollWheelZoom={false} className="w-full h-full rounded-2xl">
      <TileLayer url={TILE} attribution={ATTR} />
      <Marker position={[lat, lng]} icon={homePin} />
    </MapContainer>
  )
}
