import Link from 'next/link'
import { Shield, Lock, Clock, MessageCircle, Target, Smile, ClipboardList } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] md:h-[100dvh] home-background relative overflow-y-auto md:overflow-hidden flex flex-col">
      {/* Header com ícones - design idêntico aos cards */}
      <div className="flex justify-end items-center gap-6 px-6 py-3 flex-shrink-0">
        <div className="flex items-center gap-2.5 text-white/90">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.5)] flex-shrink-0">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">100%</div>
            <div className="text-xs text-slate-400 leading-tight">Seguro</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-white/90">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.5)] flex-shrink-0">
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">Seus dados</div>
            <div className="text-xs text-slate-400 leading-tight">protegidos</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 text-white/90">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.5)] flex-shrink-0">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">Leva menos de</div>
            <div className="text-xs text-slate-400 leading-tight">3 minutos</div>
          </div>
        </div>
      </div>

      {/* Container principal - alinhado à esquerda */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-5xl ml-6 md:ml-12 lg:ml-20 px-4 py-6 md:py-0 overflow-hidden">
        
        {/* Título principal - linha 1 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg leading-tight mb-1 animate-fade-in-up">
          Perdeu seus <span className="text-cyan-400 animate-glow-pulse">Dentes?</span>
        </h1>
        
        {/* Título principal - linha 2 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg leading-tight mb-4 md:mb-6 animate-fade-in-up-delay-1">
          Sofre com <span className="text-cyan-400 animate-glow-pulse">Dentadura Solta?</span>
        </h1>
        
        {/* Destaque principal */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg leading-tight mb-6 md:mb-8 animate-fade-in-up-delay-2">
          A solução <span className="text-cyan-400 animate-glow-pulse">chegou!</span>
        </h2>

        {/* Subtítulo - uma linha só */}
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white drop-shadow-lg leading-tight mb-4 md:mb-6 animate-fade-in-up-delay-3">
          Volte a <span className="text-cyan-400 animate-glow-pulse">sorrir</span> gastando pouco
        </h3>

        {/* Call to Action com ícone */}
        <div className="flex items-center gap-2 mb-5">
          <MessageCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <p className="text-sm md:text-base text-white drop-shadow-md font-medium">
            Responda o quiz e receba seu <span className="text-cyan-400 font-bold">orçamento personalizado.</span>
          </p>
        </div>

        {/* Botão principal - design melhorado */}
        <Link 
          href="/quiz"
          className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-white font-black rounded-xl hover:from-cyan-500 hover:via-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.4)] text-lg mb-3 w-fit border border-cyan-400/30"
        >
          Responder Quiz!
          <span className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-sm font-bold backdrop-blur-sm">
            →
          </span>
        </Link>

        {/* Texto de confidencialidade */}
        <div className="flex items-center gap-1.5 text-white/80 mb-6">
          <Lock className="w-3 h-3" />
          <p className="text-xs">
            Suas respostas são confidenciais e seguras
          </p>
        </div>

        {/* Cards inferiores - grid responsivo */}
        <div className="grid grid-cols-2 md:flex md:flex-nowrap gap-3 md:gap-0 bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 md:p-6 flex-shrink-0 border border-slate-700/50">
          
          {/* Card 1 */}
          <div className="flex items-start md:items-center gap-3 py-2 md:py-3 px-2 md:px-4 relative">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                <ClipboardList className="w-5 h-5 md:w-7 md:h-7 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs md:text-base md:whitespace-nowrap">Rápido e prático</h4>
              <p className="text-slate-300 text-[10px] md:text-sm leading-snug mt-0.5 md:mt-1">Leva menos de<br/>3 minutos</p>
            </div>
          </div>
          
          {/* Divisor */}
          <div className="hidden md:block w-px bg-slate-600/50 self-stretch mx-2 order-2"></div>
          
          {/* Card 2 */}
          <div className="flex items-start md:items-center gap-3 py-2 md:py-3 px-2 md:px-4 relative">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                <Target className="w-5 h-5 md:w-7 md:h-7 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs md:text-base md:whitespace-nowrap">Para você</h4>
              <p className="text-slate-300 text-[10px] md:text-sm leading-snug mt-0.5 md:mt-1">Respostas que geram<br/>um orçamento preciso</p>
            </div>
          </div>
          
          {/* Divisor */}
          <div className="hidden md:block w-px bg-slate-600/50 self-stretch mx-2 order-4"></div>
          
          {/* Card 3 */}
          <div className="flex items-start md:items-center gap-3 py-2 md:py-3 px-2 md:px-4 relative">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                <Shield className="w-5 h-5 md:w-7 md:h-7 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs md:text-base md:whitespace-nowrap">Sem compromisso</h4>
              <p className="text-slate-300 text-[10px] md:text-sm leading-snug mt-0.5 md:mt-1">Orçamento gratuito<br/>e sem obrigação</p>
            </div>
          </div>
          
          {/* Divisor */}
          <div className="hidden md:block w-px bg-slate-600/50 self-stretch mx-2 order-6"></div>
          
          {/* Card 4 */}
          <div className="flex items-start md:items-center gap-3 py-2 md:py-3 px-2 md:px-4 relative">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.6)]">
                <Smile className="w-5 h-5 md:w-7 md:h-7 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs md:text-base md:whitespace-nowrap">Mais confiança</h4>
              <p className="text-slate-300 text-[10px] md:text-sm leading-snug mt-0.5 md:mt-1">Cuidado, tecnologia<br/>e experiência</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
