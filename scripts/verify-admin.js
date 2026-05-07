const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Configuração do Supabase
const supabaseUrl = 'https://rtnkqeyioyjmouqwxyqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bmtxZXlpb3lqbW91cXd4eXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4NjEyMCwiZXhwIjoyMDkzNjYyMTIwfQ.Z6pzxYEo3-2QsrffQT4e8fjNzNB4EJzhK3TGdCgoLVc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAdmin() {
  try {
    console.log('🔍 Verificando credenciais do admin...\n');

    // Buscar admin no banco
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', 'admin@quiz.com')
      .single();

    if (error) {
      console.error('❌ Erro ao buscar admin:', error);
      return;
    }

    if (!admin) {
      console.error('❌ Admin não encontrado');
      return;
    }

    console.log('✅ Admin encontrado:');
    console.log('   ID:', admin.id);
    console.log('   Email:', admin.email);
    console.log('   Nome:', admin.name);
    console.log('   Senha hash:', admin.password.substring(0, 20) + '...');
    console.log('   Criado em:', admin.createdAt);

    // Testar senha
    const testPassword = 'admin123';
    console.log('\n🔑 Testando senha:', testPassword);
    
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password);
    
    if (isPasswordValid) {
      console.log('✅ Senha válida! Login deve funcionar.');
    } else {
      console.log('❌ Senha inválida!');
      console.log('🔄 Recriando admin com nova senha...');
      
      // Gerar novo hash
      const newPasswordHash = await bcrypt.hash(testPassword, 10);
      
      // Atualizar admin
      const { data: updatedAdmin, error: updateError } = await supabase
        .from('admins')
        .update({ password: newPasswordHash })
        .eq('email', 'admin@quiz.com')
        .select();

      if (updateError) {
        console.error('❌ Erro ao atualizar senha:', updateError);
      } else {
        console.log('✅ Senha atualizada com sucesso!');
        console.log('   Novo hash:', newPasswordHash.substring(0, 20) + '...');
        
        // Verificar novamente
        const isValidNow = await bcrypt.compare(testPassword, newPasswordHash);
        console.log('   Verificação pós-atualização:', isValidNow ? '✅ Válida' : '❌ Inválida');
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

verifyAdmin();
