-- =====================================================
-- Quiz System - Script SQL para PostgreSQL
-- Schema completo com todas as tabelas, tipos e dados iniciais
-- =====================================================

-- Criar tipo enum para tipos de pergunta
CREATE TYPE "QuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE');

-- =====================================================
-- TABELA: admins (Administradores do sistema)
-- =====================================================
CREATE TABLE "admins" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "admins_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "admins_email_key" UNIQUE ("email")
);

-- Index para busca por email
CREATE INDEX "admins_email_idx" ON "admins"("email");

-- =====================================================
-- TABELA: questions (Perguntas do quiz)
-- =====================================================
CREATE TABLE "questions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- Index para ordenação
CREATE INDEX "questions_order_idx" ON "questions"("order");
CREATE INDEX "questions_isActive_idx" ON "questions"("isActive");

-- =====================================================
-- TABELA: options (Opções de resposta)
-- =====================================================
CREATE TABLE "options" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,
    
    CONSTRAINT "options_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "options_questionId_fkey" FOREIGN KEY ("questionId") 
        REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index para relacionamento
CREATE INDEX "options_questionId_idx" ON "options"("questionId");
CREATE INDEX "options_order_idx" ON "options"("order");

-- =====================================================
-- TABELA: users (Usuários que respondem ao quiz)
-- =====================================================
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Index para busca
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_whatsapp_idx" ON "users"("whatsapp");

-- =====================================================
-- TABELA: responses (Respostas dos usuários)
-- =====================================================
CREATE TABLE "responses" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "responses_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "responses_userId_fkey" FOREIGN KEY ("userId") 
        REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "responses_questionId_fkey" FOREIGN KEY ("questionId") 
        REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index para relacionamentos
CREATE INDEX "responses_userId_idx" ON "responses"("userId");
CREATE INDEX "responses_questionId_idx" ON "responses"("questionId");
CREATE INDEX "responses_createdAt_idx" ON "responses"("createdAt");

-- =====================================================
-- TABELA: response_options (Opções selecionadas)
-- =====================================================
CREATE TABLE "response_options" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "responseId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    
    CONSTRAINT "response_options_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "response_options_responseId_fkey" FOREIGN KEY ("responseId") 
        REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "response_options_optionId_fkey" FOREIGN KEY ("optionId") 
        REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index para relacionamentos
CREATE INDEX "response_options_responseId_idx" ON "response_options"("responseId");
CREATE INDEX "response_options_optionId_idx" ON "response_options"("optionId");

-- =====================================================
-- TRIGGER: Atualizar updatedAt automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admins_updated_at
    BEFORE UPDATE ON "admins"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON "questions"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS: Admin padrão
-- Senha: admin123 (hash bcrypt)
-- =====================================================
INSERT INTO "admins" ("email", "password", "name") 
VALUES (
    'admin@quiz.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: 'password'
    'Administrador'
);

-- =====================================================
-- DADOS INICIAIS: Exemplo de perguntas e opções
-- =====================================================

-- Pergunta 1: Escolha Única
INSERT INTO "questions" ("text", "type", "order", "isActive") 
VALUES (
    'Qual é o principal problema que você enfrenta com seus dentes?',
    'SINGLE_CHOICE',
    1,
    true
);

INSERT INTO "options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Perdi dentes e preciso de implantes', false, 0, 1, (SELECT "id" FROM "questions" WHERE "order" = 1)),
    ('Dentadura solta que incomoda', false, 0, 2, (SELECT "id" FROM "questions" WHERE "order" = 1)),
    ('Dor ou sensibilidade nos dentes', false, 0, 3, (SELECT "id" FROM "questions" WHERE "order" = 1)),
    ('Quero melhorar meu sorriso', false, 0, 4, (SELECT "id" FROM "questions" WHERE "order" = 1));

-- Pergunta 2: Múltipla Escolha
INSERT INTO "questions" ("text", "type", "order", "isActive") 
VALUES (
    'Quais desses problemas você enfrenta atualmente? (Selecione todos que aplicam)',
    'MULTIPLE_CHOICE',
    2,
    true
);

INSERT INTO "options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Dificuldade para mastigar', false, 0, 1, (SELECT "id" FROM "questions" WHERE "order" = 2)),
    ('Vergonha de sorrir', false, 0, 2, (SELECT "id" FROM "questions" WHERE "order" = 2)),
    ('Dor constante', false, 0, 3, (SELECT "id" FROM "questions" WHERE "order" = 2)),
    ('Problemas de fala', false, 0, 4, (SELECT "id" FROM "questions" WHERE "order" = 2));

-- Pergunta 3: Escolha Única
INSERT INTO "questions" ("text", "type", "order", "isActive") 
VALUES (
    'Há quanto tempo você enfrenta esse problema?',
    'SINGLE_CHOICE',
    3,
    true
);

INSERT INTO "options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Menos de 6 meses', false, 0, 1, (SELECT "id" FROM "questions" WHERE "order" = 3)),
    ('Entre 6 meses e 1 ano', false, 0, 2, (SELECT "id" FROM "questions" WHERE "order" = 3)),
    ('Entre 1 e 3 anos', false, 0, 3, (SELECT "id" FROM "questions" WHERE "order" = 3)),
    ('Mais de 3 anos', false, 0, 4, (SELECT "id" FROM "questions" WHERE "order" = 3));

-- Pergunta 4: Escolha Única
INSERT INTO "questions" ("text", "type", "order", "isActive") 
VALUES (
    'Qual é sua faixa etária?',
    'SINGLE_CHOICE',
    4,
    true
);

INSERT INTO "options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('18-30 anos', false, 0, 1, (SELECT "id" FROM "questions" WHERE "order" = 4)),
    ('31-45 anos', false, 0, 2, (SELECT "id" FROM "questions" WHERE "order" = 4)),
    ('46-60 anos', false, 0, 3, (SELECT "id" FROM "questions" WHERE "order" = 4)),
    ('60+ anos', false, 0, 4, (SELECT "id" FROM "questions" WHERE "order" = 4));

-- Pergunta 5: Múltipla Escolha
INSERT INTO "questions" ("text", "type", "order", "isActive") 
VALUES (
    'O que você espera do tratamento odontológico?',
    'MULTIPLE_CHOICE',
    5,
    true
);

INSERT INTO "options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Voltar a mastigar normalmente', false, 0, 1, (SELECT "id" FROM "questions" WHERE "order" = 5)),
    ('Ter um sorriso bonito', false, 0, 2, (SELECT "id" FROM "questions" WHERE "order" = 5)),
    ('Eliminar dores', false, 0, 3, (SELECT "id" FROM "questions" WHERE "order" = 5)),
    ('Melhorar a autoestima', false, 0, 4, (SELECT "id" FROM "questions" WHERE "order" = 5));

-- Pergunta 6: Escolha Única
INSERT INTO "questions" ("text", "type", "order", "isActive") 
VALUES (
    'Qual sua disponibilidade para consulta?',
    'SINGLE_CHOICE',
    6,
    true
);

INSERT INTO "options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Manhã (8h-12h)', false, 0, 1, (SELECT "id" FROM "questions" WHERE "order" = 6)),
    ('Tarde (12h-18h)', false, 0, 2, (SELECT "id" FROM "questions" WHERE "order" = 6)),
    ('Noite (18h-20h)', false, 0, 3, (SELECT "id" FROM "questions" WHERE "order" = 6)),
    ('Sábado', false, 0, 4, (SELECT "id" FROM "questions" WHERE "order" = 6));

-- =====================================================
-- COMANDO PARA EXECUTAR:
-- psql -U seu_usuario -d seu_banco -f database.sql
-- 
-- OU no pgAdmin/CLI:
-- \i /caminho/para/database.sql
-- =====================================================

-- Atualizar senha do admin (opcional - após primeira execução)
-- UPDATE "admins" SET "password" = '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mqrq3L6B.Y' WHERE "email" = 'admin@quiz.com';
