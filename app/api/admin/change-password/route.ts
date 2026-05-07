import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
})

export async function POST(request: NextRequest) {
  try {
    // Verificar token JWT
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string }

    // Buscar admin
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin não encontrado' },
        { status: 404 }
      )
    }

    // Validar dados da requisição
    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      admin.password
    )

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 400 }
      )
    }

    // Verificar se a nova senha é diferente da atual
    const isSamePassword = await bcrypt.compare(
      validatedData.newPassword,
      admin.password
    )

    if (isSamePassword) {
      return NextResponse.json(
        { error: 'A nova senha deve ser diferente da atual' },
        { status: 400 }
      )
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 10)

    // Atualizar senha
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json(
      { message: 'Senha alterada com sucesso' },
      { status: 200 }
    )

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    console.error('Erro ao alterar senha:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
