// src/features/tracks/TracksPage.tsx
import { Link, useSearch } from '@tanstack/react-router';
import { TrackToolbar } from './components/TrackToolbar';
import { Pagination } from './components/Pagination';
import { TrackList } from './components/TrackList';
import { useTracksQuery } from './hooks/useTracksQuery';
import { Skeleton } from '@/components/ui/skeleton'; // shadcn skeleton

/** simple skeleton rows reuse shadcn's Skeleton */
const SkeletonRows = () => (
  <ul data-testid="loading-tracks" className="space-y-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </ul>
);

export const TracksPage = () => {
  // fully-typed search object from validateSearch in router
  const params = useSearch({ from: '/tracks' });

  // fetch list according to current params
  const { data, isLoading } = useTracksQuery(params);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* header -------------------------------------------------- */}
      <header className="flex justify-between items-center">
        <h1 data-testid="tracks-header" className="text-2xl font-bold">
          Tracks
        </h1>
        <Link
          to="/tracks/new"
          data-testid="create-track-button"
          className="btn btn-primary"
        >
          + Create Track
        </Link>
      </header>

      {/* toolbar (search / sort / filters) ---------------------- */}
      <TrackToolbar />

      {/* list or loaders --------------------------------------- */}
      {isLoading ? (
        <SkeletonRows />
      ) : (
        <TrackList tracks={data?.data ?? []} />
      )}

      {/* pagination -------------------------------------------- */}
      {data && data.meta.totalPages > 1 && (
        <Pagination totalPages={data.meta.totalPages} />
      )}
    </div>
  );
};
