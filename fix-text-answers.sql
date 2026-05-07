-- =====================================================
-- Corrigir suporte a respostas textuais (políticas já existem)
-- Execute no SQL Editor do Supabase Dashboard
-- =====================================================

-- 1. Garantir que a tabela text_answers existe
CREATE TABLE IF NOT EXISTS "public"."text_answers" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "responseId" UUID NOT NULL REFERENCES "public"."responses"("id") ON DELETE CASCADE,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE "public"."text_answers" ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas se existirem (para evitar conflito) e recriar
DROP POLICY IF EXISTS "Allow public insert text_answers" ON "public"."text_answers";
DROP POLICY IF EXISTS "Allow admin read text_answers" ON "public"."text_answers";

CREATE POLICY "Allow public insert text_answers" ON "public"."text_answers"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read text_answers" ON "public"."text_answers"
    FOR SELECT USING (true);

-- 4. Criar índice
CREATE INDEX IF NOT EXISTS "idx_text_answers_responseId" ON "public"."text_answers"("responseId");

-- 5. Verificar se a constraint TEXT existe na tabela questions
ALTER TABLE "public"."questions" DROP CONSTRAINT IF EXISTS "questions_type_check";

ALTER TABLE "public"."questions" 
ADD CONSTRAINT "questions_type_check" 
CHECK ("type" IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT'));

-- =====================================================
-- VERIFICAÇÃO: ver se a tabela tem dados
-- =====================================================
SELECT COUNT(*) as total_text_answers FROM "public"."text_answers";
