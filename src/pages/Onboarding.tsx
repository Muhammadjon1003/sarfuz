import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPaperPlane, 
  faArrowTrendUp, 
  faChartSimple, 
  faShieldHalved, 
  faBolt, 
  faClock, 
  faCircleCheck, 
  faArrowRight, 
  faWandMagicSparkles, 
  faUserGroup 
} from '@fortawesome/free-solid-svg-icons'

import logoDark from '@/assets/logo-dark.png'

export default function Onboarding() {
  const [telegramId, setTelegramIdInput] = useState('')
  const [isHovered, setIsHovered] = useState<number | null>(null)
  const { setTelegramId } = useAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (telegramId.trim()) {
      setTelegramId(telegramId.trim())
    }
  }

  const features = [
    {
      icon: faPaperPlane,
      title: 'Telegram Bot',
      description: 'Ovozli yoki matnli xabar orqali amal qo\'shing. Bot sizni tushunadi va saqlaydi.',
      color: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-500/10 border border-cyan-400/30',
      iconColor: 'text-cyan-300'
    },
    {
      icon: faArrowTrendUp,
      title: 'Real-time Tahlil',
      description: 'Daromad va chiqimlaringizni jonli kuzating. Har bir so\'m qayerga ketayotganini bilib oling.',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10 border border-emerald-400/30',
      iconColor: 'text-emerald-300'
    },
    {
      icon: faChartSimple,
      title: 'AI Prognoz',
      description: 'AI yordamida kelajakdagi pul oqimini bashorat qiling va muammolardan oldindan xabardor bo\'ling.',
      color: 'from-sky-500 to-cyan-500',
      bgColor: 'bg-sky-500/10 border border-sky-400/30',
      iconColor: 'text-sky-300'
    },
    {
      icon: faShieldHalved,
      title: 'Xavfsiz',
      description: 'Barcha ma\'lumotlaringiz shifrlangan va faqat sizga tegishli. Hech kim ko\'ra olmaydi.',
      color: 'from-teal-500 to-emerald-500',
      bgColor: 'bg-teal-500/10 border border-teal-400/30',
      iconColor: 'text-teal-300'
    }
  ]

  const steps = [
    { number: 1, text: 'Telegram botga /start yuboring', icon: faPaperPlane },
    { number: 2, text: 'Telegram ID ni oling', icon: faCircleCheck },
    { number: 3, text: 'ID ni kiriting va boshlang', icon: faBolt }
  ]

  const stats = [
    { value: '5 soniya', label: 'Amal qo\'shish', icon: faClock },
    { value: '100%', label: 'Xavfsiz', icon: faShieldHalved },
    { value: '24/7', label: 'Ishlaydi', icon: faBolt }
  ]

  return (
    <div className="min-h-screen bg-[#040e12] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden">
      {/* Radial mesh ambient glow background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 -right-32 w-[35rem] h-[35rem] bg-teal-500/15 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] bg-sky-500/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-bounce-slow shadow-[0_0_15px_rgba(0,242,254,0.2)]">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4" />
              AI Bilan Ishlaydigan Moliya Menejeri
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src={logoDark}
                alt="SARF Logo"
                className="w-16 h-16 rounded-2xl object-cover border border-cyan-400/40 shadow-[0_0_25px_rgba(0,242,254,0.4)]"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-teal-300 tracking-wider uppercase">
              SARF
            </h1>
            <p className="text-lg md:text-xl text-teal-200/70 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
              Biznesingiz moliyasini Telegram bot va zamonaviy web platforma orqali aqlli boshqaring
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="glass-panel-interactive flex items-center gap-4 px-6 py-3.5 rounded-2xl border border-teal-500/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                    <FontAwesomeIcon icon={stat.icon} className="w-5 h-5 text-slate-950" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-extrabold text-white">{stat.value}</div>
                    <div className="text-xs text-teal-300/70 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
                className="glass-panel-interactive group relative p-6 rounded-3xl border border-teal-500/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={feature.icon} className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {feature.description}
                </p>
                {isHovered === index && (
                  <div className="absolute bottom-5 right-5 text-cyan-400 animate-bounce-right">
                    <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Steps Section */}
          <div className="glass-card-gradient rounded-3xl p-8 md:p-12 mb-16 text-white animate-fade-in-up border border-cyan-400/30 shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl font-black text-center mb-12 tracking-tight">3 Qadamda Boshlang</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-cyan-500/20 border border-cyan-300/40 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                      <FontAwesomeIcon icon={step.icon} className="w-7 h-7 text-cyan-300" />
                    </div>
                    <div className="text-4xl font-black mb-2 text-cyan-400/40">{step.number}</div>
                    <p className="text-base font-semibold text-slate-200">{step.text}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-cyan-400/20">
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                        <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 text-cyan-400/50" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="glass-panel p-8 md:p-10 rounded-3xl border border-teal-500/30 max-w-md mx-auto shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,242,254,0.4)]">
                <FontAwesomeIcon icon={faBolt} className="w-7 h-7 text-slate-950" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-white">Hoziroq Boshlang</h2>
              <p className="text-teal-200/60 text-xs">Telegram ID ni kiriting va tizimga kiring</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="telegram_id" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Telegram ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="telegram_id"
                    value={telegramId}
                    onChange={(e) => setTelegramIdInput(e.target.value)}
                    placeholder="123456789"
                    className="w-full px-5 py-4 bg-teal-950/60 border border-teal-500/30 rounded-2xl text-white font-bold text-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-600"
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                    <FontAwesomeIcon icon={faUserGroup} className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 p-3 bg-teal-950/40 border border-teal-500/20 rounded-xl">
                  <p className="text-xs text-teal-300 flex items-start gap-2">
                    <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-400" />
                    <span>Telegram botga <span className="font-mono font-bold text-white">/start</span> yuboring va ID ni oling</span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 py-4 px-6 rounded-2xl font-black text-sm shadow-[0_0_25px_rgba(0,242,254,0.4)] transition-all flex items-center justify-center gap-2 group"
              >
                Kirish Va Boshlash
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-teal-500/15">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-2">Telegram botni topish uchun:</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-950/60 rounded-xl border border-cyan-500/30">
                  <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-cyan-300 font-bold text-xs">@YourFinanceBot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 text-center animate-fade-in-up">
            <p className="text-slate-400 text-xs mb-4">Ishonch bilan foydalaning</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-slate-300">
                <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium">SSL Shifrlangan</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium">Ma'lumotlar Xavfsiz</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium">Tez Va Oson</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes bounce-right {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-bounce-right {
          animation: bounce-right 1s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
