-- =====================================================
-- Quiz System - Script SQL para Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- =====================================================

-- Habilitar extensão UUID se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: admins (Administradores do sistema)
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."admins" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE "public"."admins" ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (apenas para autenticação)
CREATE POLICY "Allow public read" ON "public"."admins"
    FOR SELECT USING (true);

-- =====================================================
-- TABELA: questions (Perguntas do quiz)
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."questions" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL CHECK ("type" IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE')),
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;

-- Política pública para leitura
CREATE POLICY "Allow public read questions" ON "public"."questions"
    FOR SELECT USING (true);

-- Política para admin gerenciar
CREATE POLICY "Allow admin manage questions" ON "public"."questions"
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- TABELA: options (Opções de resposta)
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."options" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL,
    "questionId" UUID NOT NULL REFERENCES "public"."questions"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE "public"."options" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read options" ON "public"."options"
    FOR SELECT USING (true);

CREATE POLICY "Allow admin manage options" ON "public"."options"
    FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- TABELA: users (Usuários que respondem ao quiz)
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert users" ON "public"."users"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read users" ON "public"."users"
    FOR SELECT USING (true);

-- =====================================================
-- TABELA: responses (Respostas dos usuários)
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."responses" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "questionId" UUID NOT NULL REFERENCES "public"."questions"("id") ON DELETE CASCADE,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE "public"."responses" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert responses" ON "public"."responses"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read responses" ON "public"."responses"
    FOR SELECT USING (true);

-- =====================================================
-- TABELA: response_options (Opções selecionadas)
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."response_options" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "responseId" UUID NOT NULL REFERENCES "public"."responses"("id") ON DELETE CASCADE,
    "optionId" UUID NOT NULL REFERENCES "public"."options"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE "public"."response_options" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert response_options" ON "public"."response_options"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read response_options" ON "public"."response_options"
    FOR SELECT USING (true);

-- =====================================================
-- INDEXES para performance
-- =====================================================
CREATE INDEX IF NOT EXISTS "idx_admins_email" ON "public"."admins"("email");
CREATE INDEX IF NOT EXISTS "idx_questions_order" ON "public"."questions"("order");
CREATE INDEX IF NOT EXISTS "idx_questions_isActive" ON "public"."questions"("isActive");
CREATE INDEX IF NOT EXISTS "idx_options_questionId" ON "public"."options"("questionId");
CREATE INDEX IF NOT EXISTS "idx_options_order" ON "public"."options"("order");
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "public"."users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_whatsapp" ON "public"."users"("whatsapp");
CREATE INDEX IF NOT EXISTS "idx_responses_userId" ON "public"."responses"("userId");
CREATE INDEX IF NOT EXISTS "idx_responses_questionId" ON "public"."responses"("questionId");
CREATE INDEX IF NOT EXISTS "idx_responses_createdAt" ON "public"."responses"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_response_options_responseId" ON "public"."response_options"("responseId");
CREATE INDEX IF NOT EXISTS "idx_response_options_optionId" ON "public"."response_options"("optionId");

-- =====================================================
-- FUNCTION: Atualizar updatedAt automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática
DROP TRIGGER IF EXISTS "update_admins_updated_at" ON "public"."admins";
CREATE TRIGGER "update_admins_updated_at"
    BEFORE UPDATE ON "public"."admins"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at_column"();

DROP TRIGGER IF EXISTS "update_questions_updated_at" ON "public"."questions";
CREATE TRIGGER "update_questions_updated_at"
    BEFORE UPDATE ON "public"."questions"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_updated_at_column"();

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Admin padrão (senha: admin123)
INSERT INTO "public"."admins" ("email", "password", "name")
VALUES (
    'admin@quiz.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Administrador'
)
ON CONFLICT ("email") DO NOTHING;

-- Pergunta 1
INSERT INTO "public"."questions" ("text", "type", "order", "isActive")
VALUES (
    'Qual é o principal problema que você enfrenta com seus dentes?',
    'SINGLE_CHOICE',
    1,
    true
)
RETURNING "id";

-- (As demais perguntas devem ser inseridas via API ou manualmente no painel)

-- =====================================================
-- COMO USAR NO SUPABASE:
-- 1. Acesse o SQL Editor no Dashboard do Supabase
-- 2. Cole este script completo
-- 3. Execute (Run)
-- 4. Verifique se as tabelas foram criadas em Table Editor
-- =====================================================
