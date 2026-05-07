import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSettingsSchema = z.object({
  whatsapp: z.string().optional()
})

// GET - Obter configurações do admin
export async function GET(request: NextRequest) {
  try {
    const admin = await prisma.admin.findFirst({
      where: { email: 'admin@quiz.com' },
      select: {
        whatsapp: true
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Administrador não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      whatsapp: admin.whatsapp
    })

  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar configurações do admin
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateSettingsSchema.parse(body)

    const admin = await prisma.admin.updateMany({
      where: { email: 'admin@quiz.com' },
      data: {
        whatsapp: validatedData.whatsapp
      }
    })

    if (admin.count === 0) {
      return NextResponse.json(
        { error: 'Administrador não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    )
  }
}
