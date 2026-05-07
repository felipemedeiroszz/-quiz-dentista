import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema de validação para atualizar pergunta
const updateQuestionSchema = z.object({
  text: z.string().min(1, 'Texto da pergunta é obrigatório').optional(),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT']).optional(),
  order: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  options: z.array(z.object({
    id: z.string().optional(),
    text: z.string().min(1, 'Texto da opção é obrigatório'),
    isCorrect: z.boolean(),
    points: z.number().int().min(0).default(0),
    order: z.number().int().positive()
  })).optional()
})

// GET - Obter pergunta específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        options: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Erro ao buscar pergunta:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pergunta' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar pergunta
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = updateQuestionSchema.parse(body)

    // Preparar dados para atualização
    const updateData: any = {
      text: validatedData.text,
      type: validatedData.type,
      order: validatedData.order,
      isActive: validatedData.isActive
    }

    // Se options foram fornecidas e não for TEXT, atualizar opções
    if (validatedData.options && validatedData.type !== 'TEXT') {
      // Primeiro, deletar todas as opções existentes
      await prisma.option.deleteMany({
        where: { questionId: params.id }
      })

      // Depois, criar as novas opções
      updateData.options = {
        create: validatedData.options.map(opt => ({
          text: opt.text,
          isCorrect: opt.isCorrect,
          points: opt.points,
          order: opt.order
        }))
      }
    } else if (validatedData.type === 'TEXT') {
      // Se mudou para TEXT, deletar todas as opções existentes
      await prisma.option.deleteMany({
        where: { questionId: params.id }
      })
    }

    const question = await prisma.question.update({
      where: { id: params.id },
      data: updateData,
      include: {
        options: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(question)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar pergunta:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pergunta' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir pergunta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.question.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Pergunta excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir pergunta:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir pergunta' },
      { status: 500 }
    )
  }
}
