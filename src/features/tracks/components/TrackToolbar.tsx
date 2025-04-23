import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useDebounce } from '../hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGenresQuery } from '../hooks/useTrackMutations';
import { useUpdateSearch } from '../hooks/useUpdateSearch';

const ANY_GENRE = '__all__'; 

export const TrackToolbar = () => {

  const updateSearch = useUpdateSearch();
  const search = useSearch({ from: '/tracks' });

  /* local controlled inputs */
  const [q, setQ] = useState(search.search);
  const debounced = useDebounce(q);

  const { data: genres } = useGenresQuery();

  /* sync debounced search term to the URL */
  useEffect(() => {
    updateSearch({ page: 1, search: debounced });
  }, [debounced]);

  return (
    <div className="flex flex-wrap gap-4 items-end">
      {/* Search --------------------------------------------------- */}
      <div className="flex flex-col">
        <label htmlFor="q" className="text-sm font-medium">Search</label>
        <Input
          id="q"
          data-testid="search-input"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Title / Artist / Album"
          className="w-60"
        />
      </div>

      {/* Sort ----------------------------------------------------- */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Sort by</label>
        <Select
          value={search.sort}
          onValueChange={val => updateSearch({ sort: val, page: 1 })}
        >
          <SelectTrigger id="sort" data-testid="sort-select" className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['title', 'artist', 'album', 'createdAt'].map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Genre filter -------------------------------------------- */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Genre</label>
        <Select
          value={search.genre ? search.genre : ANY_GENRE}
          onValueChange={(g) =>
            updateSearch({ genre: g === ANY_GENRE ? '' : g, page: 1 })
          }
        >
          <SelectTrigger className="w-40" data-testid="filter-genre">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_GENRE}>Any</SelectItem>
            {genres?.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Artist filter ------------------------------------------- */}
      <div className="flex flex-col">
        <label className="text-sm font-medium">Artist</label>
        <Input
          data-testid="filter-artist"
          value={search.artist}
          onChange={e => updateSearch({ artist: e.target.value, page: 1 })}
          className="w-40"
        />
      </div>
    </div>
  );
};
