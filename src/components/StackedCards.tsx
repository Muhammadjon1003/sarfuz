import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved, faWandMagicSparkles, faWallet } from '@fortawesome/free-solid-svg-icons'
import { useThemeStore } from '@/store/themeStore'

interface StackedCardsProps {
  netBalance: number
  totalExpense: number
  totalIncome: number
  formatCurrency: (val: number) => string
}

export default function StackedCards({
  netBalance,
  totalExpense,
  totalIncome,
  formatCurrency,
}: StackedCardsProps) {
  const { theme } = useThemeStore()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeCard, setActiveCard] = useState<number>(0)
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0)

  const isLight = theme === 'light'

  const cardsData = [
    {
      id: 0,
      title: 'Asosiy Balans',
      subtitle: 'Joriy Balans',
      badge: 'CORPORATE',
      amount: netBalance,
      icon: faWallet,
      bgClass: isLight
        ? 'bg-gradient-to-tr from-cyan-600 via-sky-600 to-blue-600 border-cyan-300/60 shadow-[0_14px_35px_rgba(2,132,199,0.35)]'
        : 'glass-card-gradient border-cyan-300/40 hover:border-cyan-200 shadow-[0_16px_40px_rgba(0,242,254,0.25)]',
      glowColor: isLight ? 'bg-cyan-300/40' : 'bg-cyan-400/30',
      badgeBg: 'bg-white/25 text-white border-white/40 font-bold',
    },
    {
      id: 1,
      title: 'Jami Chiqimlar',
      subtitle: 'Chiqimlar Limiti',
      badge: 'EXPENSE',
      amount: totalExpense,
      icon: faWandMagicSparkles,
      bgClass: isLight
        ? 'bg-gradient-to-tr from-rose-500 via-pink-600 to-purple-600 border-rose-300/60 shadow-[0_14px_35px_rgba(225,29,72,0.3)]'
        : 'bg-gradient-to-tr from-[#2a1352]/90 via-[#4c1d95]/80 to-[#1e1b4b]/95 backdrop-blur-2xl border-purple-400/40 hover:border-purple-300 shadow-[0_16px_40px_rgba(168,85,247,0.3)]',
      glowColor: isLight ? 'bg-pink-300/40' : 'bg-purple-400/30',
      badgeBg: 'bg-white/25 text-white border-white/40 font-bold',
    },
    {
      id: 2,
      title: 'Jami Daromadlar',
      subtitle: "Jamg'arma Qoldig'i",
      badge: 'INCOME',
      amount: totalIncome,
      icon: faShieldHalved,
      bgClass: isLight
        ? 'bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-700 border-emerald-300/60 shadow-[0_14px_35px_rgba(16,185,129,0.3)]'
        : 'bg-gradient-to-tr from-[#022c22]/90 via-[#065f46]/80 to-[#041f18]/95 backdrop-blur-2xl border-emerald-400/40 hover:border-emerald-300 shadow-[0_16px_40px_rgba(16,185,129,0.3)]',
      glowColor: isLight ? 'bg-emerald-300/40' : 'bg-emerald-400/30',
      badgeBg: 'bg-white/25 text-white border-white/40 font-bold',
    },
  ]

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft
    const width = e.currentTarget.offsetWidth
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / (width * 0.75))
      if (newIndex >= 0 && newIndex < cardsData.length) {
        setMobileActiveIndex(newIndex)
      }
    }
  }

  return (
    <>
      {/* Mobile & Tablet Side-by-Side Horizontal Slider View (< lg) */}
      <div className="block lg:hidden w-full space-y-3">
        <div 
          onScroll={handleMobileScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cardsData.map((card) => (
            <div
              key={card.id}
              style={{ color: '#ffffff' }}
              className={`w-[85%] sm:w-[280px] md:w-[300px] flex-shrink-0 snap-center h-[180px] rounded-3xl p-5 flex flex-col justify-between overflow-hidden backdrop-blur-2xl border ${card.bgClass} relative`}
            >
              {/* Ambient blur */}
              <div className={`absolute -right-12 -bottom-12 w-44 h-44 ${card.glowColor} rounded-full blur-2xl pointer-events-none`}></div>

              {/* Card Header Row */}
              <div className="flex items-center justify-between z-10" style={{ color: '#ffffff' }}>
                <div className="flex items-center gap-2" style={{ color: '#ffffff' }}>
                  <div className="p-1.5 rounded-xl bg-white/20 border border-white/30 text-white shadow-sm flex items-center justify-center">
                    <FontAwesomeIcon icon={card.icon} className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider truncate" style={{ color: '#ffffff' }}>
                    {card.title}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${card.badgeBg}`} style={{ color: '#ffffff' }}>
                  {card.badge}
                </span>
              </div>

              {/* Card Middle */}
              <div className="z-10 my-1" style={{ color: '#ffffff' }}>
                <p className="text-[11px] font-semibold opacity-90" style={{ color: '#ffffff' }}>{card.subtitle}</p>
                <h3 className="text-xl font-black tracking-tight mt-1 drop-shadow-md" style={{ color: '#ffffff' }}>
                  {formatCurrency(card.amount)}
                </h3>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/20 z-10" style={{ color: '#ffffff' }}>
                <span className="flex items-center gap-1.5 font-bold text-[10px]" style={{ color: '#ffffff' }}>
                  <FontAwesomeIcon icon={faShieldHalved} className="w-3 h-3" style={{ color: '#ffffff' }} />
                  Himoyalangan Hisob
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Tablet Pagination Dots */}
        <div className="flex justify-center items-center gap-2 pt-1">
          {cardsData.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                mobileActiveIndex === idx 
                  ? (isLight ? 'w-6 bg-cyan-600 shadow-md' : 'w-6 bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.6)]') 
                  : (isLight ? 'w-1.5 bg-cyan-400/40' : 'w-1.5 bg-teal-500/30')
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop 3D Stack Stage (>= lg) */}
      <div className="hidden lg:flex relative w-full h-[285px] glass-panel rounded-3xl p-6 overflow-hidden flex-col justify-between shadow-2xl border border-teal-500/20 select-none group/stage">
        <div className="relative w-full h-[235px] flex items-end justify-center">
          {cardsData.map((card, index) => {
            const isActive = card.id === activeCard

            let bottomPx = index === 0 ? 8 : index === 1 ? 34 : 60
            let marginPx = index * 10
            let zIndex = isActive ? 40 : (3 - index) * 10

            let translateY = 0
            let scale = 1

            if (hoveredCard !== null) {
              if (card.id === hoveredCard) {
                translateY = -10
                scale = 1.02
                zIndex = 50
              } else if (card.id < hoveredCard) {
                translateY = (hoveredCard - card.id) * 38
                scale = 0.98
              } else if (card.id > hoveredCard) {
                translateY = (hoveredCard - card.id) * 38
                scale = 0.98
              }
            }

            return (
              <div
                key={card.id}
                onClick={() => setActiveCard(card.id)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  zIndex,
                  bottom: `${bottomPx}px`,
                  left: `${marginPx}px`,
                  right: `${marginPx}px`,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), bottom 0.4s ease, z-index 0.2s ease, opacity 0.3s ease',
                  color: '#ffffff',
                }}
                className={`absolute h-[180px] rounded-3xl p-5 flex flex-col justify-between overflow-hidden backdrop-blur-2xl transition-all cursor-pointer ${card.bgClass}`}
              >
                <div className={`absolute -right-12 -bottom-12 w-48 h-48 ${card.glowColor} rounded-full blur-2xl pointer-events-none transition-transform duration-500`}></div>

                <div className="flex items-center justify-between z-10" style={{ color: '#ffffff' }}>
                  <div className="flex items-center gap-2.5" style={{ color: '#ffffff' }}>
                    <div className="p-1.5 rounded-xl bg-white/20 border border-white/30 text-white shadow-sm flex items-center justify-center">
                      <FontAwesomeIcon icon={card.icon} className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#ffffff' }}>
                      {card.title}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${card.badgeBg}`} style={{ color: '#ffffff' }}>
                    {card.badge}
                  </span>
                </div>

                <div className="z-10 my-1" style={{ color: '#ffffff' }}>
                  <p className="text-[11px] font-semibold opacity-90" style={{ color: '#ffffff' }}>{card.subtitle}</p>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1 drop-shadow-md" style={{ color: '#ffffff' }}>
                    {formatCurrency(card.amount)}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/20 z-10" style={{ color: '#ffffff' }}>
                  <span className="flex items-center gap-1.5 font-bold text-[11px]" style={{ color: '#ffffff' }}>
                    <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" style={{ color: '#ffffff' }} />
                    Himoyalangan Hisob
                  </span>
                  <span className="opacity-90 text-[9px] font-bold" style={{ color: '#ffffff' }}>Bosing</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
