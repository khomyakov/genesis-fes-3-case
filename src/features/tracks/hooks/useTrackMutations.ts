import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import type { Track } from '../types';

const invalidate = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: ['tracks'] });

export const useCreateTrack = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Omit<Track, 'id' | 'slug' | 'audioFile' | 'createdAt' | 'updatedAt'>,
    ) => {
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
