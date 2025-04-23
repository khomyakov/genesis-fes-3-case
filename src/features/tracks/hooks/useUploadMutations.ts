import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import type { Track } from '../types';

export interface UploadVars {
  id: string;
  file: File;
  onProgress?: (pct: number) => void;
}

export const useUploadTrack = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file, onProgress }: UploadVars): Promise<Track> => {
      const form = new FormData();
      form.append('file', file);

      const { data } = await api.post(`/tracks/${id}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) =>
          onProgress?.(Math.round((evt.loaded / (evt.total ?? 1)) * 100)),
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks'] }),
  });
};
