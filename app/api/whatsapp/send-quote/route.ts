import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const sendQuoteSchema = z.object({
  userData: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    whatsapp: z.string().optional()
  }).optional(),
  answers: z.array(z.object({
    questionId: z.string(),
    optionIds: z.array(z.string()),
    textAnswer: z.string().optional()
  }))
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = sendQuoteSchema.parse(body)

    // Buscar configuração do WhatsApp do admin
    const admin = await prisma.admin.findFirst({
      where: { email: 'admin@quiz.com' }
    })

    if (!admin?.whatsapp) {
      return NextResponse.json(
        { error: 'WhatsApp do administrador não configurado' },
        { status: 400 }
      )
    }

    // Buscar detalhes das perguntas e respostas
    const questionsWithAnswers = await Promise.all(
      validatedData.answers.map(async (answer) => {
        const question = await prisma.question.findUnique({
          where: { id: answer.questionId },
          include: {
            options: {
              where: { id: { in: answer.optionIds } }
            }
          }
        })

        if (!question) {
          throw new Error(`Pergunta ${answer.questionId} não encontrada`)
        }

        const answerTexts = answer.textAnswer
          ? [answer.textAnswer]
          : question.options.map(option => option.text)

        return {
          question: question.text,
          order: question.order,
          answers: answerTexts
        }
      })
    )

    // Ordenar perguntas
    questionsWithAnswers.sort((a, b) => a.order - b.order)

    // Formatar mensagem para WhatsApp
    const userName = validatedData.userData?.name || 'Cliente'
    const userEmail = validatedData.userData?.email || 'Não informado'
    const userWhatsapp = validatedData.userData?.whatsapp || 'Não informado'

    let message = `*NOVA SOLICITAÇÃO DE ORÇAMENTO*\n\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `*DADOS DO CLIENTE*\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`
    message += `*Nome:* ${userName}\n`
    message += `*Email:* ${userEmail}\n`
    message += `*WhatsApp:* ${userWhatsapp}\n\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `*RESPOSTAS DO QUIZ*\n`
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

    questionsWithAnswers.forEach((qa, index) => {
      message += `*Pergunta ${qa.order}:*\n`
      message += `${qa.question}\n\n`
      message += `*Resposta:* ${qa.answers.join(', ')}\n`
      if (index < questionsWithAnswers.length - 1) {
        message += `\n`
      }
    })

    message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    message += `*Data:* ${new Date().toLocaleDateString('pt-BR')}\n`
    message += `*Hora:* ${new Date().toLocaleTimeString('pt-BR')}\n`

    // Limpar número de telefone do admin
    const cleanAdminPhone = admin.whatsapp.replace(/\D/g, '')
    
    // Criar URL do WhatsApp
    const whatsappUrl = `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(message)}`

    return NextResponse.json({
      success: true,
      message: 'Mensagem formatada com sucesso',
      whatsappUrl,
      formattedMessage: message
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao enviar orçamento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação de orçamento' },
      { status: 500 }
    )
  }
}
