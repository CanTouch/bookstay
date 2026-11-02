import { useState } from 'react'
import { Check, Film, BadgeCheck, Send, Percent, Globe2, BarChart3, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VideoTour from '../components/VideoTour'
import { Img } from '../components/ui'
import { useApp } from '../context/AppContext'
import { listings } from '../data/listings'
import { cx } from '../lib/utils'

const PLANS = [
  {
    name: 'Featured',
    monthlyPrice: 'UGX 10,000',
    annualPrice: 'UGX 100,000',
    annualSavings: 'Save UGX 20,000 / yr',
    desc: 'Get discovered by premium travellers across Africa.',
    items: [
      'Listing with up to 20 photos',
      '1 cinematic video tour',
      'Direct guest inquiries to your inbox & WhatsApp',
      'Appear in destination search & interactive map',
      'Basic inquiry analytics dashboard',
    ],
  },
  {
    name: 'Premium',
    monthlyPrice: 'UGX 30,000',
    annualPrice: 'UGX 330,000',
    annualSavings: 'Save UGX 30,000 / yr',
    desc: 'Our most popular plan for lodges, safari camps & luxury villas.',
    popular: true,
    items: [
      'Everything in Featured',
      'Verified Premium Partner badge',
      'Unlimited photos & 5 video tours',
      'Homepage featured carousel placement',
      'Experiences & safari services add-ons',
      'Priority partner support',
    ],
  },
  {
    name: 'Signature',
    monthlyPrice: 'Custom',
    annualPrice: 'Custom',
    annualSavings: null,
    desc: 'For iconic luxury safari reserves, collections & private islands.',
    items: [
      'Everything in Premium',
      'Homepage hero video spotlight placement',
      'Professional drone & photography shoot assistance',
      'Multi-property collection showcase page',
      'Dedicated partner relationship manager',
      'Featured in newsletters & social media campaigns',
    ],
  },
]

const FAQ = [
  ['Do you charge commission on bookings?', 'No. Partners pay a flat premium listing fee. Every guest inquiry goes directly to your reservations team and you keep 100% of your booking revenue.'],
  ['How do guests contact my property?', 'Guests send a structured inquiry (dates, party size, special requests, contact details) through Book and Stay. It is delivered straight to your reservations team to reply and confirm directly.'],
  ['Can I showcase videos?', 'Yes — every listing supports cinematic video tours alongside your photo gallery. Signature partners also get a homepage video spotlight.'],
  ['Which properties qualify?', 'Premium lodges, safari camps, boutique hotels, beach & bush villas and unique stays across East Africa and the rest of the continent. Every property is reviewed before going live.'],
]

export default function HostPage() {
  const { showToast } = useApp()
  const [sent, setSent] = useState(false)
  const [faq, setFaq] = useState(0)
  const [cycle, setCycle] = useState('monthly') // 'monthly' | 'annual'
  const hero = listings[0]

  return (
    <div className="min-h-screen">
      <Navbar variant="host" />
      <main>
        {/* Hero */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 pt-12 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-ink-bg rounded-full px-3 py-1.5 text-[13px] font-semibold"><BadgeCheck size={15} className="text-brand" /> For premium lodges, camps &amp; unique stays</div>
            <h1 className="text-[40px] md:text-[56px] font-bold leading-[1.05] tracking-tight mt-5">Feature your property on <span className="text-brand">Book and Stay</span></h1>
            <p className="text-[18px] text-ink-soft mt-5 max-w-lg">Reach high-value travellers looking for Africa's finest safari lodges, beach villas and one-of-a-kind stays. One flat fee. Zero commission. Direct inquiries.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#apply" className="btn-brand px-7 py-4 text-[16px]">Apply to list</a>
              <a href="#pricing" className="border border-ink rounded-lg px-7 py-4 font-semibold hover:bg-ink-bg">See plans</a>
            </div>
            <div className="flex gap-10 mt-10">
              {[['0%', 'Commission'], ['100%', 'Direct inquiries'], ['24h', 'Avg. go-live']].map(([a, b]) => <div key={b}><div className="text-[28px] font-bold">{a}</div><div className="text-sm text-ink-soft">{b}</div></div>)}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-float">
            <VideoTour images={hero.images} title={hero.title} className="aspect-[4/3.4]" />
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-ink-bg py-16">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <h2 className="text-[32px] font-bold tracking-tight text-center">Why properties choose Book and Stay</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {[
                { i: Film, t: 'Video-first listings', d: 'Cinematic video tours and unlimited galleries that sell the experience, not just the room.' },
                { i: Percent, t: 'Zero commission', d: 'A flat premium listing fee. Keep 100% of every booking you confirm.' },
                { i: Send, t: 'Direct inquiries', d: 'Guests send detailed requests straight to your reservations team — you own the relationship.' },
                { i: Globe2, t: 'Premium audience', d: 'Curated for travellers seeking luxury safari, beach and unique stays across Africa.' },
              ].map(({ i: I, t, d }) => (
                <div key={t} className="bg-white rounded-2xl p-7 shadow-pill">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center"><I size={22} /></div>
                  <div className="font-semibold text-[18px] mt-5">{t}</div>
                  <p className="text-ink-soft text-[15px] mt-2">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-16">
          <h2 className="text-[32px] font-bold tracking-tight">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              ['1', 'Apply & choose a plan', 'Tell us about your property and pick the plan that suits you.'],
              ['2', 'We build your showcase', 'Upload photos & videos — or let our team produce them for you.'],
              ['3', 'Receive direct inquiries', 'Guests contact your reservations team directly. You confirm and get paid your way.'],
            ].map(([n, t, d]) => (
              <div key={n} className="flex gap-5">
                <div className="text-[56px] font-bold text-brand/25 leading-none">{n}</div>
                <div><div className="font-semibold text-[18px]">{t}</div><p className="text-ink-soft mt-1">{d}</p></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            {listings.slice(2, 6).map((l) => <Img key={l.id} src={l.images[0]} alt={l.title} seed={l.id} className="aspect-[4/5] w-full rounded-2xl" />)}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-ink-bg py-16 scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <h2 className="text-[32px] font-bold tracking-tight text-center">Simple, flat partner plans</h2>
            <p className="text-center text-ink-soft mt-2">Zero commission on bookings. Flat listing fee in UGX. Cancel anytime.</p>

            {/* Billing cycle toggle */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <div className="inline-flex p-1 rounded-full bg-white border border-ink-line shadow-sm">
                <button
                  type="button"
                  onClick={() => setCycle('monthly')}
                  className={cx(
                    'px-5 py-2 rounded-full font-semibold text-sm transition',
                    cycle === 'monthly' ? 'bg-ink text-white shadow-sm' : 'text-ink-soft hover:text-ink',
                  )}
                >
                  Monthly billing
                </button>
                <button
                  type="button"
                  onClick={() => setCycle('annual')}
                  className={cx(
                    'px-5 py-2 rounded-full font-semibold text-sm transition flex items-center gap-2',
                    cycle === 'annual' ? 'bg-ink text-white shadow-sm' : 'text-ink-soft hover:text-ink',
                  )}
                >
                  <span>Annual billing</span>
                  <span className={cx(
                    'text-[11px] font-bold px-2 py-0.5 rounded-full',
                    cycle === 'annual' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800',
                  )}>
                    Save up to 17%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mt-10">
              {PLANS.map((p) => {
                const isCustom = p.monthlyPrice === 'Custom'
                const displayPrice = cycle === 'monthly' ? p.monthlyPrice : p.annualPrice
                const perLabel = isCustom ? '' : cycle === 'monthly' ? '/ month' : '/ year'
                return (
                  <div key={p.name} className={cx('bg-white rounded-3xl p-8 relative flex flex-col', p.popular ? 'ring-2 ring-brand shadow-float' : 'shadow-pill')}>
                    {p.popular && <span className="absolute -top-3 left-8 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">Most popular</span>}
                    <div className="font-semibold text-[20px]">{p.name}</div>
                    <p className="text-ink-soft text-sm mt-1">{p.desc}</p>
                    <div className="mt-6">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[34px] font-bold tracking-tight">{displayPrice}</span>
                        {perLabel && <span className="text-ink-soft text-sm font-medium">{perLabel}</span>}
                      </div>
                      {!isCustom && (
                        <div className="text-xs text-ink-soft mt-1.5">
                          {cycle === 'monthly' ? (
                            <span>or <span className="font-semibold text-ink">{p.annualPrice}</span> / year ({p.annualSavings})</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">{p.annualSavings} (billed yearly)</span>
                          )}
                        </div>
                      )}
                    </div>
                    <a href="#apply" className={cx('block text-center mt-6 py-3.5 rounded-lg font-semibold transition', p.popular ? 'btn-brand' : 'border border-ink hover:bg-ink-bg')}>
                      {isCustom ? 'Talk to us' : `Choose ${p.name}`}
                    </a>
                    <ul className="mt-7 space-y-3 text-[15px] flex-1">
                      {p.items.map((it) => (
                        <li key={it} className="flex gap-3">
                          <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 py-16 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[32px] font-bold tracking-tight">See every inquiry, in one place</h2>
            <p className="text-ink-soft mt-3 text-[17px]">Your partner dashboard shows views, video plays and inquiries — so you can see the value of your listing at a glance.</p>
          </div>
          <div className="rounded-3xl border border-ink-line/70 shadow-card p-6">
            <div className="flex items-center gap-2 font-semibold"><BarChart3 size={18} /> Last 30 days · Mara Ridge</div>
            <div className="grid grid-cols-3 gap-4 mt-5">
              {[['12,480', 'Listing views'], ['3,105', 'Video plays'], ['186', 'Direct inquiries']].map(([a, b]) => <div key={b} className="bg-ink-bg rounded-xl p-4"><div className="text-[22px] font-bold">{a}</div><div className="text-xs text-ink-soft">{b}</div></div>)}
            </div>
            <div className="flex items-end gap-1.5 h-32 mt-6">
              {[30, 45, 38, 60, 52, 70, 64, 80, 74, 92, 85, 100].map((h, i) => <div key={i} className="flex-1 bg-brand/80 rounded-t" style={{ height: `${h}%` }} />)}
            </div>
          </div>
        </section>

        {/* FAQ + Apply */}
        <section className="max-w-[1280px] mx-auto px-6 md:px-10 pb-16 grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-[32px] font-bold tracking-tight mb-6">Questions partners ask</h2>
            {FAQ.map(([q, a], i) => (
              <div key={q} className="border-b border-ink-line/70">
                <button onClick={() => setFaq(faq === i ? -1 : i)} className="w-full flex justify-between items-center py-5 text-left font-semibold text-[17px]">{q}<ChevronDown className={cx('transition', faq === i && 'rotate-180')} size={18} /></button>
                {faq === i && <p className="pb-5 text-ink-soft fade-in">{a}</p>}
              </div>
            ))}
          </div>
          <div id="apply" className="rounded-3xl shadow-float p-8 scroll-mt-24">
            {sent ? (
              <div className="text-center py-10 fade-up">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center"><Check size={30} className="text-emerald-600" strokeWidth={3} /></div>
                <h3 className="text-[24px] font-bold mt-5">Application received</h3>
                <p className="text-ink-soft mt-2">Our partnerships team will be in touch within one business day.</p>
                <button onClick={() => setSent(false)} className="mt-6 underline font-semibold">Submit another property</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); showToast('Application sent') }} className="space-y-4">
                <h3 className="text-[24px] font-bold">Apply to list your property</h3>
                {[['Property name', 'e.g. Mara Ridge Camp'], ['Contact name', 'Your name'], ['Email', 'reservations@yourlodge.com'], ['Location', 'e.g. Masai Mara, Kenya']].map(([lab, ph]) => (
                  <label key={lab} className="block border border-ink-line rounded-lg px-3 pt-2 pb-1.5 focus-within:border-ink">
                    <span className="block text-[11px] font-semibold uppercase text-ink-soft">{lab}</span>
                    <input required placeholder={ph} type={lab === 'Email' ? 'email' : 'text'} className="w-full outline-none text-[15px] py-0.5" />
                  </label>
                ))}
                <label className="block border border-ink-line rounded-lg px-3 pt-2 pb-1.5">
                  <span className="block text-[11px] font-semibold uppercase text-ink-soft">Property type</span>
                  <select className="w-full outline-none text-[15px] py-0.5 bg-transparent">{['Safari lodge', 'Tented camp', 'Beach villa', 'Boutique hotel', 'Unique stay', 'Mountain / vineyard retreat'].map((t) => <option key={t}>{t}</option>)}</select>
                </label>
                <label className="block border border-ink-line rounded-lg px-3 pt-2 pb-1.5">
                  <span className="block text-[11px] font-semibold uppercase text-ink-soft">Plan</span>
                  <select className="w-full outline-none text-[15px] py-0.5 bg-transparent">
                    <option value="Featured">Featured — UGX 10,000 / mo (or UGX 100,000 / yr)</option>
                    <option value="Premium">Premium — UGX 30,000 / mo (or UGX 330,000 / yr)</option>
                    <option value="Signature">Signature — Custom (Iconic properties & collections)</option>
                  </select>
                </label>
                <button className="btn-brand w-full py-4 text-[16px]">Submit application</button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer inspirationOn={false} />
    </div>
  )
}
