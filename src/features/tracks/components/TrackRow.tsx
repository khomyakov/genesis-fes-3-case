import {
  Play,
  Pause,
  Upload,
  Pencil,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

import { Track } from '../types';
import { useAudioCtx } from '../AudioContext';
import { AudioPlayer } from './AudioPlayer';
import { ConfirmDialog } from './ConfirmDialog';
import { useDeleteTrack } from '../hooks/useDeleteTrack';
import { useRemoveFile } from '../hooks/useTrackMutations';

interface Props {
  track: Track;
}

export const TrackRow = ({ track }: Props) => {
  const { currentId, setCurrent } = useAudioCtx();
  const isPlaying = currentId === track.id;

  // ───── API mutations ────────────────────────────────
  const { mutateAsync: deleteTrack, isPending: deletingTrack } =
    useDeleteTrack();
  const { mutateAsync: removeFile, isPending: removingFile } = useRemoveFile();

  // ───── local confirm modal state ────────────────────
  const [confirmTrackRemoveOpen, setConfirmTrackRemoveOpen] = useState(false);
  const [confirmFileRemoveOpen, setConfirmFileRemoveOpen] = useState(false);

  return (
    <li
      data-testid={`track-item-${track.id}`}
      className="flex items-center justify-between gap-4 p-2 border-b"
    >
      {/* ─── Title / artist ─────────────────────────── */}
      <div className="flex flex-col">
        <span
          data-testid={`track-item-${track.id}-title`}
          className="font-medium"
        >
          {track.title}
        </span>
        <span
          data-testid={`track-item-${track.id}-artist`}
          className="text-sm text-muted-foreground"
        >
          {track.artist}
        </span>
      </div>

      {/* ─── Action buttons ─────────────────────────── */}
      <div className="flex gap-2">
        {/* Upload or Replace / Play-Pause */}
        {!track.audioFile ? (
          <Link
            to={`/tracks/${track.id}/upload`}
            data-testid={`upload-track-${track.id}`}
            aria-label="Upload file"
            title="Upload file"
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

        {/* Replace (same Upload icon) */}
        {track.audioFile && (
          <Link
            to={`/tracks/${track.id}/upload`}
            data-testid={`upload-track-${track.id}`}
            aria-label="Replace file"
            title="Replace file"
          >
            <Upload size={18} />
          </Link>
        )}

        {/* Edit */}
        <Link
          to={`/tracks/${track.id}/edit`}
          data-testid={`edit-track-${track.id}`}
          aria-label="Edit"
        >
          <Pencil size={18} />
        </Link>

        {/* Delete track */}
        <button
          data-testid={`delete-track-${track.id}`}
          aria-label="Delete track"
          disabled={deletingTrack}
          aria-disabled={deletingTrack}
          onClick={() => setConfirmTrackRemoveOpen(true)}
        >
          {deletingTrack ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}
        </button>

        {/* Remove audio file */}
        {track.audioFile && (
          <button
            aria-label="Remove file"
            title="Remove audio file"
            disabled={removingFile}
            aria-disabled={removingFile}
            onClick={() => setConfirmFileRemoveOpen(true)}
            data-testid={`remove-file-${track.id}`}
          >
            {removingFile ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <X size={18} />
            )}
          </button>
        )}
      </div>

      {/* ─── Confirm deletion dialog ─────────────────── */}
      <ConfirmDialog
        open={confirmTrackRemoveOpen}
        title="Are you sure you want to delete this track?"
        onClose={() => setConfirmTrackRemoveOpen(false)}
        onConfirm={async () => {
          try {
            await deleteTrack(track.id);
            toast.success('Track deleted');
          } catch (e: any) {
            toast.error(e?.message ?? 'Failed to delete');
          } finally {
            setConfirmTrackRemoveOpen(false);
          }
        }}
      />


      {/* ─── Confirm audio file removal ─────────────── */}
      <ConfirmDialog
        open={confirmFileRemoveOpen}
        title="Are you sure you want to remove this audio file?"
        onClose={() => setConfirmFileRemoveOpen(false)}
        onConfirm={async () => {
          try {
            await removeFile(track.id);
            toast.success('File removed', { description: track.title });
            if (isPlaying) setCurrent(null);
          } catch (e: any) {
            toast.error(e?.message ?? 'Failed to remove audio file');
          } finally {
            setConfirmFileRemoveOpen(false);
          }
        }}
      />


      {/* ─── Inline player (only when playing) ───────── */}
      {track.audioFile && isPlaying && (
        <AudioPlayer id={track.id} src={track.audioFile} />
      )}
    </li>
  );
};
