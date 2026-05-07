'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, HelpCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Option {
  id: string
  text: string
  order: number
  isCorrect?: boolean
  points?: number
}

interface Question {
  id: string
  text: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE'
  order: number
  isActive: boolean
  options?: Option[]
}

export default function EditQuestionPage() {
  const router = useRouter()
  const params = useParams()
  const questionId = params.id as string
  
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState({
    text: '',
    type: 'SINGLE_CHOICE' as 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT',
    order: 1,
    isActive: true
  })
  const [options, setOptions] = useState<Option[]>([
    { id: '1', text: '', order: 1 },
    { id: '2', text: '', order: 2 }
  ])

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${questionId}`)
        if (!response.ok) {
          throw new Error('Pergunta não encontrada')
        }
        
        const question: Question = await response.json()
        
        setFormData({
          text: question.text,
          type: question.type,
          order: question.order,
          isActive: question.isActive
        })
        
        if (question.options && question.options.length > 0) {
          setOptions(question.options.map(opt => ({
            id: opt.id,
            text: opt.text,
            order: opt.order,
            isCorrect: opt.isCorrect,
            points: opt.points
          })))
        }
        
      } catch (error) {
        console.error('Erro ao buscar pergunta:', error)
        toast.error('Erro ao carregar pergunta')
        router.push('/admin?tab=questions')
      } finally {
        setIsFetching(false)
      }
    }

    if (questionId) {
      fetchQuestion()
    }
  }, [questionId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const addOption = () => {
    const newOption: Option = {
      id: Date.now().toString(),
      text: '',
      order: options.length + 1
    }
    setOptions([...options, newOption])
  }

  const removeOption = (optionId: string) => {
    if (options.length <= 2) {
      toast.error('É necessário ter pelo menos 2 opções')
      return
    }
    setOptions(options.filter(opt => opt.id !== optionId).map((opt, index) => ({
      ...opt,
      order: index + 1
    })))
  }

  const updateOption = (optionId: string, text: string) => {
    setOptions(options.map(opt => 
      opt.id === optionId ? { ...opt, text } : opt
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formData.text.trim()) {
      toast.error('O texto da pergunta é obrigatório')
      return
    }

    // Para perguntas de escolha, validar opções
    const validOptions = options.filter(opt => opt.text.trim())
    if (validOptions.length < 2) {
      toast.error('É necessário ter pelo menos 2 opções válidas')
      return
    }

    setIsLoading(true)

    try {
      // Preparar dados para envio
      const questionData: any = {
        text: formData.text.trim(),
        type: formData.type,
        order: formData.order,
        isActive: formData.isActive
      }

      // Adicionar opções
      const validOptionsForUpdate = options.filter(opt => opt.text.trim())
      questionData.options = validOptionsForUpdate.map((option: Option, index: number) => ({
        id: option.id,
        text: option.text.trim(),
        isCorrect: option.isCorrect || false,
        points: option.points || 0,
        order: index + 1
      }))

      // Atualizar pergunta
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro da API:', errorData)
        throw new Error(errorData.error || 'Erro ao atualizar pergunta')
      }

      const question = await response.json()

      toast.success('Pergunta atualizada com sucesso!')
      router.push('/admin?tab=questions')

    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar pergunta')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin?tab=questions')}
                className="flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Editar Pergunta</h1>
                <p className="text-slate-400">Editar pergunta existente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Pergunta */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Informações da Pergunta</h2>
            
            <div className="space-y-6">
              {/* Texto da Pergunta */}
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-slate-300 mb-2">
                  Texto da Pergunta *
                </label>
                <textarea
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Digite o texto da pergunta..."
                  required
                />
              </div>

              {/* Tipo e Ordem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo de Pergunta
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  >
                    <option value="SINGLE_CHOICE">Escolha Única</option>
                    <option value="MULTIPLE_CHOICE">Múltipla Escolha</option>
                    <option value="TEXT">Campo de Texto</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-slate-300 mb-2">
                    Ordem
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded text-cyan-500 focus:ring-cyan-500 focus:ring-2"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-slate-300">
                  Pergunta ativa
                </label>
              </div>
            </div>
          </div>

          {/* Opções */}
          {formData.type !== 'TEXT' && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Opções de Resposta</h2>
                <button
                  type="button"
                  onClick={addOption}
                  className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Opção
                </button>
              </div>

              <div className="space-y-4">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-400">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      placeholder={`Opção ${index + 1}`}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(option.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {options.length > 0 && (
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div className="text-sm text-slate-400">
                      <p className="font-medium mb-1">Dicas:</p>
                      <ul className="space-y-1 text-xs">
                        <li>É necessário ter pelo menos 2 opções</li>
                        <li>Todas as opções devem ter texto</li>
                        <li>A ordem define a sequência de exibição</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin?tab=questions')}
              className="flex-1 py-3 px-6 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Atualizando...' : 'Atualizar Pergunta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
