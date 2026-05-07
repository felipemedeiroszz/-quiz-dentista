import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// DELETE - Excluir todas as respostas de um usuário específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Excluir todas as respostas do usuário
    const result = await prisma.response.deleteMany({
      where: { userId }
    })

    return NextResponse.json({
      message: 'Respostas excluídas com sucesso',
      deletedCount: result.count
    })

  } catch (error) {
    console.error('Erro ao excluir respostas do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir respostas do usuário' },
      { status: 500 }
    )
  }
}
