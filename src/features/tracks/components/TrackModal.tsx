import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api } from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateTrack, useUpdateTrack } from '../hooks/useTrackMutations';
import { useGenresQuery } from '../hooks/useGenresQuery';
import type { Track, TracksResponse } from '../types';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  artist: z.string().min(1, 'Required'),
  album: z.string().optional(),
  coverImage: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal('').transform(() => undefined))
    .optional(),
  genres: z.array(z.string()).min(1, 'Select at least 1 genre'),
});
type FormData = z.infer<typeof schema>;

interface Props {
  mode: 'create' | 'edit';
  id?: string;
}

export const TrackModal = ({ mode, id }: Props) => {
  const navigate = useNavigate();
  const { data: genres } = useGenresQuery();

  const qc = useQueryClient();

  const existingTrack: Track | undefined = qc
    .getQueriesData<TracksResponse>({ queryKey: ['tracks'] }) // every filter/page
    .flatMap(([, d]) => d?.data ?? [])
    .find((t) => t.id === id);

  /* fallback fetch  */
  // TODO: extract this to a hook
  const { data: fetched } = useQuery({
    enabled: mode === 'edit' && !existingTrack && id !== undefined,
    queryKey: ['track', id],
    queryFn: async () => {
      const { data } = await api.get<TracksResponse>('/tracks', { params: { id } });
      return data.data[0];
    },
  });

  const track = existingTrack ?? fetched;

  const defaultValues = useMemo<FormData>(
    () =>
      mode === 'edit' && track
        ? {
            title: track.title,
            artist: track.artist,
            album: track.album ?? '',
            coverImage: track.coverImage ?? '',
            genres: track.genres,
          }
        : { title: '', artist: '', album: '', coverImage: '', genres: [] },
    [mode, track],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    values: defaultValues, // repopulate when "track" arrives after fetch
  });

  const { mutateAsync: create } = useCreateTrack();
  const { mutateAsync: update } = useUpdateTrack();

  const listSearch = useSearch({ from: '/tracks' });

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === 'create') await create(data);
      else if (id) await update({ id, body: data });
      toast.success('Saved!', { description: 'Track metadata stored.' });
      navigate({ to: '/tracks', search: listSearch });
    } catch (e: any) {
      toast.error(e?.message ?? 'Something went wrong');
    }
  };

  const selected = watch('genres');
  const addGenre = (g: string) => setValue('genres', [...selected, g]);
  const removeGenre = (g: string) =>
    setValue(
      'genres',
      selected.filter((x) => x !== g),
    );

  return (
    <Dialog open onOpenChange={() => navigate({ to: '/tracks', search: listSearch })}>
      <DialogContent data-testid="track-form" className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Track' : 'Edit Track'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} data-testid="input-title" />
            {errors.title && (
              <p className="text-destructive text-sm" data-testid="error-title">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Artist */}
          <div>
            <Label htmlFor="artist">Artist</Label>
            <Input id="artist" {...register('artist')} data-testid="input-artist" />
            {errors.artist && (
              <p className="text-destructive text-sm" data-testid="error-artist">
                {errors.artist.message}
              </p>
            )}
          </div>

          {/* Album */}
          <div>
            <Label htmlFor="album">Album</Label>
            <Input id="album" {...register('album')} data-testid="input-album" />
          </div>

          {/* Cover */}
          <div>
            <Label htmlFor="coverImage">Cover image URL</Label>
            <Input id="coverImage" {...register('coverImage')} data-testid="input-cover-image" />
          </div>

          {/* Genres */}
          <div>
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2" data-testid="genre-selector">
              {selected.map((g) => (
                <span
                  key={g}
                  className="px-2 py-1 rounded bg-secondary text-sm flex items-center gap-1"
                >
                  {g}
                  <button type="button" onClick={() => removeGenre(g)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <select
                className="border rounded px-2 py-1 text-sm"
                onChange={(e) => {
                  if (e.target.value) addGenre(e.target.value);
                  e.target.value = '';
                }}
              >
                <option value="">+ add</option>
                {genres
                  ?.filter((g) => !selected.includes(g))
                  .map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            {errors.genres && (
              <p className="text-destructive text-sm" data-testid="error-genre">
                {errors.genres.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="cursor-pointer"
              variant="secondary"
              onClick={() => navigate({ to: '/tracks', search: listSearch })}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="submit-button"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
