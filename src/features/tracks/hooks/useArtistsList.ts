import { useQueryClient } from '@tanstack/react-query';
import type { Track, TracksResponse } from '../types';

export const useArtistsList = () => {
  const qc = useQueryClient();
  
  // no separate endpoints, so used cached tracks data
  const artists = Array.from(
    new Set(
      qc
        .getQueriesData<TracksResponse>({ queryKey: ['tracks'] })
        .flatMap(([, data]) => data?.data ?? [])
        .map((track: Track) => track.artist)
        .filter(Boolean)
        .sort()
    )
  );
  
  return { data: artists };
}; 