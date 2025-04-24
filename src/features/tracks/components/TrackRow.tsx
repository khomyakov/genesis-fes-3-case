import {
  Play,
  Pause,
  Upload,
  Pencil,
  Trash2,
  X,
  Loader2,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { Cover } from './Cover';
import { Track } from '../types';
import { useAudioCtx } from '../AudioContext';
import { ConfirmDialog } from './ConfirmDialog';
import { useDeleteTrack } from '../hooks/useDeleteTrack';
import { useRemoveFile } from '../hooks/useTrackMutations';
import { useQueryClient } from '@tanstack/react-query';
import { useSelection } from '@/store/useSelection';
import { Waveform } from './Waveform';

interface Props {
  track: Track;
}

export const TrackRow = ({ track }: Props) => {
  const { currentId, setCurrent } = useAudioCtx();
  const qc = useQueryClient();
  const isPlaying = currentId === track.id;

  // API mutations
  const { mutateAsync: deleteTrack, isPending: deletingTrack } = useDeleteTrack();
  const { mutateAsync: removeFile, isPending: removingFile } = useRemoveFile();

  // Confirm dialogs
  const [confirmTrackRemoveOpen, setConfirmTrackRemoveOpen] = useState(false);
  const [confirmFileRemoveOpen, setConfirmFileRemoveOpen] = useState(false);

  // Bulk selection
  const { mode, selected, toggle } = useSelection();
  const checked = selected.has(track.id);

  return (
    <li
      data-testid={`track-item-${track.id}`}
      className="flex items-center gap-4 p-2 border-b"
    >
      {/* cover / checkbox */}
      <div className="flex items-center gap-2 shrink-0">
        {mode && (
          <button
            className="mr-2 shrink-0 cursor-pointer"
            onClick={() => toggle(track.id)}
            aria-label={checked ? 'Unselect' : 'Select'}
            data-testid={`track-checkbox-${track.id}`}
          >
            {checked ? <CheckSquare size={18} /> : <Square size={18} />}
          </button>
        )}
        <Cover
          title={track.title}
          artist={track.artist}
          coverImage={track.coverImage}
        />
      </div>

      {/* title + waveform container */}
      <div className="flex items-center gap-4 flex-grow">
        {/* title / artist */}
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

        {/* animated waveform panel */}
        {track.audioFile && (
          <div
            className={`
              flex-grow
              overflow-hidden
              transition-[max-height,opacity]
              duration-300
              ease-in-out
              ${isPlaying ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <Waveform id={track.id} src={track.audioFile} />
          </div>
        )}
      </div>

      {/* action buttons */}
      <div className="flex gap-2 shrink-0">
        {!track.audioFile ? (
          <Link
            to={`/tracks/${track.id}/upload`}
            data-testid={`upload-track-${track.id}`}
            aria-label="Upload file"
          >
            <Upload size={18} />
          </Link>
        ) : isPlaying ? (
          <button
            data-testid={`pause-button-${track.id}`}
            onClick={() => setCurrent(null)}
            aria-label="Pause"
            className="cursor-pointer"
          >
            <Pause size={18} />
          </button>
        ) : (
          <button
            data-testid={`play-button-${track.id}`}
            onClick={() => setCurrent(track.id)}
            aria-label="Play"
            className="cursor-pointer"
          >
            <Play size={18} />
          </button>
        )}

        {track.audioFile && (
          <Link
            to={`/tracks/${track.id}/upload`}
            data-testid={`upload-track-${track.id}`}
            aria-label="Replace file"
          >
            <Upload size={18} />
          </Link>
        )}

        <Link
          to={`/tracks/${track.id}/edit`}
          data-testid={`edit-track-${track.id}`}
          aria-label="Edit"
        >
          <Pencil size={18} />
        </Link>

        <button
          data-testid={`delete-track-${track.id}`}
          aria-label="Delete track"
          disabled={deletingTrack}
          onClick={() => setConfirmTrackRemoveOpen(true)}
          className="cursor-pointer"
        >
          {deletingTrack ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>

        {track.audioFile && (
          <button
            data-testid={`remove-file-${track.id}`}
            aria-label="Remove audio file"
            disabled={removingFile}
            onClick={() => setConfirmFileRemoveOpen(true)}
            className="cursor-pointer"
          >
            {removingFile ? <Loader2 size={18} className="animate-spin" /> : <X size={18} />}
          </button>
        )}
      </div>

      {/* confirm dialogs */}
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
            if (e?.response?.status === 404) {
              toast.info('File was already gone; reference cleared');
              qc.invalidateQueries({ queryKey: ['tracks'] });
            } else {
              toast.error(e?.message ?? 'Failed to remove audio file');
            }
          } finally {
            setConfirmFileRemoveOpen(false);
          }
        }}
      />
    </li>
  );
};
