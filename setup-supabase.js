// Script para configurar DATABASE_URL do Supabase
const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando Supabase para o Quiz System...\n');

// Ler .env.local atual
const envPath = path.join(__dirname, '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Arquivo .env.local encontrado');
} else {
  console.log('❌ Arquivo .env.local não encontrado');
  console.log('\n📝 Por favor, crie o arquivo .env.local com o seguinte conteúdo:\n');
  console.log(`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rtnkqeyioyjmouqwxyqq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_r3-hH__BXMz-cAU-3jqzSg_RNgGtHCG

# Database Configuration (ATUALIZE A SENHA ABAIXO)
DATABASE_URL="postgresql://postgres:[SUA_SENHA_AQUI]@db.rtnkqeyioyjmouqwxyqq.supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Admin User (for initial setup)
ADMIN_EMAIL="admin@quiz.com"
ADMIN_PASSWORD="admin123"`);
  process.exit(1);
}

// Verificar se DATABASE_URL está configurada
if (!envContent.includes('DATABASE_URL')) {
  console.log('❌ DATABASE_URL não encontrada no .env.local');
  console.log('\n📝 Adicione a seguinte linha ao seu .env.local:');
  console.log('DATABASE_URL="postgresql://postgres:[SUA_SENHA_AQUI]@db.rtnkqeyioyjmouqwxyqq.supabase.co:5432/postgres"');
  console.log('\n🔑 Para obter a senha:');
  console.log('1. Acesse: https://app.supabase.com');
  console.log('2. Selecione seu projeto: rtnkqeyioyjmouqwxyqq');
  console.log('3. Vá em: Settings → Database → Connection string');
  console.log('4. Copie a senha e substitua [SUA_SENHA_AQUI]');
} else {
  console.log('✅ DATABASE_URL encontrada');
}

// Verificar se a senha foi atualizada
if (envContent.includes('[PASSWORD]') || envContent.includes('[SUA_SENHA_AQUI]')) {
  console.log('⚠️  Você precisa atualizar a senha do banco de dados!');
  console.log('\n🔑 Para obter a senha:');
  console.log('1. Acesse: https://app.supabase.com');
  console.log('2. Selecione seu projeto: rtnkqeyioyjmouqwxyqq');
  console.log('3. Vá em: Settings → Database → Connection string');
  console.log('4. Copie a senha e substitua o placeholder');
} else {
  console.log('✅ DATABASE_URL parece configurada');
}

console.log('\n🚀 Após configurar, execute:');
console.log('   npm run dev');
console.log('\n📊 Para sincronizar o banco:');
console.log('   npx prisma db push');
