import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TrackList } from '../TrackList';
import { Track } from '../../types';

// Mock the TrackRow component
vi.mock('../TrackRow', () => ({
  TrackRow: ({ track }: { track: Track }) => <div data-testid={`track-row-${track.id}`}>{track.title}</div>
}));

describe('TrackList', () => {
  it('renders a list of tracks using TrackRow components', () => {
    const mockTracks: Track[] = [
      { id: '1', title: 'Track 1', artist: 'Artist 1', genres: [], audioFile: 'track1.mp3' },
      { id: '2', title: 'Track 2', artist: 'Artist 2', genres: [], audioFile: 'track2.mp3' }
    ];
    
    const { getByTestId } = render(<TrackList tracks={mockTracks} />);
    
    expect(getByTestId('track-row-1')).toBeInTheDocument();
    expect(getByTestId('track-row-2')).toBeInTheDocument();
    expect(getByTestId('track-row-1').textContent).toBe('Track 1');
    expect(getByTestId('track-row-2').textContent).toBe('Track 2');
  });

  it('renders an empty list when no tracks are provided', () => {
    const { container } = render(<TrackList tracks={[]} />);
    
    expect(container.querySelector('ul')).toBeEmptyDOMElement();
  });
}); 