import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Globe, ChevronDown, Facebook, Instagram } from 'lucide-react'
import { inspiration } from '../data/listings'
import { useApp } from '../context/AppContext'
import { cx } from '../lib/utils'

const X = () => (<svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" /></svg>)

export default function Footer({ inspirationOn = true, maxW = 'max-w-[1760px]' }) {
  const tabs = Object.keys(inspiration)
  const [tab, setTab] = useState(tabs[0])
  const [more, setMore] = useState(false)
  const { showToast } = useApp()
  const items = inspiration[tab]
  const shown = more ? items : items.slice(0, 11)

  const cols = [
    { h: 'Support', l: ['Help Center', 'Get help with a safety issue', 'Travel insurance', 'Safari health & visas', 'Anti-discrimination', 'Disability support', 'Cancellation options', 'Report a listing concern'] },
    { h: 'Partners & Lodges', l: ['List your property', 'List your experience', 'List your service', 'Partner plans & pricing', 'Verified Premium badge', 'Partner resources', 'Community forum', 'Responsible tourism', 'Refer a property'] },
    { h: 'Book and Stay', l: ['About us', 'Newsroom', 'Careers', 'Investors', 'Gift cards', 'Conservation pledge'] },
  ]

  return (
    <footer className="bg-ink-bg border-t border-ink-line/70 mt-12">
      <div className={cx('mx-auto px-6 md:px-10', maxW)}>
        {inspirationOn && (
          <div className="pt-12 pb-8 border-b border-ink-line/70">
            <h2 className="text-[22px] font-semibold mb-3 tracking-tight">Inspiration for future getaways</h2>
            <div className="flex gap-6 overflow-x-auto no-scrollbar border-b border-ink-line/70">
              {tabs.map((t) => (
                <button key={t} onClick={() => { setTab(t); setMore(false) }} className={cx('pb-3 text-sm whitespace-nowrap border-b-2 -mb-px', tab === t ? 'border-ink font-semibold' : 'border-transparent text-ink-soft hover:text-ink')}>{t}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-5 gap-x-4 pt-7">
              {shown.map(([a, b]) => (
                <Link key={a + b} to={`/search?where=${encodeURIComponent(a)}`} className="text-sm group">
                  <div className="font-semibold group-hover:underline">{a}</div>
                  <div className="text-ink-soft">{b}</div>
                </Link>
              ))}
              {items.length > 11 && !more && (
                <button onClick={() => setMore(true)} className="text-sm font-semibold flex items-center gap-1 self-start">Show more <ChevronDown size={14} /></button>
              )}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 py-12 border-b border-ink-line/70">
          {cols.map((c) => (
            <div key={c.h}>
              <div className="font-semibold text-sm mb-4">{c.h}</div>
              <ul className="space-y-3.5">
                {c.l.map((x) => (
                  <li key={x}>
                    {x.startsWith('List your') || x.startsWith('Partner') || x.startsWith('Refer') || x.startsWith('Verified')
                      ? <Link to="/become-a-host" className="text-sm hover:underline">{x}</Link>
                      : <button onClick={() => showToast(`${x} — placeholder page`)} className="text-sm hover:underline text-left">{x}</button>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 flex flex-col md:flex-row gap-4 md:items-center justify-between text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© 2026 Book and Stay, Ltd.</span><span>·</span>
            <a className="hover:underline cursor-pointer">Privacy</a><span>·</span>
            <a className="hover:underline cursor-pointer">Terms</a><span>·</span>
            <a className="hover:underline cursor-pointer">Sitemap</a><span>·</span>
            <a className="hover:underline cursor-pointer flex items-center gap-1">Your Privacy Choices
              <svg width="26" height="12" viewBox="0 0 26 12"><rect width="26" height="12" rx="6" fill="#0066FF" /><circle cx="19.5" cy="6" r="4" fill="#fff" /><path d="M5 6l2 2 3-4" stroke="#fff" strokeWidth="1.5" fill="none" /></svg>
            </a>
          </div>
          <div className="flex items-center gap-5 font-semibold">
            <span className="flex items-center gap-2"><Globe size={16} /> English (US)</span>
            <span>$ USD</span>
            <Facebook size={18} className="fill-ink" strokeWidth={0} />
            <X />
            <Instagram size={18} />
          </div>
        </div>
      </div>
    </footer>
  )
}
