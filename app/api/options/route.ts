import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para opção
const optionSchema = z.object({
  text: z.string().min(1, 'Texto da opção é obrigatório'),
  isCorrect: z.boolean().default(false),
  points: z.number().default(0),
  order: z.number().int().positive(),
  questionId: z.string().uuid('ID da pergunta inválido')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = optionSchema.parse(body)

    // Verificar se a pergunta existe
    const question = await prisma.question.findUnique({
      where: { id: validatedData.questionId }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    // Criar opção
    const option = await prisma.option.create({
      data: validatedData,
      include: {
        question: {
          select: {
            id: true,
            text: true,
            order: true
          }
        }
      }
    })

    return NextResponse.json(option, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao criar opção:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')

    if (!questionId) {
      return NextResponse.json(
        { error: 'ID da pergunta é obrigatório' },
        { status: 400 }
      )
    }

    const options = await prisma.option.findMany({
      where: { questionId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(options)

  } catch (error) {
    console.error('Erro ao buscar opções:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
