import { Link, Outlet, useSearch } from '@tanstack/react-router';
import { Square } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useSelection } from '@/store/useSelection';

import { Pagination } from './components/Pagination';
import { TrackList } from './components/TrackList';
import { TrackToolbar } from './components/TrackToolbar';
import { useTracksQuery } from './hooks/useTracksQuery';

/* ───────────────────────── skeleton rows ───────────────────────── */
const SkeletonRows = () => (
  <ul data-testid="loading-tracks" className="space-y-2">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full rounded-lg" />
    ))}
  </ul>
);
/* ───────────────────────────────────────────────────────────────── */

export const TracksPage = () => {
  /* current URL params (validated in router) */
  const params = useSearch({ from: '/tracks' });
  const { data, isLoading } = useTracksQuery(params);

  /* bulk-selection store */
  const {
    mode, // ← renamed from selectionMode
    selected,
    toggleMode, // set true / false / toggle
    selectAll,
    clear, // exit + reset
  } = useSelection();

  const visibleIds = data?.data.map((t) => t.id) ?? [];
  const allSelected = selected.size === visibleIds.length && visibleIds.length > 0;
  const nothingChosen = selected.size === 0;

  return (
    <div className="relative p-6 max-w-5xl mx-auto space-y-6">
      {/* ────────────── header ────────────── */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" data-testid="tracks-header">
          Tracks
        </h1>

        <div className="flex gap-3">
          {!mode ? (
            /* ── enter selection mode ── */
            <button
              data-testid="select-mode-toggle"
              onClick={() => toggleMode(true)}
              className="btn-secondary flex items-center gap-1 cursor-pointer"
            >
              Select
            </button>
          ) : null}

          {/* always-present “Create track” button */}
          <Link to="/tracks/new" data-testid="create-track-button" className="btn-primary">
            Create Track
          </Link>
        </div>
      </header>

      {/* ────────────── filters / toolbar ────────────── */}
      <TrackToolbar visibleIds={visibleIds} />

      {/* ────────────── list or skeleton ─────────────── */}
      {isLoading ? <SkeletonRows /> : <TrackList tracks={data?.data ?? []} />}

      {/* ────────────── pagination ─────────────── */}
      {data && data.meta.totalPages > 1 && <Pagination totalPages={data.meta.totalPages} />}

      {/* modals (child routes) */}
      <Outlet />
    </div>
  );
};
