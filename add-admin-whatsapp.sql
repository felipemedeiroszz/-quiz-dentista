-- Adicionar campo de WhatsApp na tabela de admins
ALTER TABLE admins ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

-- Inserir valor padrão para o admin existente (se houver)
UPDATE admins SET whatsapp = '(16) 99381-7699' WHERE email = 'admin@quiz.com' AND whatsapp IS NULL;
