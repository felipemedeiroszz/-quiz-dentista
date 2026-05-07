'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Settings, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  HelpCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Menu,
  X,
  LogOut,
  User,
  Lock,
  Mail,
  Phone,
  ChevronDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import { ChangePasswordModal } from '@/components/admin/ChangePasswordModal'

interface Question {
  id: string
  text: string
  type: string
  order: number
  isActive: boolean
  options: Option[]
}

interface Option {
  id: string
  text: string
  isCorrect: boolean
  points: number
  order: number
}

interface User {
  id: string
  name?: string
  email?: string
  whatsapp?: string
  createdAt: string
}

interface TextAnswer {
  id: string
  responseId: string
  text: string
}

interface Response {
  id: string
  userId: string
  questionId: string
  score: number
  createdAt: string
  user?: User
  question?: Question
  options?: ResponseOption[]
  textAnswers?: TextAnswer[]
}

interface ResponseOption {
  id: string
  responseId: string
  optionId: string
  option?: Option
}

interface Stats {
  totalQuestions: number
  activeQuestions: number
  totalResponses: number
  highScore: number
}

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<Response[]>([])
  const [stats, setStats] = useState<Stats>({
    totalQuestions: 0,
    activeQuestions: 0,
    totalResponses: 0,
    highScore: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [adminSettings, setAdminSettings] = useState({
    whatsapp: '',
    isSaving: false
  })

  useEffect(() => {
    checkAuth()
    fetchQuestions()
    fetchResponses()
    fetchAdminSettings()
  }, [])

  const toggleCardExpansion = (userId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth')
      if (!response.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
        setStats(prev => ({
          ...prev,
          totalQuestions: data.length,
          activeQuestions: data.filter((q: Question) => q.isActive).length
        }))
      }
    } catch (error) {
      toast.error('Erro ao carregar perguntas')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/responses')
      if (response.ok) {
        const data = await response.json()
        const responses = data.responses || []
        setResponses(responses)
        const highScore = Math.max(...responses.map((r: Response) => r.score), 0)
        setStats(prev => ({
          ...prev,
          totalResponses: responses.length,
          highScore
        }))
      }
    } catch (error) {
      toast.error('Erro ao carregar respostas')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta pergunta?\n\nEsta ação não pode ser desfeita.')
    if (!confirmed) return
    
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Pergunta excluída com sucesso')
        fetchQuestions()
      } else {
        toast.error('Erro ao excluir pergunta')
      }
    } catch (error) {
      toast.error('Erro ao excluir pergunta')
    }
  }

  const handleDeleteResponse = async (responseId: string, userName?: string) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir esta resposta?\n\n${userName ? `Usuário: ${userName}` : ''}\n\nEsta ação não pode ser desfeita.`
    )
    if (!confirmed) return
    
    try {
      const response = await fetch(`/api/responses/${responseId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Resposta excluída com sucesso')
        fetchResponses()
      } else {
        toast.error('Erro ao excluir resposta')
      }
    } catch (error) {
      toast.error('Erro ao excluir resposta')
    }
  }

  const handleDeleteAllUserResponses = async (userId: string, userName?: string, responseCount?: number) => {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir TODAS as respostas deste usuário?\n\n${userName ? `Usuário: ${userName}` : 'Usuário'}\n\nEsta ação excluirá ${responseCount || 0} resposta(s) e não pode ser desfeita.`
    )
    if (!confirmed) return
    
    try {
      const response = await fetch(`/api/responses/user/${userId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        toast.success('Todas as respostas do usuário foram excluídas')
        fetchResponses()
      } else {
        toast.error('Erro ao excluir respostas do usuário')
      }
    } catch (error) {
      toast.error('Erro ao excluir respostas do usuário')
    }
  }

  const fetchAdminSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setAdminSettings(prev => ({ ...prev, whatsapp: data.whatsapp || '' }))
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setAdminSettings(prev => ({ ...prev, isSaving: true }))
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          whatsapp: adminSettings.whatsapp
        })
      })

      if (response.ok) {
        toast.success('Configurações salvas com sucesso!')
      } else {
        throw new Error('Erro ao salvar configurações')
      }
    } catch (error) {
      toast.error('Erro ao salvar configurações')
      console.error(error)
    } finally {
      setAdminSettings(prev => ({ ...prev, isSaving: false }))
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      router.push('/admin/login')
    }
  }

  const exportResponses = () => {
    const csv = [
      ['Nome', 'Email', 'WhatsApp', 'Data', 'Score'],
      ...responses.map(r => [
        r.user?.name || '',
        r.user?.email || '',
        r.user?.whatsapp || '',
        new Date(r.createdAt).toLocaleDateString('pt-BR'),
        r.score
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `respostas_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredQuestions = questions.filter(q =>
    q.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredResponses = Array.isArray(responses) ? responses.filter(r =>
    r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  // Activity chart data (mock data for demonstration)
  const activityData = [65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 65, 80]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 h-screen sticky top-0 overflow-y-auto flex-shrink-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-xl font-bold text-white ${!sidebarOpen && 'hidden'}`}>
              Painel Quiz
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'questions' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Perguntas</span>}
            </button>

            <button
              onClick={() => setActiveTab('responses')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'responses' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Respostas</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3">Configurações</span>}
            </button>
          </nav>
        </div>

        {/* User Menu */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${sidebarOpen ? 'gap-3' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs text-slate-400">admin@quiz.com</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Alterar Senha"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'questions' && 'Perguntas'}
                {activeTab === 'responses' && 'Respostas'}
                {activeTab === 'settings' && 'Configurações'}
              </h1>
              <p className="text-slate-400">
                {activeTab === 'dashboard' && 'Visão geral do sistema'}
                {activeTab === 'questions' && 'Gerenciar perguntas do quiz'}
                {activeTab === 'responses' && 'Visualizar respostas dos usuários'}
                {activeTab === 'settings' && 'Configurar sistema e WhatsApp'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-400">Sistema Online</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-cyan-600 to-cyan-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-cyan-100">Total</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.totalQuestions}</div>
                  <div className="text-cyan-100 text-sm">Perguntas</div>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-green-100">Ativas</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.activeQuestions}</div>
                  <div className="text-green-100 text-sm">Perguntas</div>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-purple-100">Total</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.totalResponses}</div>
                  <div className="text-purple-100 text-sm">Respostas</div>
                </div>

                <div className="bg-gradient-to-br from-amber-600 to-amber-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-sm text-amber-100">Máximo</span>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stats.highScore}</div>
                  <div className="text-amber-100 text-sm">Score</div>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Atividade Recente</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                  {activityData.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-lg transition-all duration-300 hover:from-cyan-400 hover:to-cyan-300"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {h}%
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{i + 1}h</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveTab('questions')}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-2xl p-6 text-left hover:from-cyan-500 hover:to-cyan-400 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Nova Pergunta</h3>
                  <p className="text-cyan-100 text-sm">Adicionar pergunta ao quiz</p>
                </button>

                <button
                  onClick={() => setActiveTab('responses')}
                  className="bg-slate-900 rounded-2xl p-6 text-left border border-slate-800 hover:border-slate-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                    <Eye className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Ver Respostas</h3>
                  <p className="text-slate-400 text-sm">Visualizar respostas dos usuários</p>
                </button>

                <button
                  onClick={exportResponses}
                  className="bg-slate-900 rounded-2xl p-6 text-left border border-slate-800 hover:border-slate-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">Exportar CSV</h3>
                  <p className="text-slate-400 text-sm">Baixar dados em formato CSV</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar perguntas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={() => router.push('/admin/questions/new')}
                  className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Nova Pergunta
                </button>
              </div>

              {/* Questions Table */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Ordem</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Pergunta</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredQuestions.map((question, index) => (
                        <tr key={question.id} className="hover:bg-slate-800/50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-300">
                              {question.order}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-white font-medium line-clamp-2">{question.text}</p>
                            <p className="text-xs text-slate-500 mt-1">{question.options.length} opções</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              question.type === 'SINGLE_CHOICE' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}>
                              {question.type === 'SINGLE_CHOICE' ? 'Única' : 'Múltipla'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              question.isActive 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {question.isActive ? 'Ativa' : 'Inativa'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => router.push(`/admin/questions/${question.id}/edit`)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredQuestions.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Nenhuma pergunta encontrada</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'responses' && (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={exportResponses}
                  className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-green-500/20"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Exportar CSV
                </button>
              </div>

              {/* User Responses Cards */}
              <div className="space-y-4">
                {responses.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Nenhuma resposta encontrada</p>
                  </div>
                ) : (
                  // Agrupar respostas por usuário
                  Object.entries(
                    Array.isArray(responses) ? responses.reduce((acc, response) => {
                      const userId = response.userId;
                      if (!acc[userId]) {
                        acc[userId] = {
                          user: response.user,
                          responses: [],
                          createdAt: response.createdAt
                        };
                      }
                      acc[userId].responses.push(response);
                      return acc;
                    }, {} as Record<string, { user: any; responses: any[]; createdAt: string }>) : {}
                  )
                    .filter(([_, userData]) => {
                      const searchLower = searchQuery.toLowerCase();
                      return (
                        searchQuery === '' ||
                        userData.user?.name?.toLowerCase().includes(searchLower) ||
                        userData.user?.email?.toLowerCase().includes(searchLower)
                      );
                    })
                    .map(([userId, userData]) => (
                      <div key={userId} className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300 shadow-xl">
                        {/* User Header - Clicável */}
                        <button
                          onClick={() => toggleCardExpansion(userId)}
                          className="w-full p-6 border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors text-left"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                                {(userData.user?.name || 'A')[0].toUpperCase()}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {userData.user?.name || 'Anônimo'}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                  {userData.user?.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      {userData.user.email}
                                    </span>
                                  )}
                                  {userData.user?.whatsapp && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      {userData.user.whatsapp}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteAllUserResponses(userId, userData.user?.name, userData.responses?.length)
                                }}
                                className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all"
                                title="Excluir todas as respostas"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {userData.user?.whatsapp && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const cleanPhone = userData.user.whatsapp.replace(/\D/g, '')
                                    const message = encodeURIComponent('Olá! Vi suas respostas no quiz e gostaria de falar com você.')
                                    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
                                  }}
                                  className="p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-all"
                                  title="Abrir WhatsApp"
                                >
                                  <Phone className="w-4 h-4" />
                                </button>
                              )}
                              <div className="text-right">
                                <p className="text-xs text-slate-500">Data</p>
                                <p className="text-sm text-white">
                                  {new Date(userData.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                                expandedCards.has(userId) ? 'rotate-180' : ''
                              }`}>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* All Responses - Expansível */}
                        {expandedCards.has(userId) && (
                          <div className="p-6 border-t border-slate-800">
                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                              Todas as Respostas
                            </h4>
                            <div className="space-y-3">
                              {userData.responses
                                .sort((a, b) => a.question.order - b.question.order)
                                .map((response) => (
                                  <div key={response.id} className="bg-slate-800/40 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30">
                                    <div className="flex items-start gap-3">
                                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-medium text-cyan-400">
                                          {response.question.order}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                          <p className="text-sm text-white font-medium flex-1">
                                            {response.question.text}
                                          </p>
                                          <button
                                            onClick={() => handleDeleteResponse(response.id, userData.user?.name)}
                                            className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 transition-all flex-shrink-0"
                                            title="Excluir resposta"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {response.options && response.options.length > 0 ? (
                                            response.options.map((option: any) => (
                                              <span
                                                key={option.id}
                                                className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                              >
                                                {option.option.text}
                                              </span>
                                            ))
                                          ) : response.textAnswers && response.textAnswers.length > 0 ? (
                                            response.textAnswers.map((ta: any) => (
                                              <span
                                                key={ta.id}
                                                className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                              >
                                                {ta.text}
                                              </span>
                                            ))
                                          ) : (
                                            <span className="text-xs text-slate-500">Sem resposta</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* WhatsApp Configuration */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-400" />
                  Configuração do WhatsApp
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-300 mb-2">
                      Número do WhatsApp para receber orçamentos
                    </label>
                    <input
                      id="whatsapp"
                      type="text"
                      value={adminSettings.whatsapp}
                      onChange={(e) => setAdminSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="(XX) XXXXX-XXXX"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Este número receberá as solicitações de orçamento quando os usuários clicarem em "Receber orçamento agora"
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSaveSettings}
                      disabled={adminSettings.isSaving}
                      className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {adminSettings.isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Salvar Configurações
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Informações do Sistema
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Versão</span>
                    <span className="text-white font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800">
                    <span className="text-slate-400">Status</span>
                    <span className="text-green-400 font-medium flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Última atualização</span>
                    <span className="text-white font-medium">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      </main>
    </div>
  )
}
