import { useWavesurfer } from '@wavesurfer/react';
import { useEffect, useRef } from 'react';

import { API_BASE } from '@/config';

import { useAudioCtx } from '../AudioContext';

interface Props {
  id: string;
  src: string;
}

export const Waveform = ({ id, src }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentId, setCurrent } = useAudioCtx();
  const isMine = currentId === id;

  // prepend your API base for file URLs
  const url = `${API_BASE}/api/files/${src}`;

  // initialize wavesurfer with a ref container
  const { wavesurfer, isReady } = useWavesurfer({
    container: containerRef,
    url,
    waveColor: '#cbd5e1', // slate-300
    progressColor: '#64748b', // slate-500
    cursorColor: '#64748b',
    height: 64,
    normalize: true,
  });

  // whenever this track “becomes current”, start playback;
  // when it’s not, pause
  useEffect(() => {
    if (!wavesurfer || !isReady) return;
    if (isMine) wavesurfer.play();
    else wavesurfer.pause();
  }, [isMine, wavesurfer, isReady]);

  // subscribe to play & finish events to update currentId
  useEffect(() => {
    if (!wavesurfer) return;
    const onPlay = () => setCurrent(id);
    const onFinish = () => setCurrent(null);
    wavesurfer.on('play', onPlay);
    wavesurfer.on('finish', onFinish);
    return () => {
      wavesurfer.un('play', onPlay);
      wavesurfer.un('finish', onFinish);
    };
  }, [wavesurfer, id, setCurrent]);

  return <div ref={containerRef} data-testid={`waveform-${id}`} className="w-full" />;
};
