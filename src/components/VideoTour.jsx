import { useEffect, useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Film } from 'lucide-react'
import { Img } from './ui'
import { cx } from '../lib/utils'

/**
 * Property video tour.
 * - If `src` (mp4/webm URL) is provided it plays the real video.
 * - Otherwise it plays a cinematic Ken-Burns slideshow of the gallery as a
 *   placeholder, labelled so the client knows where the lodge's own video goes.
 */
export default function VideoTour({ src, images = [], title, className = '', autoPlay = true, label = true }) {
  const [playing, setPlaying] = useState(autoPlay)
  const [muted, setMuted] = useState(true)
  const [i, setI] = useState(0)
  const [failed, setFailed] = useState(false)
  const useReal = src && !failed

  useEffect(() => {
    if (useReal || !playing || images.length < 2) return
    const t = setInterval(() => setI((x) => (x + 1) % images.length), 4500)
    return () => clearInterval(t)
  }, [playing, images.length, useReal])

  return (
    <div className={cx('relative overflow-hidden bg-black group', className)}>
      {useReal ? (
        <video src={src} autoPlay={autoPlay} muted={muted} loop playsInline onError={() => setFailed(true)} className="w-full h-full object-cover"
          ref={(v) => { if (v) playing ? v.play().catch(() => {}) : v.pause() }} />
      ) : (
        images.map((img, idx) => (
          <div key={idx} className={cx('absolute inset-0 transition-opacity duration-1000', idx === i ? 'opacity-100' : 'opacity-0')}>
            <Img src={img} alt={title} seed={`${title}-${idx}`} className={cx('w-full h-full', idx === i && playing && 'kenburns')} />
          </div>
        ))
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
      {label && !useReal && (
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/55 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          <Film size={13} /> Video tour · placeholder
        </div>
      )}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button onClick={() => setPlaying((p) => !p)} className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow">
          {playing ? <Pause size={16} className="fill-ink" /> : <Play size={16} className="fill-ink ml-0.5" />}
        </button>
        {useReal && (
          <button onClick={() => setMuted((m) => !m)} className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}
      </div>
      {!useReal && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, idx) => <span key={idx} className={cx('h-1 rounded-full transition-all', idx === i ? 'w-6 bg-white' : 'w-1.5 bg-white/60')} />)}
        </div>
      )}
    </div>
  )
}
