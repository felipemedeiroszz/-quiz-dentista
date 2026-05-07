-- Adicionar TEXT ao enum QuestionType (se ainda não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'TEXT' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'QuestionType')) THEN
        ALTER TYPE "QuestionType" ADD VALUE 'TEXT';
    END IF;
END $$;

-- Criar tabela text_answers para respostas textuais
CREATE TABLE IF NOT EXISTS "text_answers" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "responseId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "text_answers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "text_answers_responseId_fkey" FOREIGN KEY ("responseId") 
        REFERENCES "responses"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Index para relacionamento
CREATE INDEX IF NOT EXISTS "text_answers_responseId_idx" ON "text_answers"("responseId");

-- Adicionar coluna whatsapp na tabela admins (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'admins' AND column_name = 'whatsapp') THEN
        ALTER TABLE "admins" ADD COLUMN "whatsapp" TEXT;
    END IF;
END $$;
