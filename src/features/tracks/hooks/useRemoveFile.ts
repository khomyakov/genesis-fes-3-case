import { api } from "@/api/axios";
import { Track } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useRemoveFile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tracks/${id}/file`);
      return id;
    },
    onSuccess: (id) => {
      // wipe audioFile inside every cached list page …
      qc.setQueriesData({ queryKey: ['tracks'] }, (old: any) =>
        old
          ? {
            ...old,
            data: old.data.map((t: Track) => (t.id === id ? { ...t, audioFile: undefined } : t)),
          }
          : old,
      );
      // …and any single-track query that might exist
      qc.setQueriesData<Track>({ queryKey: ['track', id] }, (old) =>
        old ? { ...old, audioFile: undefined } : old,
      );
    },
  });
};