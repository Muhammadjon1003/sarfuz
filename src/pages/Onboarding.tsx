import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { MessageCircle, TrendingUp, BarChart3, Shield, Zap, Clock, CheckCircle2, ArrowRight, Sparkles, Users, } from 'lucide-react'

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
      icon: MessageCircle,
      title: 'Telegram Bot',
      description: 'Ovozli yoki matnli xabar orqali tranzaksiya qo\'shing. Bot sizni tushunadi va saqlaydi.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Tahlil',
      description: 'Kirim va chiqimlaringizni jonli kuzating. Har bir so\'m qayerga ketayotganini bilib oling.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: BarChart3,
      title: 'AI Prognoz',
      description: 'AI yordamida kelajakdagi pul oqimini bashorat qiling va muammolardan oldindan xabardor bo\'ling.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Shield,
      title: 'Xavfsiz',
      description: 'Barcha ma\'lumotlaringiz shifrlangan va faqat sizga tegishli. Hech kim ko\'ra olmaydi.',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ]

  const steps = [
    { number: 1, text: 'Telegram botga /start yuboring', icon: MessageCircle },
    { number: 2, text: 'Telegram ID ni oling', icon: CheckCircle2 },
    { number: 3, text: 'ID ni kiriting va boshlang', icon: Zap }
  ]

  const stats = [
    { value: '5 soniya', label: 'Tranzaksiya qo\'shish', icon: Clock },
    { value: '100%', label: 'Xavfsiz', icon: Shield },
    { value: '24/7', label: 'Ishlaydi', icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6 animate-bounce-slow">
              <Sparkles className="w-4 h-4" />
              AI bilan ishlaydigan moliya menejeri
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Biznes Moliya Menejeri
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Telegram bot va web dashboard orqali biznesingiz moliyasini boshqaring
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
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
                className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
                {isHovered === index && (
                  <div className="absolute bottom-4 right-4 text-blue-600 animate-bounce-right">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Steps Section */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 mb-16 text-white animate-fade-in-up">
            <h2 className="text-3xl font-bold text-center mb-12">3 qadamda boshlang</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold mb-2 opacity-50">{step.number}</div>
                    <p className="text-lg font-medium">{step.text}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-white/30">
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                        <ArrowRight className="w-5 h-5 text-white/50" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-200 max-w-md mx-auto animate-fade-in-up hover:shadow-3xl transition-shadow duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Hoziroq boshlang</h2>
              <p className="text-gray-600">Telegram ID ni kiriting va ishni boshlang</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="telegram_id" className="block text-sm font-semibold text-gray-700 mb-3">
                  Telegram ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="telegram_id"
                    value={telegramId}
                    onChange={(e) => setTelegramIdInput(e.target.value)}
                    placeholder="123456789"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Telegram botga <span className="font-mono font-semibold">/start</span> yuboring va ID ni oling</span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 group"
              >
                Kirish va boshlash
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Telegram botni topish uchun:</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-mono text-blue-600 font-semibold">@YourFinanceBot</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 text-center animate-fade-in-up">
            <p className="text-gray-500 text-sm mb-4">Ishonch bilan foydalaning</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">SSL shifrlangan</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Ma'lumotlar xavfsiz</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Tez va oson</span>
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
