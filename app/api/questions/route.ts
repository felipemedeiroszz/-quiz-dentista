import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para criar pergunta
const createQuestionSchema = z.object({
  text: z.string().min(1, 'Texto da pergunta é obrigatório'),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT']),
  order: z.number().int().positive(),
  options: z.array(z.object({
    text: z.string().min(1, 'Texto da opção é obrigatório'),
    isCorrect: z.boolean(),
    points: z.number().int().min(0).default(0),
    order: z.number().int().positive()
  })).min(2, 'Mínimo 2 opções são necessárias').optional()
}).refine((data) => {
  // Se não for TEXT, deve ter opções
  if (data.type !== 'TEXT' && (!data.options || data.options.length < 2)) {
    return false
  }
  return true
}, {
  message: 'Perguntas de escolha requerem pelo menos 2 opções',
  path: ['options']
})

// GET - Obter todas as perguntas ativas
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        options: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perguntas' },
      { status: 500 }
    )
  }
}

// POST - Criar nova pergunta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received data:', body)
    const validatedData = createQuestionSchema.parse(body)

    // Criar pergunta com opções (apenas se não for TEXT)
    const questionData: any = {
      text: validatedData.text,
      type: validatedData.type,
      order: validatedData.order
    }

    // Adicionar opções apenas se não for TEXT e se opções foram fornecidas
    if (validatedData.type !== 'TEXT' && validatedData.options) {
      questionData.options = {
        create: validatedData.options
      }
    }

    const question = await prisma.question.create({
      data: questionData,
      include: {
        options: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors)
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao criar pergunta:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pergunta' },
      { status: 500 }
    )
  }
}
