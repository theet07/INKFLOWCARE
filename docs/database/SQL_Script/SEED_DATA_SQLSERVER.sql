-- ============================================
-- SEED DATA - InkFlowCare Backend (SQL Server / Somee)
-- ============================================
-- Execute este script no painel do Somee (Query Tool)
-- As tabelas sao criadas automaticamente pelo JPA (ddl-auto)
-- Este script apenas POPULA os dados
-- ============================================

USE INKFLOW;
GO

-- ============================================
-- 1. BADGES (9 badges)
-- ============================================

SET IDENTITY_INSERT badges ON;

INSERT INTO badges (id, nome, descricao, icone, categoria, criterio_tipo, criterio_valor) VALUES
(1, N'Primeiro Passo', N'Complete o primeiro dia de cuidados', N'footsteps', N'CONCLUSAO', N'DIAS_COMPLETOS', 1),
(2, N'Semana Completa', N'Mantenha um streak de 7 dias', N'flame', N'STREAK', N'STREAK_DIAS', 7),
(3, N'Duas Semanas', N'Mantenha um streak de 14 dias', N'flash', N'STREAK', N'STREAK_DIAS', 14),
(4, N'Mestre dos Cuidados', N'Complete uma cicatrizacao inteira', N'trophy', N'CONCLUSAO', N'DIAS_COMPLETOS', 30),
(5, N'Perfeicao', N'100% em todos os dias completados', N'diamond', N'ESPECIAL', N'PERFEICAO', 100),
(6, N'Sabedoria', N'Acerte todos os quizzes disponiveis', N'bulb', N'XP', N'XP_TOTAL', 500),
(7, N'Inabalavel', N'Streak de 21+ dias consecutivos', N'shield-checkmark', N'STREAK', N'STREAK_DIAS', 21),
(8, N'Colecionador', N'Complete 3 ou mais cicatrizacoes', N'library', N'CONCLUSAO', N'CICATRIZACAO_TOTAL', 3),
(9, N'Hidratacao Pro', N'Aplique pomada todos os dias por 2 semanas', N'water', N'ESPECIAL', N'STREAK_DIAS', 14);

SET IDENTITY_INSERT badges OFF;
GO

-- ============================================
-- 2. DICAS DO DIA (30 dicas)
-- ============================================

SET IDENTITY_INSERT dicas ON;

INSERT INTO dicas (id, titulo, descricao, icone, dia_inicio, dia_fim) VALUES
-- Dia 1
(1, N'Remova o curativo', N'Apos 2-4 horas, remova o curativo com cuidado e lave com agua morna', N'bandage', 1, 1),
(2, N'Primeira lavagem', N'Use sabao neutro sem perfume e seque com papel toalha limpo', N'water-drop', 1, 1),
(3, N'Nao cubra novamente', N'Apos remover o curativo inicial, deixe a pele respirar', N'alert-circle', 1, 1),

-- Dias 2-3
(4, N'Hidratacao comeca', N'Aplique pomada cicatrizante 3x ao dia em camada fina', N'water-drop', 2, 3),
(5, N'Lave com cuidado', N'Use apenas as maos limpas, sem esponja ou bucha', N'hand-left', 2, 3),
(6, N'Evite sol', N'Nao exponha a tatuagem ao sol direto. Use roupas para cobrir', N'sunny', 3, 5),

-- Dias 4-6
(7, N'Roupas folgadas', N'Use roupas que nao apertem ou rocem na tatuagem', N'shirt', 4, 7),
(8, N'Observe sinais', N'Vermelhidao excessiva ou pus? Procure um medico', N'medical', 4, 7),
(9, N'Coceira e normal', N'A coceira indica cicatrizacao. Nao coce! Aplique pomada', N'hand-left', 5, 10),
(10, N'Beba agua', N'Hidratacao interna ajuda na cicatrizacao', N'water', 5, 30),
(11, N'Continue firme', N'Voce esta indo muito bem! Mantenha a rotina', N'checkmark-circle', 6, 6),
(12, N'Evite piscina', N'Nada de piscina ou mar por pelo menos 3 semanas', N'water', 6, 21),

-- Dia 7
(13, N'Descamacao', N'A pele vai comecar a descamar. Deixe cair naturalmente', N'leaf', 7, 14),
(14, N'Nao arranque cascas', N'Arrancar pode causar manchas e perda de cor', N'hand-left', 7, 14),
(15, N'Parabens - 1 semana!', N'Voce completou a primeira semana! Continue assim', N'trophy', 7, 7),

-- Dias 8-13
(16, N'Continue hidratando', N'Mesmo com descamacao, continue aplicando pomada', N'water-drop', 8, 14),
(17, N'Cores opacas?', N'E normal a tatuagem parecer opaca. Vai voltar ao normal', N'color-palette', 8, 14),

-- Dia 14
(18, N'Protetor solar', N'Ja pode usar FPS 50+ ao sair. O sol desbota a tatuagem!', N'sunny', 14, 30),
(19, N'2 semanas!', N'Metade do caminho! A cicatrizacao superficial esta quase completa', N'trophy', 14, 14),

-- Dias 15-20
(20, N'Retome atividades', N'Pode voltar a malhar, mas evite suor excessivo na area', N'fitness', 15, 21),
(21, N'Pele nova', N'A pele nova esta se formando. Continue cuidando', N'sparkles', 18, 25),

-- Dia 21
(22, N'Quase la!', N'A cicatrizacao superficial esta completa. Continue cuidando', N'checkmark-circle', 21, 21),
(23, N'3 semanas!', N'Voce e incrivel! Falta pouco para a cicatrizacao completa', N'trophy', 21, 21),

-- Dias 22-29
(24, N'Cores voltando', N'A tatuagem esta ganhando brilho e definicao', N'color-palette', 22, 29),
(25, N'Ultima semana!', N'Falta pouco! Mantenha a hidratacao e protecao solar', N'calendar', 25, 29),

-- Dia 30
(26, N'Parabens!', N'Cicatrizacao completa! Mantenha hidratacao e protecao solar', N'trophy', 30, 30),
(27, N'Cuidados permanentes', N'Use sempre protetor solar para preservar as cores', N'sunny', 30, 30),
(28, N'Retoque?', N'Se notar falhas, consulte seu artista para retoque gratuito', N'brush', 30, 30);

SET IDENTITY_INSERT dicas OFF;
GO

-- ============================================
-- 3. QUIZ PERGUNTAS (15 perguntas)
-- ============================================
-- checkpoint_dia_numero = numero do dia (7, 14, 21)

SET IDENTITY_INSERT quiz_perguntas ON;

INSERT INTO quiz_perguntas (id, checkpoint_dia_numero, pergunta, resposta_correta, explicacao, xp_bonus) VALUES
-- Quiz Dia 7
(1, 7, N'Qual e o melhor momento para aplicar pomada cicatrizante?', 1, N'A pomada deve ser aplicada sempre apos lavar e secar a tatuagem com papel toalha. Isso garante maxima absorcao.', 15),
(2, 7, N'Por que NAO se deve arrancar as casquinhas?', 1, N'Arrancar as casquinhas pode remover junto o pigmento da tinta, causando falhas e manchas permanentes na tatuagem.', 15),
(3, 7, N'Quantas vezes por dia deve-se lavar a tatuagem na fase inicial?', 1, N'Lavar 2-3 vezes ao dia com sabao neutro e o ideal. Pouco demais causa acumulo de bacterias, muito demais resseca.', 15),
(4, 7, N'Pode usar esponja ou bucha para lavar a tatuagem?', 3, N'Nunca use esponja ou bucha! Lave apenas com as maos limpas para nao irritar a pele.', 15),
(5, 7, N'O que fazer se sentir coceira intensa?', 2, N'Aplique pomada para aliviar. A coceira e normal e indica cicatrizacao, mas nao coce!', 15),

-- Quiz Dia 14
(6, 14, N'Quando pode usar protetor solar na tatuagem?', 2, N'O protetor solar so deve ser usado apos a cicatrizacao superficial completa (~2 semanas). Antes disso pode irritar.', 15),
(7, 14, N'Qual FPS minimo recomendado para proteger tatuagem?', 2, N'FPS 50+ e o minimo recomendado. O sol UV degrada o pigmento da tinta e desbota as cores com o tempo.', 15),
(8, 14, N'Pode ir a piscina apos 2 semanas?', 3, N'Ainda nao! Aguarde pelo menos 3 semanas. O cloro pode danificar a tatuagem.', 15),
(9, 14, N'A tatuagem esta opaca, e normal?', 0, N'Sim, e completamente normal! Durante a descamacao a tatuagem fica opaca, mas volta ao normal apos cicatrizar.', 15),
(10, 14, N'Pode voltar a malhar apos 2 semanas?', 0, N'Sim, mas com cuidado! Evite suor excessivo na area e roupas que rocem.', 15),

-- Quiz Dia 21
(11, 21, N'Apos 3 semanas, ainda precisa hidratar?', 0, N'Sim! Continue hidratando diariamente para manter a tatuagem bonita e as cores vivas.', 15),
(12, 21, N'Pode ir a praia apos 3 semanas?', 0, N'Sim, mas use protetor solar FPS 50+ e reaplique a cada 2 horas!', 15),
(13, 21, N'O que fazer se notar falhas na tatuagem?', 2, N'Consulte seu artista! A maioria oferece retoque gratuito para corrigir falhas.', 15),
(14, 21, N'Tatuagem desbota com o tempo?', 0, N'Sim, especialmente com exposicao solar. Use sempre protetor solar para preservar.', 15),
(15, 21, N'Precisa continuar usando pomada cicatrizante?', 3, N'Nao, pode trocar por hidratante comum sem perfume. A cicatrizacao esta completa.', 15);

SET IDENTITY_INSERT quiz_perguntas OFF;
GO

-- ============================================
-- 4. QUIZ OPCOES (60 opcoes - 4 por pergunta)
-- ============================================

INSERT INTO quiz_opcoes (pergunta_id, indice, texto) VALUES
-- Pergunta 1 (Dia 7)
(1, 0, N'Antes de lavar'),
(1, 1, N'Depois de lavar e secar'),
(1, 2, N'Junto com sabao'),
(1, 3, N'Nao precisa aplicar'),

-- Pergunta 2
(2, 0, N'Porque doi muito'),
(2, 1, N'Pode causar manchas e perda de cor'),
(2, 2, N'Nao faz diferenca'),
(2, 3, N'Demora mais para curar'),

-- Pergunta 3
(3, 0, N'1 vez'),
(3, 1, N'2-3 vezes'),
(3, 2, N'5 vezes'),
(3, 3, N'Nao precisa lavar'),

-- Pergunta 4
(4, 0, N'Sim, com cuidado'),
(4, 1, N'Sim, mas so esponja macia'),
(4, 2, N'So apos 1 semana'),
(4, 3, N'Nunca, so com as maos'),

-- Pergunta 5
(5, 0, N'Cocar levemente'),
(5, 1, N'Ignorar'),
(5, 2, N'Aplicar pomada'),
(5, 3, N'Lavar com agua gelada'),

-- Pergunta 6 (Dia 14)
(6, 0, N'Imediatamente'),
(6, 1, N'Apos 3 dias'),
(6, 2, N'Apos 2 semanas'),
(6, 3, N'Nunca'),

-- Pergunta 7
(7, 0, N'FPS 15'),
(7, 1, N'FPS 30'),
(7, 2, N'FPS 50+'),
(7, 3, N'Qualquer FPS'),

-- Pergunta 8
(8, 0, N'Sim, ja pode'),
(8, 1, N'Sim, mas so 10 minutos'),
(8, 2, N'So apos 1 mes'),
(8, 3, N'Aguarde pelo menos 3 semanas'),

-- Pergunta 9
(9, 0, N'Sim, e normal'),
(9, 1, N'Nao, procure um medico'),
(9, 2, N'So se tiver coceira'),
(9, 3, N'Depende da cor'),

-- Pergunta 10
(10, 0, N'Sim, com cuidado'),
(10, 1, N'Nao, aguarde 1 mes'),
(10, 2, N'So exercicios leves'),
(10, 3, N'Nunca mais'),

-- Pergunta 11 (Dia 21)
(11, 0, N'Sim, sempre'),
(11, 1, N'Nao, ja esta curada'),
(11, 2, N'So se estiver seca'),
(11, 3, N'So no inverno'),

-- Pergunta 12
(12, 0, N'Sim, com protetor solar'),
(12, 1, N'Nao, aguarde 2 meses'),
(12, 2, N'So se cobrir com roupa'),
(12, 3, N'Nunca mais'),

-- Pergunta 13
(13, 0, N'Ignorar, e normal'),
(13, 1, N'Tentar corrigir sozinho'),
(13, 2, N'Consultar o artista'),
(13, 3, N'Fazer outra tatuagem por cima'),

-- Pergunta 14
(14, 0, N'Sim, com exposicao solar'),
(14, 1, N'Nao, e permanente'),
(14, 2, N'So tatuagens coloridas'),
(14, 3, N'So tatuagens pretas'),

-- Pergunta 15
(15, 0, N'Sim, por mais 1 mes'),
(15, 1, N'Sim, para sempre'),
(15, 2, N'So se estiver seca'),
(15, 3, N'Nao, pode usar hidratante comum');
GO

-- ============================================
-- VERIFICACAO - Execute para confirmar dados
-- ============================================

SELECT 'badges' AS tabela, COUNT(*) AS total FROM badges
UNION ALL
SELECT 'dicas', COUNT(*) FROM dicas
UNION ALL
SELECT 'quiz_perguntas', COUNT(*) FROM quiz_perguntas
UNION ALL
SELECT 'quiz_opcoes', COUNT(*) FROM quiz_opcoes;
GO

-- ============================================
-- FIM DO SEED DATA (SQL Server / Somee)
-- ============================================
