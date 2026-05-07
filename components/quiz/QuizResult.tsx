'use client'

import { Phone, MessageCircle, Home, CheckCircle, Send, Shield, Clock, Lock, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface QuizResultProps {
  onGoHome: () => void
  userData?: {
    name?: string
    email?: string
    whatsapp?: string
  }
  answers?: Array<{
    questionId: string
    optionIds: string[]
  }>
}

export function QuizResult({ onGoHome, userData, answers }: QuizResultProps) {
  const [isSendingQuote, setIsSendingQuote] = useState(false)

  const handleSendQuote = async () => {
    try {
      setIsSendingQuote(true)
      
      const response = await fetch('/api/whatsapp/send-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userData,
          answers
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar orçamento')
      }

      toast.success('Orçamento enviado com sucesso! Entraremos em contato em breve.')
      
    } catch (error) {
      toast.error('Erro ao enviar orçamento. Tente novamente.')
      console.error(error)
    } finally {
      setIsSendingQuote(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full relative">
        {/* Main container with neon border */}
        <div className="relative bg-blue-950/90 backdrop-blur-sm rounded-3xl border-2 border-cyan-400 shadow-2xl shadow-cyan-400/20 p-8 animate-slide-up">
          
          {/* Header */}
          <div className="text-center mb-8">
            {/* Neon circle with checkmark */}
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-cyan-400 rounded-full w-24 h-24 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              Obrigado! 🎉
            </h2>
            <p className="text-white text-xl">
              Sua avaliação foi registrada <span className="text-cyan-300 font-semibold">com sucesso!</span>
            </p>
          </div>

          {/* Feature Icons Section */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-3">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">100% seguro</h3>
              <p className="text-gray-400 text-xs">Seus dados protegidos</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-3">
                <Clock className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Leva menos de 2 minutos</h3>
              <p className="text-gray-400 text-xs">Rápido e prático</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800 rounded-full mb-3">
                <div className="w-8 h-8 text-cyan-400" style={{ clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' }}></div>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">Avaliação personalizada</h3>
              <p className="text-gray-400 text-xs">Atendimento exclusivo</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <button
              onClick={handleSendQuote}
              disabled={isSendingQuote}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center">
                  <Send className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-lg">
                      {isSendingQuote ? 'Enviando...' : 'Receber atendimento agora'}
                    </div>
                    <div className="text-sm opacity-90">
                      Nossa equipe entrará em contato com você
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <button
              onClick={onGoHome}
              className="w-full group bg-blue-800/50 text-white rounded-xl p-4 transition-all duration-300 hover:bg-blue-800/70 hover:shadow-lg hover:shadow-blue-800/30 border border-blue-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold text-lg">Voltar para Home</div>
                    <div className="text-sm opacity-90">Continuar navegando no site</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-blue-800 pt-4">
            <div className="flex items-center justify-center text-gray-400 text-sm">
              <Lock className="w-4 h-4 mr-2" />
              Suas respostas são confidenciais e seguras.
            </div>
          </div>
        </div>

        {/* Decorative tooth graphic on the right */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
          <svg width="120" height="150" viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M60 10C75 10 85 20 85 35C85 50 80 60 80 75C80 90 85 100 85 115C85 130 75 140 60 140C45 140 35 130 35 115C35 100 40 90 40 75C40 60 35 50 35 35C35 20 45 10 60 10Z" 
                  stroke="currentColor" strokeWidth="2" fill="none" className="text-cyan-400"/>
            <circle cx="60" cy="75" r="8" fill="currentColor" className="text-cyan-400"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
