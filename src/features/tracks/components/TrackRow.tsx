import { Track } from '../types';
import { Play, Pause, Upload, Pencil, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAudioCtx } from '../AudioContext';
import { AudioPlayer } from './AudioPlayer';
import { ConfirmDialog } from './ConfirmDialog';
import { useState } from 'react';
import { useDeleteTrack } from '../hooks/useDeleteTrack';
import { toast } from 'sonner';

interface Props { track: Track }

export const TrackRow = ({ track }: Props) => {
  const { currentId, setCurrent } = useAudioCtx();
  const isPlaying = currentId === track.id;
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { mutateAsync: del, isPending } = useDeleteTrack();

  return (
    <li
      data-testid={`track-item-${track.id}`}
      className="flex items-center justify-between gap-4 p-2 border-b"
  >
    <div className="flex flex-col">
      <span data-testid={`track-item-${track.id}-title`} className="font-medium">
        {track.title}
      </span>
      <span data-testid={`track-item-${track.id}-artist`} className="text-sm text-muted-foreground">
        {track.artist}
      </span>
    </div>

    {/* Icons/buttons */}
    <div className="flex gap-2">
    {!track.audioFile ? (
          <Link
            to={`/tracks/${track.id}/upload`}
            data-testid={`upload-track-${track.id}`}
            aria-label="Upload"
          >
            <Upload size={18} />
          </Link>
        ) : isPlaying ? (
          <button
            data-testid={`pause-button-${track.id}`}
            onClick={() => setCurrent(null)}
            aria-label="Pause"
          >
            <Pause size={18} />
          </button>
        ) : (
          <button
            data-testid={`play-button-${track.id}`}
            onClick={() => setCurrent(track.id)}
            aria-label="Play"
          >
            <Play size={18} />
          </button>
        )}
      <Link to={`/tracks/${track.id}/edit`} data-testid={`edit-track-${track.id}`} aria-label="Edit">
        <Pencil size={18} />
      </Link>
      <button
          data-testid={`delete-track-${track.id}`}
          aria-label="Delete"
          onClick={() => setConfirmOpen(true)}
          disabled={isPending}
        >
          <Trash2 size={18} />
        </button>
    </div>

    <ConfirmDialog
        open={confirmOpen}
        title="Are you sure you want to delete this track?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          try {
            await del(track.id);
            toast.success('Track deleted');
          } catch (e: any) {
            toast.error(e?.message ?? 'Failed to delete');
          } finally {
            setConfirmOpen(false);
          }
        }}
      />

    {/* Inline audio element, rendered only if we have a file */}
      {track.audioFile && isPlaying && (
        <AudioPlayer id={track.id} src={track.audioFile} />
      )}
  </li>
);
};
