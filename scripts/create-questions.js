const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rtnkqeyioyjmouqwxyqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0bmtxZXlpb3lqbW91cXd4eXFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODA4NjEyMCwiZXhwIjoyMDkzNjYyMTIwfQ.Z6pzxYEo3-2QsrffQT4e8fjNzNB4EJzhK3TGdCgoLVc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createQuestions() {
  try {
    console.log('🔧 Criando perguntas do quiz...\n');

    // Limpar perguntas existentes
    console.log('🗑️  Limpando perguntas existentes...');
    const { error: deleteQuestionsError } = await supabase
      .from('questions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteQuestionsError) {
      console.error('❌ Erro ao limpar perguntas:', deleteQuestionsError);
    } else {
      console.log('✅ Perguntas existentes removidas');
    }

    // Limpar opções existentes
    const { error: deleteOptionsError } = await supabase
      .from('options')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteOptionsError) {
      console.error('❌ Erro ao limpar opções:', deleteOptionsError);
    } else {
      console.log('✅ Opções existentes removidas');
    }

    // Perguntas a serem criadas
    const questions = [
      {
        text: 'Seu caso seria implante unitário ou protocolo?',
        type: 'SINGLE_CHOICE',
        order: 1,
        isActive: true,
        options: [
          { text: 'Implante unitário', order: 1 },
          { text: 'Protocolo', order: 2 }
        ]
      },
      {
        text: 'Você já tem o Raio x?',
        type: 'SINGLE_CHOICE',
        order: 2,
        isActive: true,
        options: [
          { text: 'Sim', order: 1 },
          { text: 'Não', order: 2 }
        ]
      },
      {
        text: 'Qual dia e horário seria melhor para marcarmos uma avaliação sem compromisso?',
        type: 'SINGLE_CHOICE',
        order: 3,
        isActive: true,
        options: [
          { text: 'Manhã (8h-12h)', order: 1 },
          { text: 'Tarde (12h-18h)', order: 2 },
          { text: 'Noite (18h-20h)', order: 3 },
          { text: 'Sábado', order: 4 }
        ]
      },
      {
        text: 'Qual é sua maior dúvida sobre implantes?',
        type: 'SINGLE_CHOICE',
        order: 4,
        isActive: true,
        options: [
          { text: 'Valor do tratamento', order: 1 },
          { text: 'Dor do procedimento', order: 2 },
          { text: 'Tempo de recuperação', order: 3 },
          { text: 'Durabilidade do implante', order: 4 },
          { text: 'Outra dúvida', order: 5 }
        ]
      }
    ];

    // Criar perguntas e opções
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      console.log(`\n📝 Criando pergunta ${i + 1}: ${question.text}`);
      
      // Criar pergunta
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .insert({
          text: question.text,
          type: question.type,
          order: question.order,
          isActive: question.isActive
        })
        .select()
        .single();

      if (questionError) {
        console.error('❌ Erro ao criar pergunta:', questionError);
        continue;
      }

      console.log(`✅ Pergunta criada com ID: ${questionData.id}`);

      // Criar opções
      for (let j = 0; j < question.options.length; j++) {
        const option = question.options[j];
        
        const { data: optionData, error: optionError } = await supabase
          .from('options')
          .insert({
            text: option.text,
            isCorrect: false,
            points: 0,
            order: option.order,
            questionId: questionData.id
          })
          .select()
          .single();

        if (optionError) {
          console.error('❌ Erro ao criar opção:', optionError);
        } else {
          console.log(`   ✅ Opção "${option.text}" criada`);
        }
      }
    }

    // Verificar perguntas criadas
    console.log('\n🔍 Verificando perguntas criadas...');
    const { data: allQuestions, error: fetchError } = await supabase
      .from('questions')
      .select('*, options(*)')
      .order('order');

    if (fetchError) {
      console.error('❌ Erro ao buscar perguntas:', fetchError);
    } else {
      console.log(`\n✅ Total de perguntas criadas: ${allQuestions.length}`);
      allQuestions.forEach((q, index) => {
        console.log(`\n${index + 1}. ${q.text}`);
        console.log(`   Tipo: ${q.type} | Ordem: ${q.order} | Ativa: ${q.isActive}`);
        console.log(`   Opções: ${q.options.length}`);
        q.options.forEach(opt => {
          console.log(`     - ${opt.text}`);
        });
      });
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createQuestions();
