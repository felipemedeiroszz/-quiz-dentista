const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rtnkqeyioyjmouqwxyqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bmtxZXlpb3lqbW91cXd4eXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4NjEyMCwiZXhwIjoyMDkzNjYyMTIwfQ.Z6pzxYEo3-2QsrffQT4e8fjNzNB4EJzhK3TGdCgoLVc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertQuestions() {
  try {
    console.log('🔧 Inserindo perguntas no Supabase...\n');

    // Limpar dados existentes
    console.log('🗑️  Limpando dados existentes...');
    await supabase.from('response_options').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('responses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('options').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Dados existentes limpos');

    // Dados das perguntas
    const questionsData = [
      {
        text: 'Seu caso seria implante unitário ou protocolo?',
        type: 'SINGLE_CHOICE',
        order: 1,
        isActive: true,
        options: ['Implante unitário', 'Protocolo']
      },
      {
        text: 'Você já tem o Raio x?',
        type: 'SINGLE_CHOICE',
        order: 2,
        isActive: true,
        options: ['Sim', 'Não']
      },
      {
        text: 'Qual dia e horário seria melhor para marcarmos uma avaliação sem compromisso?',
        type: 'SINGLE_CHOICE',
        order: 3,
        isActive: true,
        options: ['Manhã (8h-12h)', 'Tarde (12h-18h)', 'Noite (18h-20h)', 'Sábado']
      },
      {
        text: 'Qual é sua maior dúvida sobre implantes?',
        type: 'SINGLE_CHOICE',
        order: 4,
        isActive: true,
        options: ['Valor do tratamento', 'Dor do procedimento', 'Tempo de recuperação', 'Durabilidade do implante', 'Outra dúvida']
      }
    ];

    // Inserir perguntas e opções
    for (let i = 0; i < questionsData.length; i++) {
      const qData = questionsData[i];
      
      console.log(`\n📝 Inserindo pergunta ${i + 1}: ${qData.text}`);
      
      // Inserir pergunta
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
          text: qData.text,
          type: qData.type,
          order: qData.order,
          isActive: qData.isActive
        })
        .select()
        .single();

      if (questionError) {
        console.error('❌ Erro ao inserir pergunta:', questionError);
        continue;
      }

      console.log(`✅ Pergunta inserida com ID: ${question.id}`);

      // Inserir opções
      for (let j = 0; j < qData.options.length; j++) {
        const optionText = qData.options[j];
        
        const { data: option, error: optionError } = await supabase
          .from('options')
          .insert({
            text: optionText,
            isCorrect: false,
            points: 0,
            order: j + 1,
            questionId: question.id
          })
          .select()
          .single();

        if (optionError) {
          console.error('❌ Erro ao inserir opção:', optionError);
        } else {
          console.log(`   ✅ Opção "${optionText}" inserida`);
        }
      }
    }

    // Verificar inserção
    console.log('\n🔍 Verificando perguntas inseridas...');
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('*, options(*)')
      .order('order');

    if (fetchError) {
      console.error('❌ Erro ao buscar perguntas:', fetchError);
    } else {
      console.log(`\n✅ Total de perguntas inseridas: ${questions.length}`);
      questions.forEach((q, index) => {
        console.log(`\n${index + 1}. ${q.text}`);
        console.log(`   Tipo: ${q.type} | Ordem: ${q.order} | Ativa: ${q.isActive}`);
        console.log(`   Opções (${q.options.length}):`);
        q.options.forEach(opt => {
          console.log(`     - ${opt.text}`);
        });
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

insertQuestions();
