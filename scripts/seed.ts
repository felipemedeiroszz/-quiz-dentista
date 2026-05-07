import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar admin inicial
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@quiz.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Administrador'
      }
    })

    console.log(`✅ Admin criado: ${admin.email}`)
  } else {
    console.log(`ℹ️  Admin já existe: ${existingAdmin.email}`)
  }

  // Criar perguntas de exemplo
  const existingQuestions = await prisma.question.count()
  
  if (existingQuestions === 0) {
    // Pergunta 1 - Escolha única
    const question1 = await prisma.question.create({
      data: {
        text: "Qual é a capital do Brasil?",
        type: "SINGLE_CHOICE",
        order: 1,
        options: {
          create: [
            { text: "São Paulo", isCorrect: false, points: 0, order: 1 },
            { text: "Rio de Janeiro", isCorrect: false, points: 0, order: 2 },
            { text: "Brasília", isCorrect: true, points: 10, order: 3 },
            { text: "Salvador", isCorrect: false, points: 0, order: 4 }
          ]
        }
      }
    })

    // Pergunta 2 - Múltipla escolha
    const question2 = await prisma.question.create({
      data: {
        text: "Quais são linguagens de programação? (Selecione todas corretas)",
        type: "MULTIPLE_CHOICE",
        order: 2,
        options: {
          create: [
            { text: "JavaScript", isCorrect: true, points: 5, order: 1 },
            { text: "Python", isCorrect: true, points: 5, order: 2 },
            { text: "HTML", isCorrect: false, points: 0, order: 3 },
            { text: "Java", isCorrect: true, points: 5, order: 4 }
          ]
        }
      }
    })

    // Pergunta 3 - Escolha única
    const question3 = await prisma.question.create({
      data: {
        text: "Em que ano o Next.js foi lançado?",
        type: "SINGLE_CHOICE",
        order: 3,
        options: {
          create: [
            { text: "2014", isCorrect: false, points: 0, order: 1 },
            { text: "2016", isCorrect: true, points: 10, order: 2 },
            { text: "2018", isCorrect: false, points: 0, order: 3 },
            { text: "2020", isCorrect: false, points: 0, order: 4 }
          ]
        }
      }
    })

    console.log(`✅ Criadas 3 perguntas de exemplo`)
  } else {
    console.log(`ℹ️  Já existem ${existingQuestions} perguntas no banco`)
  }

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
