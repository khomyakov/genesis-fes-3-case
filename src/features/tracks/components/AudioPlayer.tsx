import { useRef, useEffect } from 'react';
import { useAudioCtx } from '../AudioContext';

interface Props {
  id: string;
  src: string;
}

export const AudioPlayer = ({ id, src }: Props) => {
  const ref = useRef<HTMLAudioElement>(null);
  const { currentId, setCurrent } = useAudioCtx();
  const isMine = currentId === id;

  // autoplay when we become current
  useEffect(() => {
    if (isMine) ref.current?.play();
    else ref.current?.pause();
  }, [isMine]);

  return (
    <audio
      ref={ref}
      src={src}
      data-testid={`audio-player-${id}`}
      onPlay={() => setCurrent(id)}
      onEnded={() => setCurrent(null)}
      controls
      className="w-full"
    />
  );
};