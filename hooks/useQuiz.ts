import { useState, useEffect } from 'react';
import api from '@/services/api';

export interface QuizQuestion {
  id: number;
  pergunta: string;
  opcoes: string[];
  respostaCorreta: number; // índice 0-3
  explicacao: string;
  xpBonus: number;
}

const MOCK_QUIZZES: Record<number, QuizQuestion[]> = {
  7: [
    {
      id: 1,
      pergunta: 'Qual é o melhor momento para aplicar pomada cicatrizante?',
      opcoes: ['Antes de lavar', 'Depois de lavar e secar', 'Junto com sabão', 'Não precisa aplicar'],
      respostaCorreta: 1,
      explicacao: 'A pomada deve ser aplicada sempre após lavar e secar a tatuagem com papel toalha. Isso garante máxima absorção.',
      xpBonus: 15,
    },
    {
      id: 2,
      pergunta: 'Por que NÃO se deve arrancar as casquinhas?',
      opcoes: ['Dói muito', 'Pode causar manchas e perda de cor', 'Não faz diferença', 'Demora mais para curar'],
      respostaCorreta: 1,
      explicacao: 'Arrancar as casquinhas pode remover junto o pigmento da tinta, causando falhas e manchas permanentes na tatuagem.',
      xpBonus: 15,
    },
    {
      id: 3,
      pergunta: 'Quantas vezes por dia deve-se lavar a tatuagem na fase inicial?',
      opcoes: ['1 vez', '2-3 vezes', '5 vezes', 'Não precisa lavar'],
      respostaCorreta: 1,
      explicacao: 'Lavar 2-3 vezes ao dia com sabão neutro é o ideal. Pouco demais causa acúmulo de bactérias, muito demais resseca.',
      xpBonus: 15,
    },
  ],
  14: [
    {
      id: 4,
      pergunta: 'Quando pode usar protetor solar na tatuagem?',
      opcoes: ['Imediatamente', 'Após 3 dias', 'Após 2 semanas', 'Nunca'],
      respostaCorreta: 2,
      explicacao: 'O protetor solar só deve ser usado após a cicatrização superficial completa (~2 semanas). Antes disso pode irritar.',
      xpBonus: 15,
    },
    {
      id: 5,
      pergunta: 'Qual FPS mínimo recomendado para proteger tatuagem?',
      opcoes: ['FPS 15', 'FPS 30', 'FPS 50+', 'Qualquer FPS'],
      respostaCorreta: 2,
      explicacao: 'FPS 50+ é o mínimo recomendado. O sol UV degrada o pigmento da tinta e desbota as cores com o tempo.',
      xpBonus: 15,
    },
  ],
};

export function useQuiz(checkpointDiaId?: number) {
  const [perguntas, setPerguntas] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [respondido, setRespondido] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [checkpointDiaId]);

  async function fetchQuiz() {
    if (!checkpointDiaId) {
      setPerguntas([]);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/quiz/dia/${checkpointDiaId}`);
      if (response.data && response.data.length > 0) {
        setPerguntas(response.data);
      } else {
        // Fallback para mock
        const mock = MOCK_QUIZZES[checkpointDiaId] || MOCK_QUIZZES[7] || [];
        setPerguntas(mock);
      }
    } catch (error) {
      console.log('[QUIZ] Usando dados mockados:', error);
      const mock = MOCK_QUIZZES[checkpointDiaId] || MOCK_QUIZZES[7] || [];
      setPerguntas(mock);
    } finally {
      setLoading(false);
    }
  }

  function responder(perguntaId: number, opcaoIndex: number) {
    setRespostas(prev => ({ ...prev, [perguntaId]: opcaoIndex }));
  }

  function verificarResposta(perguntaId: number): 'correta' | 'incorreta' | null {
    const resposta = respostas[perguntaId];
    if (resposta === undefined) return null;

    const pergunta = perguntas.find(p => p.id === perguntaId);
    if (!pergunta) return null;

    return resposta === pergunta.respostaCorreta ? 'correta' : 'incorreta';
  }

  async function enviarRespostas() {
    try {
      await api.post('/quiz/responder', { respostas });
    } catch (error) {
      console.log('[QUIZ] Erro ao enviar respostas (usando modo offline)');
    }
    setRespondido(true);
  }

  const acertos = perguntas.filter(p => respostas[p.id] === p.respostaCorreta).length;
  const xpGanho = perguntas
    .filter(p => respostas[p.id] === p.respostaCorreta)
    .reduce((sum, p) => sum + p.xpBonus, 0);
  const todasRespondidas = perguntas.length > 0 && perguntas.every(p => respostas[p.id] !== undefined);

  return {
    perguntas,
    loading,
    respostas,
    respondido,
    responder,
    verificarResposta,
    enviarRespostas,
    acertos,
    xpGanho,
    todasRespondidas,
    totalPerguntas: perguntas.length,
  };
}
