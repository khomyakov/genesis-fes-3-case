import { Link, Outlet, useSearch } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { useSelection } from '@/store/useSelection';
import { Pagination } from '../components/Pagination';
import { TrackList } from '../components/TrackList';
import { TrackToolbar } from '../components/TrackToolbar';
import { useTracksQuery } from '../hooks/useTracksQuery';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const SkeletonRows = () => (
  <ul data-testid="loading-tracks" className="space-y-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </ul>
);

export const TracksPage = () => {
  const params = useSearch({ from: '/tracks' });
  const { data, isLoading, isFetching } = useTracksQuery(params);
  const listSearch = useSearch({ from: '/tracks' });
  const {
    mode,
    toggleMode,
  } = useSelection();

  const visibleIds = data?.data.map((t) => t.id) ?? [];

  return (
    <div className="container relative p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold" data-testid="tracks-header">
            Weekend Tracks
          </h1>
          <h2 className="text-1xl text-muted-foreground">
            Opinionated track library developed over the weekend
          </h2>
        </div>

        <div className="flex gap-3">
          {!mode ? (
            <button
              data-testid="select-mode-toggle"
              onClick={() => toggleMode(true)}
              className="btn-secondary flex items-center gap-1 cursor-pointer"
            >
              Select
            </button>
          ) : null}
          <Link to="/tracks/new" data-testid="create-track-button" search={listSearch} className="btn-primary">
            Create Track
          </Link>
        </div>
      </header>

      <TrackToolbar visibleIds={visibleIds} />

      {isLoading ? (
        <SkeletonRows />
      ) : (
        <TrackList 
          tracks={data?.data ?? []} 
          isLoading={isFetching} 
        />
      )}


      {data && data.meta.totalPages > 1 && <Pagination totalPages={data.meta.totalPages} />}

      {/* modals (child routes) */}
      <Outlet />
      
      <ThemeToggle />
    </div>
  );
};
