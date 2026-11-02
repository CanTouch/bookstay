import { useState } from 'react'
import {
  Utensils, Wifi, Car, Waves, Sun, Binoculars, Wine, Flame, ShieldCheck, Plane, Sparkles, Baby,
  Shirt, Coffee, Tv, Sailboat, Star, Home,
} from 'lucide-react'

/** Image with graceful fallback to a seeded placeholder so the demo never shows broken images. */
export function Img({ src, alt = '', className = '', seed, ...rest }) {
  const [err, setErr] = useState(false)
  const fallback = `https://picsum.photos/seed/${encodeURIComponent(seed || alt || 'bookstay')}/900/700`
  return (
    <img
      src={err ? fallback : src}
      alt={alt}
      loading="lazy"
      onError={() => !err && setErr(true)}
      className={`object-cover ${className}`}
      {...rest}
    />
  )
}

const ICONS = { Utensils, Wifi, Car, Waves, Sun, Binoculars, Wine, Flame, ShieldCheck, Plane, Sparkles, Baby, Shirt, Coffee, Tv, Sailboat, Star, Home }
export function Icon({ name, ...p }) {
  const C = ICONS[name] || Star
  return <C {...p} />
}

/** Book and Stay wordmark — styled to sit where the Airbnb logo sits. */
export function Logo({ compact = false }) {
  return (
    <span className="flex items-center gap-1.5 text-brand select-none">
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M4 26 L16 5 L28 26 Z" />
        <path d="M12 26 L16 18 L20 26" />
        <circle cx="16" cy="12.5" r="0.6" fill="currentColor" />
      </svg>
      {!compact && <span className="text-[21px] font-extrabold tracking-tight leading-none">book<span className="font-medium">&amp;</span>stay</span>}
    </span>
  )
}

export function Avatar({ name, src, size = 40, className = '' }) {
  if (src) return <Img src={src} alt={name} seed={name} className={`rounded-full ${className}`} style={{ width: size, height: size }} />
  const colors = ['bg-orange-100 text-orange-800', 'bg-violet-100 text-violet-700', 'bg-emerald-100 text-emerald-800', 'bg-sky-100 text-sky-800']
  const c = colors[(name?.charCodeAt(0) || 0) % colors.length]
  return (
    <div className={`rounded-full flex items-center justify-center font-semibold ${c} ${className}`} style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {name?.[0]}
    </div>
  )
}
