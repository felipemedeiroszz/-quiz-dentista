import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para criar resposta
const createResponseSchema = z.object({
  user: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    whatsapp: z.string().optional()
  }).optional(),
  answers: z.array(z.object({
    questionId: z.string(),
    optionIds: z.array(z.string()), // Para múltipla escolha
    textAnswer: z.string().optional() // Para respostas textuais
  }))
})

// POST - Criar resposta do usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createResponseSchema.parse(body)

    // Criar usuário (se fornecido)
    let user = null
    if (validatedData.user && (validatedData.user.name || validatedData.user.email)) {
      user = await prisma.user.create({
        data: validatedData.user
      })
    }

    let totalScore = 0

    // Processar cada resposta
    const responses = await Promise.all(
      validatedData.answers.map(async (answer) => {
        // Buscar a pergunta e opções corretas
        const question = await prisma.question.findUnique({
          where: { id: answer.questionId },
          include: {
            options: true
          }
        })

        if (!question) {
          throw new Error(`Pergunta ${answer.questionId} não encontrada`)
        }

        // Calcular pontuação
        let score = 0
        if (question.type === 'TEXT' as any) {
          // Para respostas textuais, não há pontuação automática
          score = 0
        } else if (question.type === 'SINGLE_CHOICE') {
          // Para escolha única, verifica se a opção selecionada é correta
          const selectedOption = await prisma.option.findFirst({
            where: { 
              id: answer.optionIds[0],
              questionId: answer.questionId 
            }
          })
          score = selectedOption?.isCorrect ? selectedOption.points : 0
        } else {
          // Para múltipla escolha, soma pontos das opções corretas selecionadas
          const selectedOptions = await prisma.option.findMany({
            where: { 
              id: { in: answer.optionIds },
              questionId: answer.questionId 
            }
          })
          score = selectedOptions.reduce((sum, option) => sum + (option.isCorrect ? option.points : 0), 0)
        }

        totalScore += score

        // Criar resposta
        const responseData: any = {
          userId: user?.id,
          questionId: answer.questionId,
          score
        }

        // Adicionar opções apenas se não for pergunta textual
        if (question.type !== 'TEXT' as any && answer.optionIds.length > 0) {
          responseData.options = {
            create: answer.optionIds.map(optionId => ({
              optionId
            }))
          }
        }

        // Adicionar resposta textual apenas se for pergunta textual
        if (question.type === 'TEXT' as any && answer.textAnswer) {
          responseData.textAnswers = {
            create: {
              text: answer.textAnswer
            }
          }
        }

        return prisma.response.create({
          data: responseData
        })
      })
    )

    return NextResponse.json({
      message: 'Respostas salvas com sucesso',
      totalScore,
      responses,
      user
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao salvar respostas:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar respostas' },
      { status: 500 }
    )
  }
}

// GET - Obter todas as respostas (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : 10000
    const skip = (page - 1) * limit

    const [responses, total] = await Promise.all([
      prisma.response.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          question: {
            include: {
              options: true
            }
          },
          options: {
            include: {
              option: true
            }
          },
          textAnswers: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.response.count()
    ])

    return NextResponse.json({
      responses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erro ao buscar respostas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar respostas' },
      { status: 500 }
    )
  }
}
