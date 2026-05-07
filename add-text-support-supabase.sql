-- =====================================================
-- Adicionar suporte a respostas textuais no Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- =====================================================

-- 1. Adicionar coluna whatsapp na tabela admins (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'admins' AND column_name = 'whatsapp' AND table_schema = 'public') THEN
        ALTER TABLE "public"."admins" ADD COLUMN "whatsapp" TEXT;
    END IF;
END $$;

-- 2. Atualizar a constraint do tipo na tabela questions para incluir TEXT
-- Nota: No Supabase, precisamos dropar e recriar a constraint
ALTER TABLE "public"."questions" DROP CONSTRAINT IF EXISTS "questions_type_check";

ALTER TABLE "public"."questions" 
ADD CONSTRAINT "questions_type_check" 
CHECK ("type" IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT'));

-- 3. Criar tabela text_answers para respostas textuais
CREATE TABLE IF NOT EXISTS "public"."text_answers" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "responseId" UUID NOT NULL REFERENCES "public"."responses"("id") ON DELETE CASCADE,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Habilitar RLS na tabela text_answers
ALTER TABLE "public"."text_answers" ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas para a tabela text_answers
CREATE POLICY "Allow public insert text_answers" ON "public"."text_answers"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read text_answers" ON "public"."text_answers"
    FOR SELECT USING (true);

-- 6. Criar índice para performance
CREATE INDEX IF NOT EXISTS "idx_text_answers_responseId" ON "public"."text_answers"("responseId");

-- 7. Exemplo de pergunta textual (opcional)
INSERT INTO "public"."questions" ("text", "type", "order", "isActive")
VALUES (
    'Descreva brevemente qual tratamento odontológico você procura:',
    'TEXT',
    7,
    true
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se a tabela text_answers foi criada
SELECT 'text_answers table exists' as status 
WHERE EXISTS (SELECT 1 FROM information_schema.tables 
              WHERE table_name = 'text_answers' AND table_schema = 'public');

-- Verificar se o tipo TEXT foi adicionado
SELECT 'TEXT type added to questions' as status
WHERE EXISTS (SELECT 1 FROM information_schema.check_constraints 
              WHERE constraint_name = 'questions_type_check');

-- =====================================================
-- COMO USAR:
-- 1. Acesse o SQL Editor no Dashboard do Supabase
-- 2. Cole este script completo
-- 3. Execute (Run)
-- 4. Verifique se as tabelas foram criadas em Table Editor
-- =====================================================
