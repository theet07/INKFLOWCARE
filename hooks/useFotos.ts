import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '@/services/api';

export interface Foto {
  id: number;
  urlImagem: string;
  numeroDia: number;
  dataUpload: string;
  legenda?: string;
}

// Mock para visualização
const MOCK_FOTOS: Foto[] = [
  { id: 1, urlImagem: 'https://picsum.photos/seed/tat1/400/400', numeroDia: 1, dataUpload: '2025-07-10', legenda: 'Tatuagem recém-feita' },
  { id: 2, urlImagem: 'https://picsum.photos/seed/tat2/400/400', numeroDia: 3, dataUpload: '2025-07-12', legenda: 'Início da cicatrização' },
  { id: 3, urlImagem: 'https://picsum.photos/seed/tat3/400/400', numeroDia: 7, dataUpload: '2025-07-17', legenda: 'Descamação começando' },
  { id: 4, urlImagem: 'https://picsum.photos/seed/tat4/400/400', numeroDia: 14, dataUpload: '2025-07-24', legenda: 'Pele se renovando' },
  { id: 5, urlImagem: 'https://picsum.photos/seed/tat5/400/400', numeroDia: 18, dataUpload: '2025-07-28', legenda: 'Quase curada!' },
];

export function useFotos(cicatrizacaoId?: number) {
  const [fotos, setFotos] = useState<Foto[]>(MOCK_FOTOS);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFotos();
  }, [cicatrizacaoId]);

  async function fetchFotos() {
    if (!cicatrizacaoId) {
      setFotos(MOCK_FOTOS);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/fotos/cicatrizacao/${cicatrizacaoId}`);
      if (response.data && response.data.length > 0) {
        setFotos(response.data);
      }
    } catch (error) {
      console.log('[FOTOS] Usando dados mockados:', error);
      setFotos(MOCK_FOTOS);
    } finally {
      setLoading(false);
    }
  }

  async function pickAndUpload(numeroDia: number, legenda?: string): Promise<boolean> {
    try {
      // Pedir permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('[FOTOS] Permissão negada');
        return false;
      }

      // Abrir gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7, // Compressão — max ~1MB
      });

      if (result.canceled || !result.assets[0]) return false;

      const asset = result.assets[0];
      setUploading(true);

      if (!cicatrizacaoId) {
        // Mock: adicionar localmente
        const novaFoto: Foto = {
          id: Date.now(),
          urlImagem: asset.uri,
          numeroDia,
          dataUpload: new Date().toISOString(),
          legenda,
        };
        setFotos(prev => [novaFoto, ...prev]);
        setUploading(false);
        return true;
      }

      // Upload real para o backend
      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: 'image/jpeg',
        name: `dia_${numeroDia}_${Date.now()}.jpg`,
      } as any);
      formData.append('numeroDia', String(numeroDia));
      if (legenda) formData.append('legenda', legenda);

      await api.post(`/fotos/cicatrizacao/${cicatrizacaoId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchFotos(); // Recarregar lista
      return true;
    } catch (error) {
      console.error('[FOTOS] Erro no upload:', error);
      return false;
    } finally {
      setUploading(false);
    }
  }

  async function deletarFoto(fotoId: number): Promise<boolean> {
    try {
      if (cicatrizacaoId) {
        await api.delete(`/fotos/${fotoId}`);
      }
      setFotos(prev => prev.filter(f => f.id !== fotoId));
      return true;
    } catch (error) {
      console.error('[FOTOS] Erro ao deletar:', error);
      return false;
    }
  }

  return {
    fotos,
    loading,
    uploading,
    pickAndUpload,
    deletarFoto,
    refresh: fetchFotos,
  };
}
