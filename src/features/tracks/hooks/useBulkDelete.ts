import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import type { Track, TracksResponse } from '../types';

export const useBulkDelete = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await api.post('/tracks/delete', { ids });
      return ids; // resolved payload is just the list we removed
    },
    onSuccess: (ids) => {
      // drop from every cached page
      qc.setQueriesData<TracksResponse>({ queryKey: ['tracks'] }, (old) =>
        old ? { ...old, data: old.data.filter((t: Track) => !ids.includes(t.id)) } : old,
      );
    },
  });
};
