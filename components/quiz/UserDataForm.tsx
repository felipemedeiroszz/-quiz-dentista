'use client'

import { useState } from 'react'
import { User, Mail, Phone, X } from 'lucide-react'

interface UserDataFormProps {
  onSubmit: (userData: {
    name?: string
    email?: string
    whatsapp?: string
  }) => void
  onCancel?: () => void
  isLoading: boolean
}

export function UserDataForm({ onSubmit, onCancel, isLoading }: UserDataFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Enviar apenas campos preenchidos
    const userData = {
      ...(formData.name && { name: formData.name }),
      ...(formData.email && { email: formData.email }),
      ...(formData.whatsapp && { whatsapp: formData.whatsapp })
    }
    
    onSubmit(userData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #020B1F 0%, #0A1929 50%, #020B1F 100%)'}}>
      <div className="max-w-md w-full relative">
        {/* Efeito glow ao redor do modal */}
        <div className="absolute inset-0 rounded-3xl opacity-30" 
             style={{
               background: 'radial-gradient(circle at center, rgba(0, 209, 255, 0.15) 0%, transparent 70%)',
               filter: 'blur(40px)'
             }}>
        </div>
        
        {/* Texto fora do modal */}
        <div className="text-center mb-6 relative z-10">
          <span className="text-white text-3xl font-bold drop-shadow-lg" style={{textShadow: '0 0 20px rgba(0, 209, 255, 0.5)'}}>Preencha para receber seu </span>
          <span className="text-cyan-300 text-3xl font-bold drop-shadow-lg" style={{textShadow: '0 0 30px rgba(0, 209, 255, 0.8)'}}>orçamento!</span>
        </div>
        
        {/* Modal com bordas translúcidas e brilho */}
        <div className="relative rounded-3xl p-8 backdrop-blur-xl animate-slide-up" 
             style={{
               background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.9) 0%, rgba(2, 11, 31, 0.8) 100%)',
               border: '1px solid rgba(0, 209, 255, 0.3)',
               boxShadow: '0 0 40px rgba(0, 209, 255, 0.1), inset 0 0 20px rgba(0, 209, 255, 0.05)'
             }}>
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2" style={{textShadow: '0 0 10px rgba(0, 209, 255, 0.3)'}}>
              Quase lá!
            </h2>
            <p className="text-gray-300">
              Preencha seus dados para finalizar a avaliação
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-cyan-300 mb-2 text-center">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  color: '#ffffff',
                  boxShadow: '0 0 15px rgba(0, 209, 255, 0.1)'
                }}
                placeholder="Seu nome"
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

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyan-300 mb-2 text-center">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  color: '#ffffff',
                  boxShadow: '0 0 15px rgba(0, 209, 255, 0.1)'
                }}
                placeholder="seu@email.com"
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

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-cyan-300 mb-2 text-center">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                className="block w-full px-4 py-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                  color: '#ffffff',
                  boxShadow: '0 0 15px rgba(0, 209, 255, 0.1)'
                }}
                placeholder="(00) 00000-0000"
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

            {/* Botão */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #00D1FF 0%, #2F6BFF 100%)',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(0, 209, 255, 0.3)',
                  border: '1px solid rgba(0, 209, 255, 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 5px 30px rgba(0, 209, 255, 0.5)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #00E1FF 0%, #3F7BFF 100%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 209, 255, 0.3)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #00D1FF 0%, #2F6BFF 100%)'
                }}
              >
                <span style={{textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'}}>
                  {isLoading ? 'Salvando...' : 'Finalizar'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
