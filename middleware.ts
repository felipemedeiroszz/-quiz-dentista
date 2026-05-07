import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Rotas que não precisam de autenticação
const publicRoutes = ['/admin/login', '/api/admin/login', '/', '/quiz']

// Rotas de admin que precisam de autenticação
const adminRoutes = ['/admin', '/api/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Se for rota pública, permitir acesso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Se for rota de admin, verificar autenticação
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      // Redirecionar para login se não tiver token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Verificar se o token é válido
      jwt.verify(token, process.env.JWT_SECRET!)
      return NextResponse.next()
    } catch (error) {
      // Token inválido, redirecionar para login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)']
}
