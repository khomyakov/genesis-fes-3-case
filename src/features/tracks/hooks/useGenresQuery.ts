import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useGenresQuery = () =>
  // tiny cache; genres rarely change
  useQuery({
    queryKey: ['genres'],
    queryFn: async () => (await api.get<string[]>('/genres')).data,
    staleTime: 1000 * 60 * 30, // 30 min
  });
