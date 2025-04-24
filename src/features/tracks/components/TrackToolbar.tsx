import { useSearch } from '@tanstack/react-router';
import { CheckSquare, Loader2, Square, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSelection } from '@/store/useSelection';

import { useBulkDelete } from '../hooks/useBulkDelete'; // bulk API
import { useDebounce } from '../hooks/useDebounce';
import { useGenresQuery } from '../hooks/useGenresQuery';
import { useArtistsList } from '../hooks/useArtistsList';
import { useUpdateSearch } from '../hooks/useUpdateSearch';

const ANY_GENRE = '__all__';
const ANY_ARTIST = '__all__';

interface Props {
  /** IDs of tracks currently rendered, for "select all / none" */
  visibleIds: string[];
}

export const TrackToolbar = ({ visibleIds }: Props) => {
  /* ───── search/sort/filter state ─────────────────────────── */
  const routerSearch = useSearch({ from: '/tracks' });
  const updateSearch = useUpdateSearch();

  const [q, setQ] = useState(routerSearch.search);
  const debounced = useDebounce(q);

  useEffect(() => {
    updateSearch({ page: 1, search: debounced });
  }, [debounced]);

  const { data: genres } = useGenresQuery();
  const { data: artists } = useArtistsList();

  /* ───── selection (bulk) state  ──────────────────────────── */
  const { mode, selected, selectAll, clear } = useSelection();
  const { mutateAsync: bulkDelete, isPending } = useBulkDelete();

  const allVisible = visibleIds.length > 0 && selected.size === visibleIds.length;
  const toggleAll = () => selectAll(allVisible ? [] : visibleIds);

  /* ───── UI ───────────────────────────────────────────────── */

  return (
    <div className="space-y-4">
      {/* bulk-action banner – only in selection mode */}
      {mode && (
        <Alert data-testid="bulk-toolbar" className="flex items-center gap-4 border-dashed">
          {/* toggle all / none */}
          <button
            aria-label="Toggle all"
            data-testid="select-all"
            onClick={toggleAll}
            className="shrink-0"
          >
            {allVisible ? <CheckSquare size={18} /> : <Square size={18} />}
          </button>

          <AlertDescription className="flex-1">{selected.size} selected</AlertDescription>

          {/* bulk delete */}
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending || selected.size === 0}
            aria-disabled={isPending || selected.size === 0}
            data-testid="bulk-delete-button"
            onClick={async () => {
              try {
                await bulkDelete([...selected]);
                toast.success('Tracks deleted');
                clear();
              } catch {
                toast.error('Bulk delete failed');
              }
            }}
            className="flex items-center gap-1"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Delete
          </Button>

          {/* exit selection mode */}
          <Button variant="ghost" size="sm" data-testid="bulk-cancel" onClick={clear}>
            Cancel&nbsp;Selection
          </Button>
        </Alert>
      )}

      {/* search / sort / filters row */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search ------------------------------------------------ */}
        <div className="flex flex-col">
          <label htmlFor="q" className="text-sm font-medium">
            Search
          </label>
          <Input
            id="q"
            data-testid="search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Title / Artist / Album"
            className="w-60"
          />
        </div>

        <div className="flex-1"></div>

        {/* Sort -------------------------------------------------- */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Sort by</label>
          <Select
            value={routerSearch.sort}
            onValueChange={(val) => updateSearch({ sort: val, page: 1 })}
          >
            <SelectTrigger id="sort" data-testid="sort-select" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                { value: 'title', label: 'Title' },
                { value: 'artist', label: 'Artist' },
                { value: 'album', label: 'Album' },
                { value: 'createdAt', label: 'Date Added' },
              ].map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Genre filter ----------------------------------------- */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Genre</label>
          <Select
            value={routerSearch.genre ? routerSearch.genre : ANY_GENRE}
            onValueChange={(g) => updateSearch({ genre: g === ANY_GENRE ? '' : g, page: 1 })}
          >
            <SelectTrigger className="w-40" data-testid="filter-genre">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_GENRE}>Any</SelectItem>
              {genres?.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Artist filter ---------------------------------------- */}
        <div className="flex flex-col">
          <label className="text-sm font-medium">Artist</label>
          <Select
            value={routerSearch.artist ? routerSearch.artist : ANY_ARTIST}
            onValueChange={(a) => updateSearch({ artist: a === ANY_ARTIST ? '' : a, page: 1 })}
          >
            <SelectTrigger className="w-40" data-testid="filter-artist">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY_ARTIST}>Any</SelectItem>
              {artists?.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
