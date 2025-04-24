import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AudioPlayer } from '../AudioPlayer';
import * as AudioContext from '../../AudioContext';

// Mock the API_BASE
vi.mock('@/config', () => ({
  API_BASE: 'http://test-api',
}));

describe('AudioPlayer', () => {
  const mockSetCurrent = vi.fn();
  
  beforeEach(() => {
    vi.spyOn(AudioContext, 'useAudioCtx').mockReturnValue({
      currentId: null,
      setCurrent: mockSetCurrent,
    });
  });

  it('renders an audio element with the correct source', () => {
    render(<AudioPlayer id="123" src="track-123.mp3" />);
    
    const audioElement = screen.getByTestId('audio-player-123');
    expect(audioElement.tagName).toBe('AUDIO');
    expect(audioElement).toHaveAttribute('src', 'http://test-api/api/files/track-123.mp3');
    expect(audioElement).toHaveAttribute('controls');
    expect(audioElement).toHaveAttribute('preload', 'none');
    expect(audioElement).toHaveAttribute('crossorigin', 'anonymous');
  });

  it('calls setCurrent when audio is played', () => {
    render(<AudioPlayer id="123" src="track-123.mp3" />);
    
    const audioElement = screen.getByTestId('audio-player-123');
    fireEvent.play(audioElement);
    
    expect(mockSetCurrent).toHaveBeenCalledWith('123');
  });

  it('calls setCurrent with null when audio ends', () => {
    render(<AudioPlayer id="123" src="track-123.mp3" />);
    
    const audioElement = screen.getByTestId('audio-player-123');
    fireEvent.ended(audioElement);
    
    expect(mockSetCurrent).toHaveBeenCalledWith(null);
  });

  it('starts playing when it becomes the current player', () => {
    vi.spyOn(AudioContext, 'useAudioCtx').mockReturnValue({
      currentId: '123',
      setCurrent: mockSetCurrent,
    });

    const playSpy = vi.fn().mockResolvedValue(undefined);
    
    // Mock the audio element's play method
    HTMLAudioElement.prototype.play = playSpy;

    render(<AudioPlayer id="123" src="track-123.mp3" />);
    
    expect(playSpy).toHaveBeenCalled();
  });
}); 