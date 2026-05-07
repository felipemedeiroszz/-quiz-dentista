const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Configuração do Supabase
const supabaseUrl = 'https://rtnkqeyioyjmouqwxyqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bmtxZXlpb3lqbW91cXd4eXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4NjEyMCwiZXhwIjoyMDkzNjYyMTIwfQ.Z6pzxYEo3-2QsrffQT4e8fjNzNB4EJzhK3TGdCgoLVc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  try {
    console.log('🔧 Criando administrador no Supabase...\n');

    // Hash da senha
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('📝 Inserindo admin com as seguintes credenciais:');
    console.log('   Email: admin@quiz.com');
    console.log('   Senha: admin123');
    console.log('   Hash:', hashedPassword.substring(0, 20) + '...\n');

    // Inserir admin na tabela
    const { data, error } = await supabase
      .from('admins')
      .insert({
        email: 'admin@quiz.com',
        password: hashedPassword,
        name: 'Administrador'
      })
      .select();

    if (error) {
      if (error.code === '23505') {
        console.log('✅ Admin já existe no banco de dados!');
        console.log('📧 Email: admin@quiz.com');
        console.log('🔑 Senha: admin123');
      } else {
        console.error('❌ Erro ao criar admin:', error);
      }
    } else {
      console.log('✅ Admin criado com sucesso!');
      console.log('📊 ID:', data[0].id);
      console.log('📧 Email:', data[0].email);
      console.log('👤 Nome:', data[0].name);
    }

    // Verificar se admin existe
    console.log('\n🔍 Verificando admin...');
    const { data: adminCheck, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'admin@quiz.com')
      .single();

    if (checkError) {
      console.error('❌ Erro ao verificar admin:', checkError);
    } else {
      console.log('✅ Admin encontrado no banco:');
      console.log('   ID:', adminCheck.id);
      console.log('   Email:', adminCheck.email);
      console.log('   Nome:', adminCheck.name);
      console.log('   Criado em:', adminCheck.createdAt);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createAdmin();
