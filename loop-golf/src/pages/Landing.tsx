import { Link } from 'react-router-dom'
import { LoopLogo } from '../components/LoopLogo'

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col justify-between px-8 py-16 md:px-16"
      style={{
        background: '#f5f5f2',
        backgroundImage: 'radial-gradient(circle, rgba(0,175,81,0.12) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* Logo */}
      <div>
        <LoopLogo width={140} />
      </div>

      {/* Hero */}
      <div className="max-w-xl">
        <p className="text-xs font-medium tracking-widest uppercase text-ryp-green mb-6">
          By Ryp Golf
        </p>

        <h1 className="font-serif text-6xl md:text-8xl leading-none tracking-tight text-ryp-black mb-8">
          Every round,{' '}
          <em className="text-ryp-green not-italic font-serif">better.</em>
        </h1>

        <p
          className="text-base text-[#666] leading-relaxed mb-10 pl-4 max-w-sm"
          style={{ borderLeft: '2.5px solid #00AF51' }}
        >
          The caddie in your pocket. Learn the game, read your data, and know
          exactly when you're ready to play.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-ryp-green text-white font-sans font-medium text-sm tracking-wide rounded hover:bg-ryp-green-dark transition-colors"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-ryp-black text-ryp-black font-sans font-medium text-sm tracking-wide rounded hover:bg-ryp-black hover:text-ryp-off-white transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>

      {/* Footer meta */}
      <div className="flex gap-8 flex-wrap pt-10 border-t border-black/10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest uppercase text-[#aaa]">Product</span>
          <span className="text-sm font-medium text-ryp-black">Loop</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest uppercase text-[#aaa]">By</span>
          <span className="text-sm font-medium text-ryp-black">Ryp Golf</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] tracking-widest uppercase text-[#aaa]">Version</span>
          <span className="text-sm font-medium text-ryp-green">#00AF51</span>
        </div>
      </div>
    </div>
  )
}
