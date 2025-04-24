import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';
import type { TracksResponse } from '../types';

export const useDeleteTrack = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tracks/${id}`);
      return id;
    },
    onMutate: async (id) => {
      // optimistic remove from cache
      await qc.cancelQueries({ queryKey: ['tracks'] });
      const previous = qc.getQueryData<TracksResponse>(['tracks', '']);
      if (previous) {
        qc.setQueryData<TracksResponse>(['tracks', ''], {
          ...previous,
          data: previous.data.filter((t) => t.id !== id),
        });
      }
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(['tracks', ''], ctx.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['tracks'] }),
  });
};
