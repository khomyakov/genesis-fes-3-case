
import { TrackRow } from './TrackRow';
import { Track } from '../types';
 interface Props { tracks: Track[] }

 export const TrackList = ({ tracks }: Props) => (
   <ul>
     {tracks.map((t) => (
       <TrackRow key={t.id} track={t} />
     ))}
   </ul>
 );