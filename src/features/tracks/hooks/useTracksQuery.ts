import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';

import type { TracksResponse } from '../types';

export const useTracksQuery = (params: Record<string, unknown>) =>
  useQuery<TracksResponse>({
    queryKey: ['tracks', JSON.stringify(params)],
    queryFn: async () => (await api.get('/tracks', { params })).data,
    placeholderData: (previous) => previous, // ← v5 equivalent
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    networkMode: 'offlineFirst', // Use cached data when offline
  });
