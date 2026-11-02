import { useEffect, useState } from 'react'
import { X, ArrowLeft, Check, Star, ShieldCheck, Send, Mail, Phone, Clock, BadgeCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Img, Logo } from './ui'
import { fmtPrice, fmtLong, nightsBetween, guestLabel, cx } from '../lib/utils'

export function ModalShell({ onClose, children, width = 'max-w-[568px]', className = '' }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center sm:p-6 fade-in" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={cx('bg-white w-full rounded-t-3xl sm:rounded-3xl shadow-float max-h-[92vh] overflow-y-auto fade-up', width, className)}>
        {children}
      </div>
    </div>
  )
}

const Field = ({ label, children }) => (
  <label className="block border border-ink-line rounded-lg px-3 pt-2 pb-1.5 focus-within:border-ink focus-within:ring-1 focus-within:ring-ink transition">
    <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-soft">{label}</span>
    {children}
  </label>
)
const inputCls = 'w-full outline-none text-[15px] bg-transparent py-0.5'

/* ------------------------------ Login ------------------------------ */
function LoginModal({ onClose }) {
  const { setUser, showToast } = useApp()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const submit = (e) => {
    e.preventDefault()
    setUser({ name: name || email.split('@')[0] || 'Guest', email })
    showToast('Welcome to Book and Stay!')
    onClose()
  }
  return (
    <ModalShell onClose={onClose}>
      <div className="flex items-center justify-between px-6 h-16 border-b border-ink-line/70">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-ink-bg"><X size={18} /></button>
        <div className="font-bold">Log in or sign up</div>
        <div className="w-8" />
      </div>
      <form onSubmit={submit} className="p-6 space-y-4">
        <h3 className="text-[22px] font-semibold">Welcome to Book and Stay</h3>
        <div className="space-y-3">
          <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Jane Doe" /></Field>
          <Field label="Email"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" /></Field>
        </div>
        <p className="text-xs text-ink-soft">We'll email you to confirm. This is a demo — no account is actually created.</p>
        <button className="btn-brand w-full py-3.5">Continue</button>
        <div className="flex items-center gap-3 text-xs text-ink-soft"><div className="flex-1 h-px bg-ink-line" />or<div className="flex-1 h-px bg-ink-line" /></div>
        {['Continue with Google', 'Continue with Apple', 'Continue with phone'].map((t) => (
          <button type="button" key={t} onClick={() => { setUser({ name: 'Demo Guest', email: 'guest@demo.com' }); onClose() }} className="w-full border border-ink rounded-lg py-3 font-semibold text-sm hover:bg-ink-bg">{t}</button>
        ))}
      </form>
    </ModalShell>
  )
}

/* ------------------------------ Inquiry flow (Option B) ------------------------------ */
function Commitment({ onAgree, onBack }) {
  return (
    <div className="p-8 pt-6 text-center">
      <div className="text-left"><button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-ink-bg"><ArrowLeft size={20} /></button></div>
      <div className="flex justify-center mt-2 mb-4"><Logo compact /></div>
      <h3 className="text-[30px] font-bold tracking-tight leading-tight">Everyone belongs here</h3>
      <p className="mt-6 text-[17px] leading-relaxed">
        When you join Book and Stay, we ask you to agree to our <span className="underline font-semibold">Community Commitment</span>:
      </p>
      <p className="mt-4 text-[17px] leading-relaxed">
        I will treat everyone in the community—regardless of their race, religion, national origin, ethnicity, skin color, disability, sex, gender identity, sexual orientation, or age—with respect, and without judgment or bias.
      </p>
      <button onClick={onAgree} className="btn-brand w-full py-4 mt-8 text-[17px]">Agree and continue</button>
      <button onClick={onBack} className="w-full py-4 mt-2 font-semibold text-[17px] hover:bg-ink-bg rounded-lg">Decline</button>
    </div>
  )
}

function InquiryForm({ data, onSubmit, onClose }) {
  const { listing: l, checkIn, checkOut, guests } = data
  const { user } = useApp()
  const nights = nightsBetween(checkIn, checkOut) || 2
  const [f, setF] = useState({
    name: user?.name || '', email: user?.email || '', code: '+254', phone: '', country: 'Kenya',
    msg: `Hello ${l.title} team, we'd love to stay with you. Could you confirm availability and your best rate for our dates?`,
    tags: [],
  })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const toggle = (t) => setF((x) => ({ ...x, tags: x.tags.includes(t) ? x.tags.filter((y) => y !== t) : [...x.tags, t] }))
  const tags = ['Honeymoon / celebration', 'Airport or airstrip transfer', 'Dietary requirements', 'Private game drive', 'Travelling with children']

  return (
    <div>
      <div className="flex items-center justify-between px-6 h-16 border-b border-ink-line/70 sticky top-0 bg-white z-10">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-ink-bg"><X size={18} /></button>
        <div className="font-bold">Request to book</div>
        <div className="w-8" />
      </div>
      <div className="grid md:grid-cols-[1fr_300px] gap-8 p-6">
        <form id="inq" onSubmit={(e) => { e.preventDefault(); onSubmit(f) }} className="space-y-5 order-2 md:order-1">
          <div>
            <h3 className="text-[22px] font-semibold">Send your inquiry directly to the lodge</h3>
            <p className="text-sm text-ink-soft mt-1">Your request goes straight to the {l.host.name}. They'll reply to you personally with availability and rates.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Full name"><input required value={f.name} onChange={set('name')} className={inputCls} placeholder="Jane Doe" /></Field>
            <Field label="Email"><input required type="email" value={f.email} onChange={set('email')} className={inputCls} placeholder="you@example.com" /></Field>
            <Field label="Phone / WhatsApp">
              <div className="flex gap-2">
                <select value={f.code} onChange={set('code')} className="outline-none bg-transparent text-[15px]">
                  {['+254', '+255', '+256', '+250', '+27', '+44', '+1', '+49', '+971'].map((c) => <option key={c}>{c}</option>)}
                </select>
                <input required value={f.phone} onChange={set('phone')} className={inputCls} placeholder="712 345 678" />
              </div>
            </Field>
            <Field label="Country of residence">
              <select value={f.country} onChange={set('country')} className={inputCls}>
                {['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'South Africa', 'Nigeria', 'United Kingdom', 'United States', 'Germany', 'UAE', 'Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Anything the lodge should know?</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((t) => (
                <button type="button" key={t} onClick={() => toggle(t)} className={cx('text-[13px] rounded-full px-3.5 py-1.5 border transition', f.tags.includes(t) ? 'bg-ink text-white border-ink' : 'border-ink-line hover:border-ink')}>
                  {f.tags.includes(t) && <Check size={12} className="inline mr-1 -mt-0.5" />}{t}
                </button>
              ))}
            </div>
            <textarea rows={4} value={f.msg} onChange={set('msg')} className="w-full border border-ink-line rounded-lg p-3 text-[15px] outline-none focus:border-ink focus:ring-1 focus:ring-ink" />
          </div>
          <div className="flex gap-3 p-4 rounded-xl bg-ink-bg text-[13px] leading-relaxed">
            <ShieldCheck className="shrink-0 text-brand" size={22} />
            <span>Book and Stay doesn't take a booking commission and doesn't handle your payment. You'll confirm and pay directly with the property once they reply.</span>
          </div>
          <button form="inq" className="btn-brand w-full py-3.5 text-[16px] flex items-center justify-center gap-2"><Send size={16} /> Send inquiry to lodge</button>
          <p className="text-center text-sm">You won't be charged yet</p>
        </form>

        <aside className="order-1 md:order-2">
          <div className="border border-ink-line rounded-2xl p-5 md:sticky md:top-20">
            <div className="flex gap-3 pb-4 border-b border-ink-line/70">
              <Img src={l.images[0]} alt={l.title} seed={l.id} className="w-24 h-20 rounded-xl" />
              <div className="min-w-0">
                <div className="font-semibold text-[15px] leading-tight">{l.title}</div>
                <div className="text-xs text-ink-soft mt-0.5">{l.type}</div>
                <div className="text-xs mt-1 flex items-center gap-1"><Star size={11} className="fill-ink" /> {l.rating} ({l.reviewsCount})</div>
              </div>
            </div>
            <div className="py-4 border-b border-ink-line/70 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-soft">Dates</span><span className="font-medium">{fmtLong(checkIn)} – {fmtLong(checkOut)}</span></div>
              <div className="flex justify-between"><span className="text-ink-soft">Guests</span><span className="font-medium">{guestLabel(guests) || '1 guest'}</span></div>
            </div>
            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="underline">{fmtPrice(l.price)} x {nights} nights</span><span>{fmtPrice(l.price * nights)}</span></div>
              <div className="flex justify-between font-semibold pt-2 border-t border-ink-line/70"><span>Estimated total</span><span>{fmtPrice(l.price * nights)}</span></div>
              <p className="text-xs text-ink-soft">Final rate is confirmed by the property.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function InquirySuccess({ data, form, onClose }) {
  const { listing: l, checkIn, checkOut } = data
  const [ref] = useState(() => `BS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`)
  return (
    <div className="p-8 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-5"><Check size={32} className="text-emerald-600" strokeWidth={3} /></div>
      <h3 className="text-[26px] font-bold tracking-tight">Inquiry sent to {l.title}</h3>
      <p className="text-ink-soft mt-2">Reference <span className="font-semibold text-ink">{ref}</span> · {fmtLong(checkIn)} – {fmtLong(checkOut)}</p>
      <div className="text-left mt-8 space-y-4">
        {[
          { i: Send, t: 'Delivered to the reservations team', d: `Your request went directly to ${l.host.name}.` },
          { i: Clock, t: 'Expect a reply within 24 hours', d: `They'll contact you at ${form.email}${form.phone ? ` or on WhatsApp ${form.code} ${form.phone}` : ''}.` },
          { i: BadgeCheck, t: 'Confirm & pay directly with the lodge', d: 'No middleman, no booking fees from Book and Stay.' },
        ].map(({ i: I, t, d }) => (
          <div key={t} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-ink-bg flex items-center justify-center shrink-0"><I size={18} /></div>
            <div><div className="font-semibold">{t}</div><div className="text-sm text-ink-soft">{d}</div></div>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="mt-8 w-full py-3.5 rounded-lg bg-ink text-white font-semibold hover:bg-black">Continue exploring</button>
    </div>
  )
}

function InquiryFlow({ data, onClose }) {
  const [agreed, setAgreed] = useState(() => sessionStorage.getItem('bs_commit') === '1')
  const [step, setStep] = useState(agreed ? 'form' : 'commit')
  const [form, setForm] = useState(null)
  return (
    <ModalShell onClose={onClose} width={step === 'form' ? 'max-w-[920px]' : 'max-w-[568px]'}>
      {step === 'commit' && <Commitment onBack={onClose} onAgree={() => { sessionStorage.setItem('bs_commit', '1'); setAgreed(true); setStep('form') }} />}
      {step === 'form' && <InquiryForm data={data} onClose={onClose} onSubmit={(f) => { setForm(f); setStep('done') }} />}
      {step === 'done' && <InquirySuccess data={data} form={form} onClose={onClose} />}
    </ModalShell>
  )
}

/* ------------------------------ Root ------------------------------ */
export default function Modals() {
  const { modal, setModal, toast } = useApp()
  const close = () => setModal(null)
  return (
    <>
      {modal?.type === 'login' && <LoginModal onClose={close} />}
      {modal?.type === 'inquiry' && <InquiryFlow data={modal} onClose={close} />}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] bg-ink text-white text-sm font-medium px-5 py-3 rounded-xl shadow-float fade-up">{toast}</div>
      )}
    </>
  )
}
