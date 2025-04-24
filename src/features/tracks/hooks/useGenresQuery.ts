import { api } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useGenresQuery = () =>
  // tiny cache; genres rarely change
  useQuery({
    queryKey: ['genres'],
    queryFn: async () => (await api.get<string[]>('/genres')).data,
    staleTime: 1000 * 60 * 60, // 60 minutes since genres rarely change
    networkMode: 'offlineFirst', // Use cached data when offline
  });
