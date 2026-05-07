import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Verificar se o token existe nos cookies
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      adminId: string
      email: string
    }

    // Buscar admin no banco para confirmar que ainda existe
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        email: true,
        name: true
      }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin não encontrado' },
        { status: 401 }
      )
    }

    // Token válido - retornar dados do admin
    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    })

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    console.error('Erro na autenticação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
