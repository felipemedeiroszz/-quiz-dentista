'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { QuizContainer } from '@/components/quiz/QuizContainer'
import { UserDataForm } from '@/components/quiz/UserDataForm'
import { QuizResult } from '@/components/quiz/QuizResult'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Question {
  id: string
  text: string
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT'
  options: Array<{
    id: string
    text: string
    order: number
  }>
}

interface Answer {
  questionId: string
  optionIds: string[]
  textAnswer?: string
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUserDataForm, setShowUserDataForm] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const router = useRouter()

  // Carregar perguntas da API
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/questions')
        if (!response.ok) {
          throw new Error('Erro ao carregar perguntas')
        }
        const data = await response.json()
        setQuestions(data)
      } catch (error) {
        toast.error('Não foi possível carregar o quiz')
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [])

  const handleAnswer = (optionIds: string[], textAnswer?: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      optionIds,
      textAnswer
    }

    // Verificar se já existe resposta para esta pergunta
    const existingAnswerIndex = answers.findIndex(
      a => a.questionId === currentQuestion.id
    )

    let updatedAnswers: Answer[]
    if (existingAnswerIndex >= 0) {
      updatedAnswers = [...answers]
      updatedAnswers[existingAnswerIndex] = newAnswer
    } else {
      updatedAnswers = [...answers, newAnswer]
    }

    setAnswers(updatedAnswers)

    // Avançar para próxima pergunta ou finalizar
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Finalizar quiz - mostrar formulário de dados
      setShowUserDataForm(true)
    }
  }

  const [userData, setUserData] = useState<{
    name?: string
    email?: string
    whatsapp?: string
  }>()

  const handleUserDataSubmit = async (userDataSubmit: {
    name?: string
    email?: string
    whatsapp?: string
  }) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: userDataSubmit,
          answers
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar respostas')
      }

      const result = await response.json()
      setTotalScore(result.totalScore)
      setUserData(userDataSubmit)

      // Gerar URL do WhatsApp com os dados do quiz
      const quoteResponse = await fetch('/api/whatsapp/send-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userData: userDataSubmit,
          answers
        })
      })

      if (!quoteResponse.ok) {
        throw new Error('Erro ao gerar link do WhatsApp')
      }

      const quoteData = await quoteResponse.json()
      
      if (quoteData.whatsappUrl) {
        window.location.href = quoteData.whatsappUrl
      } else {
        throw new Error('URL do WhatsApp não gerada')
      }
      
    } catch (error) {
      toast.error('Erro ao salvar suas respostas')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setAnswers([])
    setShowUserDataForm(false)
    setShowResult(false)
    setTotalScore(0)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Quiz não disponível
          </h1>
          <p className="text-gray-600 mb-8">
            No momento não há perguntas disponíveis para o quiz.
          </p>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    )
  }

  if (showResult) {
    return (
      <QuizResult
        onGoHome={handleGoHome}
        userData={userData}
        answers={answers}
      />
    )
  }

  if (showUserDataForm) {
    return (
      <UserDataForm
        onSubmit={handleUserDataSubmit}
        onCancel={() => setShowUserDataForm(false)}
        isLoading={isLoading}
      />
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <QuizContainer
      question={currentQuestion}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      progress={progress}
      onAnswer={handleAnswer}
      canGoBack={currentQuestionIndex > 0}
      onBack={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
    />
  )
}
