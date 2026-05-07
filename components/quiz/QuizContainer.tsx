'use client'

import { useState } from 'react'
import { ChevronLeft, HelpCircle, Clock, CheckCircle } from 'lucide-react'

interface Option {
  id: string
  text: string
  order: number
}

interface Question {
  id: string
  text: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT'
  options: Option[]
}

interface QuizContainerProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  progress: number
  onAnswer: (optionIds: string[], textAnswer?: string) => void
  canGoBack: boolean
  onBack: () => void
}

export function QuizContainer({
  question,
  questionNumber,
  totalQuestions,
  progress,
  onAnswer,
  canGoBack,
  onBack
}: QuizContainerProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [textAnswer, setTextAnswer] = useState('')
  const [showHelp, setShowHelp] = useState(false)

  const handleOptionToggle = (optionId: string) => {
    if (question.type === 'SINGLE_CHOICE') {
      // Escolha única - substituir seleção
      setSelectedOptions([optionId])
    } else {
      // Múltipla escolha - adicionar/remover da seleção
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId)
        } else {
          return [...prev, optionId]
        }
      })
    }
  }

  const handleSubmit = () => {
    if (question.type === 'TEXT') {
      if (!textAnswer.trim()) {
        alert('Por favor, digite sua resposta')
        return
      }
      onAnswer([], textAnswer.trim())
    } else {
      if (selectedOptions.length === 0) {
        alert('Por favor, selecione pelo menos uma opção')
        return
      }
      onAnswer(selectedOptions)
    }
  }

  const quizSteps = ['Boas-vindas', 'Perfil', 'Avaliação', 'Resultado']
  const currentStepIndex = Math.min(Math.floor((questionNumber - 1) / Math.ceil(totalQuestions / 4)), 3)

  return (
    <div className="min-h-screen relative" style={{background: 'linear-gradient(135deg, #020B1F 0%, #0A1929 50%, #020B1F 100%)'}}>
      {/* Efeito glow ao redor do header */}
      <div className="absolute inset-x-0 top-0 h-20 opacity-30" 
           style={{
             background: 'radial-gradient(ellipse at center top, rgba(0, 209, 255, 0.15) 0%, transparent 70%)',
             filter: 'blur(40px)'
           }}>
      </div>
      
      {/* Header with Steps */}
      <div className="relative z-10 backdrop-blur-xl border-b" style={{
        background: 'rgba(2, 11, 31, 0.8)',
        borderColor: 'rgba(0, 209, 255, 0.3)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center space-x-8">
            {quizSteps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${index <= currentStepIndex 
                    ? 'text-white' 
                    : 'text-white/60'
                  }
                `}
                style={{
                  background: index <= currentStepIndex 
                    ? 'linear-gradient(135deg, #00D1FF 0%, #2F6BFF 100%)'
                    : 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  boxShadow: index <= currentStepIndex 
                    ? '0 0 20px rgba(0, 209, 255, 0.3)'
                    : '0 0 10px rgba(0, 209, 255, 0.1)'
                }}>
                  {index < currentStepIndex ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium transition-colors ${
                  index <= currentStepIndex ? 'text-white' : 'text-white/60'
                }`}>
                  {step}
                </span>
                {index < quizSteps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 transition-colors ${
                    index < currentStepIndex ? 'bg-cyan-400' : 'bg-white/20'
                  }`} 
                  style={{
                    background: index < currentStepIndex 
                      ? 'linear-gradient(90deg, #00D1FF, #2F6BFF)'
                      : 'rgba(255, 255, 255, 0.2)'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="flex items-center gap-8 max-w-7xl w-full">
          {/* Left side content */}
          <div className="flex-1 hidden lg:block">
            <div className="space-y-6">
              <div className="rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                   style={{
                     background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.9) 0%, rgba(2, 11, 31, 0.8) 100%)',
                     border: '1px solid rgba(0, 209, 255, 0.3)',
                     boxShadow: '0 0 30px rgba(0, 209, 255, 0.1)'
                   }}>
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-6 h-6 text-cyan-300" style={{filter: 'drop-shadow(0 0 10px rgba(0, 209, 255, 0.5))'}} />
                  <h3 className="text-lg font-semibold text-white" style={{textShadow: '0 0 10px rgba(0, 209, 255, 0.3)'}}>Rápido e prático</h3>
                </div>
                <p className="text-gray-300">Leva menos de 2 minutos</p>
              </div>
              
              <div className="rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 hover:scale-105"
                   style={{
                     background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.9) 0%, rgba(2, 11, 31, 0.8) 100%)',
                     border: '1px solid rgba(0, 209, 255, 0.3)',
                     boxShadow: '0 0 30px rgba(0, 209, 255, 0.1)'
                   }}>
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-cyan-300" style={{filter: 'drop-shadow(0 0 10px rgba(0, 209, 255, 0.5))'}} />
                  <h3 className="text-lg font-semibold text-white" style={{textShadow: '0 0 10px rgba(0, 209, 255, 0.3)'}}>Atendimento especializado</h3>
                </div>
                <p className="text-gray-300">Avaliação profissional completa</p>
              </div>
            </div>
          </div>

          {/* Main Quiz Card */}
          <div className="flex-1 max-w-2xl relative">
            {/* Efeito glow ao redor do card */}
            <div className="absolute inset-0 rounded-3xl opacity-30" 
                 style={{
                   background: 'radial-gradient(circle at center, rgba(0, 209, 255, 0.15) 0%, transparent 70%)',
                   filter: 'blur(40px)'
                 }}>
            </div>
            
            <div className="relative rounded-3xl p-8 backdrop-blur-xl animate-slide-up" 
                 style={{
                   background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.9) 0%, rgba(2, 11, 31, 0.8) 100%)',
                   border: '1px solid rgba(0, 209, 255, 0.3)',
                   boxShadow: '0 0 40px rgba(0, 209, 255, 0.1), inset 0 0 20px rgba(0, 209, 255, 0.05)'
                 }}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white leading-relaxed mb-6" style={{textShadow: '0 0 10px rgba(0, 209, 255, 0.3)'}}>
                  {question.text}
                </h2>
              </div>

              {/* Options or Text Input */}
              {question.type === 'TEXT' ? (
                <div className="mb-8">
                  <textarea
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Digite sua resposta aqui..."
                    className="w-full p-4 rounded-lg resize-none h-32 transition-all duration-300"
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(0, 209, 255, 0.3)',
                      color: '#ffffff',
                      boxShadow: '0 0 15px rgba(0, 209, 255, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#00D1FF'
                      e.target.style.boxShadow = '0 0 25px rgba(0, 209, 255, 0.3)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 209, 255, 0.3)'
                      e.target.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.1)'
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {question.options.map((option) => (
                    <label
                      key={option.id}
                      className={`
                        flex items-center p-4 rounded-lg cursor-pointer transition-all duration-300
                      `}
                      style={{
                        background: selectedOptions.includes(option.id)
                          ? 'linear-gradient(135deg, rgba(0, 209, 255, 0.2) 0%, rgba(47, 107, 255, 0.2) 100%)'
                          : 'rgba(0, 0, 0, 0.2)',
                        border: selectedOptions.includes(option.id)
                          ? '1px solid rgba(0, 209, 255, 0.6)'
                          : '1px solid rgba(0, 209, 255, 0.3)',
                        boxShadow: selectedOptions.includes(option.id)
                          ? '0 0 25px rgba(0, 209, 255, 0.3)'
                          : '0 0 15px rgba(0, 209, 255, 0.1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!selectedOptions.includes(option.id)) {
                          e.currentTarget.style.borderColor = 'rgba(0, 209, 255, 0.5)'
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 209, 255, 0.2)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selectedOptions.includes(option.id)) {
                          e.currentTarget.style.borderColor = 'rgba(0, 209, 255, 0.3)'
                          e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 209, 255, 0.1)'
                        }
                      }}
                    >
                      <input
                        type={question.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                        name="quiz-option"
                        value={option.id}
                        checked={selectedOptions.includes(option.id)}
                        onChange={() => handleOptionToggle(option.id)}
                        className="sr-only"
                      />
                      <div className={`
                        w-5 h-5 rounded mr-4 flex items-center justify-center transition-all duration-300
                      `}
                      style={{
                        border: selectedOptions.includes(option.id)
                          ? '2px solid #00D1FF'
                          : '2px solid rgba(0, 209, 255, 0.3)',
                        background: selectedOptions.includes(option.id)
                          ? 'linear-gradient(135deg, #00D1FF 0%, #2F6BFF 100%)'
                          : 'transparent'
                      }}>
                        {selectedOptions.includes(option.id) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium" style={{color: '#ffffff'}}>
                        {option.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={question.type === 'TEXT' ? !textAnswer.trim() : selectedOptions.length === 0}
                className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden"
                style={{
                  background: (question.type === 'TEXT' ? textAnswer.trim() : selectedOptions.length > 0)
                    ? 'linear-gradient(135deg, #00D1FF 0%, #2F6BFF 100%)'
                    : 'rgba(0, 0, 0, 0.3)',
                  color: '#ffffff',
                  border: '1px solid rgba(0, 209, 255, 0.5)',
                  boxShadow: (question.type === 'TEXT' ? textAnswer.trim() : selectedOptions.length > 0)
                    ? '0 0 20px rgba(0, 209, 255, 0.3)'
                    : '0 0 10px rgba(0, 209, 255, 0.1)'
                }}
                onMouseEnter={(e) => {
                  if (!(question.type === 'TEXT' ? !textAnswer.trim() : selectedOptions.length === 0)) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 5px 30px rgba(0, 209, 255, 0.5)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #00E1FF 0%, #3F7BFF 100%)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!(question.type === 'TEXT' ? !textAnswer.trim() : selectedOptions.length === 0)) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 209, 255, 0.3)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #00D1FF 0%, #2F6BFF 100%)'
                  }
                }}
              >
                <span style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'}}>
                  Continuar avaliação
                </span>
              </button>
            </div>

            {/* Confidentiality Text */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Suas respostas são confidenciais e seguras.
              </p>
            </div>
          </div>

          {/* Right side - Tooth Image */}
          <div className="flex-1 hidden lg:block">
            <div className="flex justify-center">
              <img 
                src="/dente.png" 
                alt="Dente" 
                className="w-48 h-48 object-contain transition-all duration-300 hover:scale-110"
                style={{filter: 'drop-shadow(0 0 30px rgba(0, 209, 255, 0.3))'}}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Ajuda */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="rounded-2xl p-6 max-w-md w-full animate-slide-up backdrop-blur-xl" 
               style={{
                 background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.9) 0%, rgba(2, 11, 31, 0.8) 100%)',
                 border: '1px solid rgba(0, 209, 255, 0.3)',
                 boxShadow: '0 0 40px rgba(0, 209, 255, 0.1)'
               }}>
            <h3 className="text-xl font-bold text-white mb-4" style={{textShadow: '0 0 10px rgba(0, 209, 255, 0.3)'}}>Como responder</h3>
            <div className="space-y-3 text-gray-300">
              <p>
                <strong className="text-cyan-300">Escolha única:</strong> Selecione apenas uma opção correta.
              </p>
              <p>
                <strong className="text-cyan-300">Múltipla escolha:</strong> Selecione todas as opções que considerar corretas.
              </p>
              <p>
                <strong className="text-cyan-300">Resposta textual:</strong> Digite sua resposta no campo de texto.
              </p>
              <p>
                Após responder, clique no botão para avançar.
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full py-3 rounded-lg font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #00D1FF 0%, #2F6BFF 100%)',
                color: '#ffffff',
                border: '1px solid rgba(0, 209, 255, 0.5)',
                boxShadow: '0 0 20px rgba(0, 209, 255, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 5px 30px rgba(0, 209, 255, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 209, 255, 0.3)'
              }}
            >
              <span style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'}}>Entendido</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
