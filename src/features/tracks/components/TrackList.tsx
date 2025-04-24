import type { Track } from '../types';
import { TrackRow } from './TrackRow';
interface Props {
  tracks: Track[];
}

export const TrackList = ({ tracks }: Props) => (
  <ul>
    {tracks.map((t) => (
      <TrackRow key={t.id} track={t} />
    ))}
  </ul>
);
