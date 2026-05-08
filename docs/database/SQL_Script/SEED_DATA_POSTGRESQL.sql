-- ============================================
-- SEED DATA - InkFlowCare Backend
-- ============================================
-- Execute este script após criar as tabelas
-- ============================================

-- ============================================
-- 1. BADGES (9 badges)
-- ============================================

INSERT INTO badges (nome, descricao, icone, categoria) VALUES
('Primeiro Passo', 'Complete o primeiro dia de cuidados', 'footsteps', 'CONCLUSAO'),
('Semana Completa', 'Mantenha um streak de 7 dias', 'flame', 'STREAK'),
('Duas Semanas', 'Mantenha um streak de 14 dias', 'flash', 'STREAK'),
('Mestre dos Cuidados', 'Complete uma cicatrização inteira', 'trophy', 'CONCLUSAO'),
('Perfeição', '100% em todos os dias completados', 'diamond', 'ESPECIAL'),
('Sabedoria', 'Acerte todos os quizzes disponíveis', 'bulb', 'XP'),
('Inabalável', 'Streak de 21+ dias consecutivos', 'shield-checkmark', 'STREAK'),
('Colecionador', 'Complete 3 ou mais cicatrizações', 'library', 'CONCLUSAO'),
('Hidratação Pro', 'Aplique pomada todos os dias por 2 semanas', 'water', 'ESPECIAL');

-- ============================================
-- 2. DICAS DO DIA (30 dicas)
-- ============================================

INSERT INTO dicas_dia (numero_dia, titulo, descricao, icone, tipo) VALUES
-- Dia 1
(1, 'Remova o curativo', 'Após 2-4 horas, remova o curativo com cuidado e lave com água morna', 'bandage', 'HIGIENE'),
(1, 'Primeira lavagem', 'Use sabão neutro sem perfume e seque com papel toalha limpo', 'water-drop', 'HIGIENE'),
(1, 'Não cubra novamente', 'Após remover o curativo inicial, deixe a pele respirar', 'alert-circle', 'HIGIENE'),

-- Dia 2
(2, 'Hidratação começa', 'Aplique pomada cicatrizante 3x ao dia em camada fina', 'water-drop', 'HIDRATACAO'),
(2, 'Lave com cuidado', 'Use apenas as mãos limpas, sem esponja ou bucha', 'hand-left', 'HIGIENE'),

-- Dia 3
(3, 'Evite sol', 'Não exponha a tatuagem ao sol direto. Use roupas para cobrir', 'sunny', 'ATIVIDADE'),
(3, 'Hidrate mais', 'Aumente a frequência se sentir a pele seca', 'water-drop', 'HIDRATACAO'),

-- Dia 4
(4, 'Roupas folgadas', 'Use roupas que não apertem ou rocem na tatuagem', 'shirt', 'ATIVIDADE'),
(4, 'Observe sinais', 'Vermelhidão excessiva ou pus? Procure um médico', 'medical', 'HIGIENE'),

-- Dia 5
(5, 'Coceira é normal', 'A coceira indica cicatrização. Não coce! Aplique pomada', 'hand-left', 'HIGIENE'),
(5, 'Beba água', 'Hidratação interna ajuda na cicatrização', 'water', 'ALIMENTACAO'),

-- Dia 6
(6, 'Continue firme', 'Você está indo muito bem! Mantenha a rotina', 'checkmark-circle', 'CONCLUSAO'),
(6, 'Evite piscina', 'Nada de piscina ou mar por pelo menos 3 semanas', 'water', 'ATIVIDADE'),

-- Dia 7
(7, 'Descamação', 'A pele vai começar a descamar. Deixe cair naturalmente', 'leaf', 'HIGIENE'),
(7, 'Não arranque cascas', 'Arrancar pode causar manchas e perda de cor', 'hand-left', 'HIGIENE'),
(7, 'Parabéns - 1 semana!', 'Você completou a primeira semana! Continue assim', 'trophy', 'CONCLUSAO'),

-- Dia 10
(10, 'Continue hidratando', 'Mesmo com descamação, continue aplicando pomada', 'water-drop', 'HIDRATACAO'),
(10, 'Cores opacas?', 'É normal a tatuagem parecer opaca. Vai voltar ao normal', 'color-palette', 'HIGIENE'),

-- Dia 14
(14, 'Protetor solar', 'Já pode usar FPS 50+ ao sair. O sol desbota a tatuagem!', 'sunny', 'HIDRATACAO'),
(14, '2 semanas!', 'Metade do caminho! A cicatrização superficial está quase completa', 'trophy', 'CONCLUSAO'),

-- Dia 15
(15, 'Retome atividades', 'Pode voltar a malhar, mas evite suor excessivo na área', 'fitness', 'ATIVIDADE'),

-- Dia 18
(18, 'Pele nova', 'A pele nova está se formando. Continue cuidando', 'sparkles', 'HIGIENE'),

-- Dia 21
(21, 'Quase lá!', 'A cicatrização superficial está completa. Continue cuidando', 'checkmark-circle', 'CONCLUSAO'),
(21, '3 semanas!', 'Você é incrível! Falta pouco para a cicatrização completa', 'trophy', 'CONCLUSAO'),

-- Dia 25
(25, 'Cores voltando', 'A tatuagem está ganhando brilho e definição', 'color-palette', 'CONCLUSAO'),

-- Dia 28
(28, 'Última semana!', 'Falta pouco! Mantenha a hidratação e proteção solar', 'calendar', 'CONCLUSAO'),

-- Dia 30
(30, 'Parabéns!', 'Cicatrização completa! Mantenha hidratação e proteção solar', 'trophy', 'CONCLUSAO'),
(30, 'Cuidados permanentes', 'Use sempre protetor solar para preservar as cores', 'sunny', 'HIDRATACAO'),
(30, 'Retoque?', 'Se notar falhas, consulte seu artista para retoque gratuito', 'brush', 'CONCLUSAO');

-- ============================================
-- 3. QUIZ PERGUNTAS (15 perguntas)
-- ============================================

-- Nota: Ajuste checkpoint_dia_id conforme seus dados
-- Assumindo que dia 7 = checkpoint_dia_id 7, dia 14 = 14, etc.

-- Quiz Dia 7 (5 perguntas)
INSERT INTO quiz_perguntas (checkpoint_dia_id, pergunta, resposta_correta, explicacao, xp_bonus) VALUES
(7, 'Qual é o melhor momento para aplicar pomada cicatrizante?', 1, 'A pomada deve ser aplicada sempre após lavar e secar a tatuagem com papel toalha. Isso garante máxima absorção.', 15),
(7, 'Por que NÃO se deve arrancar as casquinhas?', 1, 'Arrancar as casquinhas pode remover junto o pigmento da tinta, causando falhas e manchas permanentes na tatuagem.', 15),
(7, 'Quantas vezes por dia deve-se lavar a tatuagem na fase inicial?', 1, 'Lavar 2-3 vezes ao dia com sabão neutro é o ideal. Pouco demais causa acúmulo de bactérias, muito demais resseca.', 15),
(7, 'Pode usar esponja ou bucha para lavar a tatuagem?', 3, 'Nunca use esponja ou bucha! Lave apenas com as mãos limpas para não irritar a pele.', 15),
(7, 'O que fazer se sentir coceira intensa?', 2, 'Aplique pomada para aliviar. A coceira é normal e indica cicatrização, mas não coce!', 15);

-- Quiz Dia 14 (5 perguntas)
INSERT INTO quiz_perguntas (checkpoint_dia_id, pergunta, resposta_correta, explicacao, xp_bonus) VALUES
(14, 'Quando pode usar protetor solar na tatuagem?', 2, 'O protetor solar só deve ser usado após a cicatrização superficial completa (~2 semanas). Antes disso pode irritar.', 15),
(14, 'Qual FPS mínimo recomendado para proteger tatuagem?', 2, 'FPS 50+ é o mínimo recomendado. O sol UV degrada o pigmento da tinta e desbota as cores com o tempo.', 15),
(14, 'Pode ir à piscina após 2 semanas?', 3, 'Ainda não! Aguarde pelo menos 3 semanas. O cloro pode danificar a tatuagem.', 15),
(14, 'A tatuagem está opaca, é normal?', 0, 'Sim, é completamente normal! Durante a descamação a tatuagem fica opaca, mas volta ao normal após cicatrizar.', 15),
(14, 'Pode voltar a malhar após 2 semanas?', 0, 'Sim, mas com cuidado! Evite suor excessivo na área e roupas que rocem.', 15);

-- Quiz Dia 21 (5 perguntas)
INSERT INTO quiz_perguntas (checkpoint_dia_id, pergunta, resposta_correta, explicacao, xp_bonus) VALUES
(21, 'Após 3 semanas, ainda precisa hidratar?', 0, 'Sim! Continue hidratando diariamente para manter a tatuagem bonita e as cores vivas.', 15),
(21, 'Pode ir à praia após 3 semanas?', 0, 'Sim, mas use protetor solar FPS 50+ e reaplique a cada 2 horas!', 15),
(21, 'O que fazer se notar falhas na tatuagem?', 2, 'Consulte seu artista! A maioria oferece retoque gratuito para corrigir falhas.', 15),
(21, 'Tatuagem desbota com o tempo?', 0, 'Sim, especialmente com exposição solar. Use sempre protetor solar para preservar.', 15),
(21, 'Precisa continuar usando pomada cicatrizante?', 3, 'Não, pode trocar por hidratante comum sem perfume. A cicatrização está completa.', 15);

-- ============================================
-- 4. QUIZ OPÇÕES (60 opções - 4 por pergunta)
-- ============================================

-- Opções Quiz Dia 7
INSERT INTO quiz_opcoes (pergunta_id, opcao, ordem) VALUES
-- Pergunta 1
(1, 'Antes de lavar', 0),
(1, 'Depois de lavar e secar', 1),
(1, 'Junto com sabão', 2),
(1, 'Não precisa aplicar', 3),

-- Pergunta 2
(2, 'Porque dói muito', 0),
(2, 'Pode causar manchas e perda de cor', 1),
(2, 'Não faz diferença', 2),
(2, 'Demora mais para curar', 3),

-- Pergunta 3
(3, '1 vez', 0),
(3, '2-3 vezes', 1),
(3, '5 vezes', 2),
(3, 'Não precisa lavar', 3),

-- Pergunta 4
(4, 'Sim, com cuidado', 0),
(4, 'Sim, mas só esponja macia', 1),
(4, 'Só após 1 semana', 2),
(4, 'Nunca, só com as mãos', 3),

-- Pergunta 5
(5, 'Coçar levemente', 0),
(5, 'Ignorar', 1),
(5, 'Aplicar pomada', 2),
(5, 'Lavar com água gelada', 3),

-- Opções Quiz Dia 14
-- Pergunta 6
(6, 'Imediatamente', 0),
(6, 'Após 3 dias', 1),
(6, 'Após 2 semanas', 2),
(6, 'Nunca', 3),

-- Pergunta 7
(7, 'FPS 15', 0),
(7, 'FPS 30', 1),
(7, 'FPS 50+', 2),
(7, 'Qualquer FPS', 3),

-- Pergunta 8
(8, 'Sim, já pode', 0),
(8, 'Sim, mas só 10 minutos', 1),
(8, 'Só após 1 mês', 2),
(8, 'Aguarde pelo menos 3 semanas', 3),

-- Pergunta 9
(9, 'Sim, é normal', 0),
(9, 'Não, procure um médico', 1),
(9, 'Só se tiver coceira', 2),
(9, 'Depende da cor', 3),

-- Pergunta 10
(10, 'Sim, com cuidado', 0),
(10, 'Não, aguarde 1 mês', 1),
(10, 'Só exercícios leves', 2),
(10, 'Nunca mais', 3),

-- Opções Quiz Dia 21
-- Pergunta 11
(11, 'Sim, sempre', 0),
(11, 'Não, já está curada', 1),
(11, 'Só se estiver seca', 2),
(11, 'Só no inverno', 3),

-- Pergunta 12
(12, 'Sim, com protetor solar', 0),
(12, 'Não, aguarde 2 meses', 1),
(12, 'Só se cobrir com roupa', 2),
(12, 'Nunca mais', 3),

-- Pergunta 13
(13, 'Ignorar, é normal', 0),
(13, 'Tentar corrigir sozinho', 1),
(13, 'Consultar o artista', 2),
(13, 'Fazer outra tatuagem por cima', 3),

-- Pergunta 14
(14, 'Sim, com exposição solar', 0),
(14, 'Não, é permanente', 1),
(14, 'Só tatuagens coloridas', 2),
(14, 'Só tatuagens pretas', 3),

-- Pergunta 15
(15, 'Sim, por mais 1 mês', 0),
(15, 'Sim, para sempre', 1),
(15, 'Só se estiver seca', 2),
(15, 'Não, pode usar hidratante comum', 3);

-- ============================================
-- 5. GUIA CATEGORIAS (5 categorias)
-- ============================================

INSERT INTO guia_categorias (nome, icone, cor, ordem) VALUES
('Higiene', 'water-outline', '#4A90E2', 1),
('Hidratação', 'water-drop-outline', '#7ED321', 2),
('Alimentação', 'nutrition-outline', '#F5A623', 3),
('Atividades', 'fitness-outline', '#E21B3C', 4),
('Sinais de Alerta', 'warning-outline', '#FF4757', 5);

-- ============================================
-- 6. GUIA ARTIGOS (10 artigos)
-- ============================================

INSERT INTO guia_artigos (categoria_id, titulo, resumo, conteudo, icone, data_publicacao) VALUES
-- Higiene
(1, 'Como lavar sua tatuagem corretamente', 'Aprenda a técnica correta para lavar sem danificar', 
'# Como lavar sua tatuagem\n\n## Passo a passo\n\n1. Lave as mãos com sabão\n2. Molhe a tatuagem com água morna\n3. Aplique sabão neutro sem perfume\n4. Lave suavemente com as mãos (sem esponja)\n5. Enxágue bem\n6. Seque com papel toalha limpo\n\n## Frequência\n\n- Primeiros 7 dias: 2-3x ao dia\n- Após 7 dias: 1-2x ao dia\n\n## O que evitar\n\n- Água muito quente\n- Esponja ou bucha\n- Sabão com perfume\n- Esfregar com força', 
'water', '2025-01-01'),

(1, 'Produtos que você deve evitar', 'Lista de produtos que podem danificar sua tatuagem',
'# Produtos proibidos\n\n## Nunca use:\n\n- Álcool\n- Água oxigenada\n- Pomadas com corticoide\n- Produtos com perfume\n- Vaselina pura\n- Óleo de coco (primeiros dias)\n\n## Por quê?\n\nEstes produtos podem:\n- Ressecar a pele\n- Causar irritação\n- Remover pigmento\n- Atrasar cicatrização',
'close-circle', '2025-01-02'),

-- Hidratação
(2, 'Melhores pomadas cicatrizantes', 'Guia completo de produtos recomendados',
'# Pomadas recomendadas\n\n## Top 3\n\n1. **Bepantol Derma**\n   - Melhor para fase inicial\n   - Não contém perfume\n   - Absorção rápida\n\n2. **Vaseline Intensive Care**\n   - Ótima para hidratação\n   - Econômica\n   - Fácil de encontrar\n\n3. **Bepantol Líquido**\n   - Para pele muito seca\n   - Textura leve\n   - Não deixa resíduo',
'medical', '2025-01-03'),

-- Alimentação
(3, 'Alimentos que ajudam na cicatrização', 'O que comer para acelerar a recuperação',
'# Alimentação e cicatrização\n\n## Alimentos recomendados\n\n- **Proteínas**: Frango, peixe, ovos\n- **Vitamina C**: Laranja, limão, acerola\n- **Zinco**: Castanhas, sementes\n- **Água**: 2-3 litros por dia\n\n## Evite\n\n- Álcool (desidrata)\n- Excesso de sal\n- Alimentos muito processados',
'nutrition', '2025-01-04'),

-- Atividades
(4, 'Quando voltar a malhar', 'Guia para retomar exercícios físicos',
'# Exercícios e tatuagem\n\n## Timeline\n\n- **Primeiros 7 dias**: Evite totalmente\n- **7-14 dias**: Exercícios leves OK\n- **Após 14 dias**: Pode retomar normalmente\n\n## Cuidados\n\n- Use roupas folgadas\n- Limpe o suor imediatamente\n- Evite piscina por 3 semanas\n- Não faça exercícios que estiquem a área',
'fitness', '2025-01-05'),

(4, 'Praia e piscina: quando pode?', 'Tudo sobre exposição à água',
'# Água e tatuagem\n\n## Piscina\n\n- Aguarde **mínimo 3 semanas**\n- Cloro pode danificar\n- Use protetor solar antes\n\n## Mar\n\n- Aguarde **mínimo 3 semanas**\n- Sal pode irritar\n- Enxágue bem após\n\n## Banho\n\n- Banho rápido OK\n- Evite água muito quente\n- Não mergulhe a tatuagem',
'water', '2025-01-06'),

-- Sinais de Alerta
(5, 'Quando procurar um médico', 'Sinais de infecção e complicações',
'# Sinais de alerta\n\n## Procure médico se:\n\n- Vermelhidão excessiva após 3 dias\n- Febre\n- Pus ou secreção com odor\n- Inchaço que aumenta\n- Dor intensa\n- Listras vermelhas saindo da tatuagem\n\n## Prevenção\n\n- Mantenha sempre limpa\n- Não coce\n- Use pomada recomendada\n- Evite exposição a sujeira',
'warning', '2025-01-07'),

(5, 'Reações alérgicas: o que fazer', 'Como identificar e tratar alergias',
'# Alergias em tatuagens\n\n## Sintomas\n\n- Coceira intensa persistente\n- Inchaço localizado\n- Bolinhas vermelhas\n- Descamação excessiva\n\n## O que fazer\n\n1. Pare de usar pomadas\n2. Lave apenas com água\n3. Procure dermatologista\n4. Não use corticoide sem prescrição\n\n## Cores mais alergênicas\n\n- Vermelho (mais comum)\n- Amarelo\n- Verde',
'alert-circle', '2025-01-08');

-- ============================================
-- FIM DO SEED DATA
-- ============================================
