import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { API_BASE } from '@/config';

import { useAudioCtx } from '../AudioContext';
interface Props {
  id: string;
  src: string;
}

export const AudioPlayer = ({ id, src }: Props) => {
  const ref = useRef<HTMLAudioElement>(null);
  const { currentId, setCurrent } = useAudioCtx();

  const isMine = currentId === id;

  // I aged for a year while figuring out this thing
  const source = `${API_BASE}/api/files/${src}`;

  /* Autoplay when this row becomes the current player                         */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isMine) {
      el.play().catch((e) =>
        // avoid unhandled-promise warnings & give a hint in the console
        console.warn('Audio play failed', e),
      );
    } else {
      el.pause();
    }
  }, [isMine]);

  return (
    <audio
      ref={ref}
      src={source}
      data-testid={`audio-player-${id}`}
      onPlay={() => setCurrent(id)}
      onEnded={() => setCurrent(null)}
      onError={() => {
        console.error(`Cannot load audio for track ${id}: ${source}`);
        toast.error(`Cannot load audio for track ${id}: ${source}`);
      }}
      crossOrigin="anonymous"
      preload="none"
      controls
      className="w-full"
    />
  );
};
