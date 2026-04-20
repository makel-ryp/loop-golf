import { Link } from 'react-router-dom'
import { LoopLogo } from '../components/LoopLogo'

export default function Landing() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: '#f5f5f2',
        backgroundImage: 'radial-gradient(circle, rgba(0,175,81,0.12) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* Hero — centered, grows to fill */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-2xl text-center">
          <div className="flex justify-center mb-4">
            <LoopLogo width={140} />
          </div>
          <p className="text-xs font-medium tracking-widest uppercase text-ryp-green mb-6">
            By Ryp Golf
          </p>

          <h1 className="font-serif text-6xl md:text-8xl leading-none tracking-tight text-ryp-black mb-8">
            Every round,{' '}
            <em className="text-ryp-green not-italic font-serif">better.</em>
          </h1>

          <p
            className="text-base text-[#666] leading-relaxed mb-10 pl-4 mx-auto max-w-sm text-left"
            style={{ borderLeft: '2.5px solid #00AF51' }}
          >
            The caddie in your pocket. Learn the game, read your data, and know
            exactly when you're ready to play.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-10 py-3.5 bg-ryp-green text-white font-sans font-medium text-sm tracking-wide rounded hover:bg-ryp-green-dark transition-colors"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-10 py-3.5 border border-ryp-black text-ryp-black font-sans font-medium text-sm tracking-wide rounded hover:bg-ryp-black hover:text-ryp-off-white transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>

      {/* Footer meta */}
      <div className="w-full max-w-5xl mx-auto px-8 md:px-16 pb-10">
        <div className="flex gap-8 flex-wrap pt-8 border-t border-black/10">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-widest uppercase text-[#aaa]">Product</span>
            <span className="text-sm font-medium text-ryp-black">Loop</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-widest uppercase text-[#aaa]">By</span>
            <span className="text-sm font-medium text-ryp-black">Ryp Golf</span>
          </div>
        </div>
      </div>
    </div>
  )
}
