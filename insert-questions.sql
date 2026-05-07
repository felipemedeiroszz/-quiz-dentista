-- =====================================================
-- Quiz System - Script para Inserir Perguntas
-- Execute no SQL Editor do Supabase Dashboard
-- =====================================================

-- Limpar perguntas e opções existentes
DELETE FROM "public"."response_options";
DELETE FROM "public"."responses";
DELETE FROM "public"."options";
DELETE FROM "public"."questions";

-- Resetar sequências (se necessário)
-- ALTER SEQUENCE "public"."questions_id_seq" RESTART WITH 1;

-- =====================================================
-- INSERIR PERGUNTAS E OPÇÕES
-- =====================================================

-- Pergunta 1: Seu caso seria implante unitário ou protocolo?
INSERT INTO "public"."questions" ("text", "type", "order", "isActive")
VALUES (
    'Seu caso seria implante unitário ou protocolo?',
    'SINGLE_CHOICE',
    1,
    true
);

-- Opções da Pergunta 1
INSERT INTO "public"."options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Implante unitário', false, 0, 1, (SELECT "id" FROM "public"."questions" WHERE "order" = 1)),
    ('Protocolo', false, 0, 2, (SELECT "id" FROM "public"."questions" WHERE "order" = 1));

-- Pergunta 2: Você já tem o Raio x?
INSERT INTO "public"."questions" ("text", "type", "order", "isActive")
VALUES (
    'Você já tem o Raio x?',
    'SINGLE_CHOICE',
    2,
    true
);

-- Opções da Pergunta 2
INSERT INTO "public"."options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Sim', false, 0, 1, (SELECT "id" FROM "public"."questions" WHERE "order" = 2)),
    ('Não', false, 0, 2, (SELECT "id" FROM "public"."questions" WHERE "order" = 2));

-- Pergunta 3: Qual dia e horário seria melhor para marcarmos uma avaliação sem compromisso?
INSERT INTO "public"."questions" ("text", "type", "order", "isActive")
VALUES (
    'Qual dia e horário seria melhor para marcarmos uma avaliação sem compromisso?',
    'SINGLE_CHOICE',
    3,
    true
);

-- Opções da Pergunta 3
INSERT INTO "public"."options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Manhã (8h-12h)', false, 0, 1, (SELECT "id" FROM "public"."questions" WHERE "order" = 3)),
    ('Tarde (12h-18h)', false, 0, 2, (SELECT "id" FROM "public"."questions" WHERE "order" = 3)),
    ('Noite (18h-20h)', false, 0, 3, (SELECT "id" FROM "public"."questions" WHERE "order" = 3)),
    ('Sábado', false, 0, 4, (SELECT "id" FROM "public"."questions" WHERE "order" = 3));

-- Pergunta 4: Qual é sua maior dúvida sobre implantes?
INSERT INTO "public"."questions" ("text", "type", "order", "isActive")
VALUES (
    'Qual é sua maior dúvida sobre implantes?',
    'SINGLE_CHOICE',
    4,
    true
);

-- Opções da Pergunta 4
INSERT INTO "public"."options" ("text", "isCorrect", "points", "order", "questionId")
VALUES 
    ('Valor do tratamento', false, 0, 1, (SELECT "id" FROM "public"."questions" WHERE "order" = 4)),
    ('Dor do procedimento', false, 0, 2, (SELECT "id" FROM "public"."questions" WHERE "order" = 4)),
    ('Tempo de recuperação', false, 0, 3, (SELECT "id" FROM "public"."questions" WHERE "order" = 4)),
    ('Durabilidade do implante', false, 0, 4, (SELECT "id" FROM "public"."questions" WHERE "order" = 4)),
    ('Outra dúvida', false, 0, 5, (SELECT "id" FROM "public"."questions" WHERE "order" = 4));

-- =====================================================
-- VERIFICAÇÃO - Exibir perguntas criadas
-- =====================================================
SELECT 
    q."order" as "Ordem",
    q."text" as "Pergunta",
    q."type" as "Tipo",
    q."isActive" as "Ativa",
    COUNT(o."id") as "Qtd Opções"
FROM "public"."questions" q
LEFT JOIN "public"."options" o ON q."id" = o."questionId"
GROUP BY q."id", q."order", q."text", q."type", q."isActive"
ORDER BY q."order";

-- =====================================================
-- VERIFICAÇÃO - Exibir opções de cada pergunta
-- =====================================================
SELECT 
    q."order" as "Ordem",
    q."text" as "Pergunta",
    o."order" as "Opção",
    o."text" as "Resposta"
FROM "public"."questions" q
JOIN "public"."options" o ON q."id" = o."questionId"
ORDER BY q."order", o."order";

-- =====================================================
-- COMO EXECUTAR:
-- 1. Acesse o Supabase Dashboard: https://app.supabase.com
-- 2. Selecione seu projeto: rtnkqeyioyjmouqwxyqq
-- 3. Vá em: SQL Editor
-- 4. Cole este script completo
-- 5. Clique em: Run
-- 6. Verifique os resultados nas tabelas abaixo
-- =====================================================
