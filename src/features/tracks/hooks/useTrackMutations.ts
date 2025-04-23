import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import type { Track } from '../types';

// shared helpers ---------------------------------------------------
const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['tracks'] });

export const useCreateTrack = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Track, 'id' | 'slug' | 'audioFile' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await api.post('/tracks', payload);
      return data as Track;
    },
    onSuccess: () => invalidate(qc),
  });
};

export const useUpdateTrack = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { id: string; body: Partial<Track> }) => {
      const { data } = await api.put(`/tracks/${vars.id}`, vars.body);
      return data as Track;
    },
    onSuccess: () => invalidate(qc),
  });
};

export const useGenresQuery = () =>
  // tiny cache; genres rarely change
  useQuery({
    queryKey: ['genres'],
    queryFn: async () => (await api.get<string[]>('/genres')).data,
    staleTime: 1000 * 60 * 30, // 30 min
  });
