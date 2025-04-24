import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/api/axios';
import { randomFilename } from '@/lib/utils';

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
      // Random filename to avoid conflict on BE
      const fileName = new File([file], randomFilename(file.name), {
        type: file.type,
      });

      const form = new FormData();
      form.append('file', fileName);

      const { data } = await api.post(`/tracks/${id}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => onProgress?.(Math.round((evt.loaded / (evt.total ?? 1)) * 100)),
      });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks'] }),
  });
};
