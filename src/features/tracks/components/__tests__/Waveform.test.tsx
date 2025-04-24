import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Waveform } from '../Waveform';
import { useAudioCtx } from '../../AudioContext';
import { useWavesurfer } from '@wavesurfer/react';

// Mock the dependencies
vi.mock('@/config', () => ({
  API_BASE: 'http://test-api',
}));

vi.mock('@wavesurfer/react', () => ({
  useWavesurfer: vi.fn(),
}));

vi.mock('../../AudioContext', () => ({
  useAudioCtx: vi.fn(),
}));

describe('Waveform', () => {
  const mockSetCurrent = vi.fn();
  const mockWavesurfer = {
    play: vi.fn(),
    pause: vi.fn(),
    on: vi.fn(),
    un: vi.fn(),
  };
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    (useAudioCtx as ReturnType<typeof vi.fn>).mockReturnValue({
      currentId: null,
      setCurrent: mockSetCurrent,
    });
    
    (useWavesurfer as ReturnType<typeof vi.fn>).mockReturnValue({
      wavesurfer: mockWavesurfer,
      isReady: true,
    });
  });

  it('renders a waveform container with the correct id', () => {
    render(<Waveform id="123" src="track-123.mp3" />);
    
    expect(screen.getByTestId('waveform-123')).toBeInTheDocument();
  });

  it('initializes wavesurfer with correct URL and options', () => {
    render(<Waveform id="123" src="track-123.mp3" />);
    
    expect(useWavesurfer).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'http://test-api/api/files/track-123.mp3',
        waveColor: '#cbd5e1',
        progressColor: '#64748b',
        cursorColor: '#64748b',
        height: 64,
        normalize: true,
      })
    );
  });

  it('plays wavesurfer when this track is the current track', () => {
    (useAudioCtx as ReturnType<typeof vi.fn>).mockReturnValue({
      currentId: '123',
      setCurrent: mockSetCurrent,
    });
    
    render(<Waveform id="123" src="track-123.mp3" />);
    
    expect(mockWavesurfer.play).toHaveBeenCalled();
  });

  it('pauses wavesurfer when this track is not the current track', () => {
    (useAudioCtx as ReturnType<typeof vi.fn>).mockReturnValue({
      currentId: '456',
      setCurrent: mockSetCurrent,
    });
    
    render(<Waveform id="123" src="track-123.mp3" />);
    
    expect(mockWavesurfer.pause).toHaveBeenCalled();
  });

  it('sets up event listeners for play and finish events', () => {
    render(<Waveform id="123" src="track-123.mp3" />);
    
    // Verify that we attached event listeners for play and finish
    expect(mockWavesurfer.on).toHaveBeenCalledWith('play', expect.any(Function));
    expect(mockWavesurfer.on).toHaveBeenCalledWith('finish', expect.any(Function));
    
    // Extract the callbacks
    const playCalls = mockWavesurfer.on.mock.calls.filter(call => call[0] === 'play');
    const finishCalls = mockWavesurfer.on.mock.calls.filter(call => call[0] === 'finish');
    
    // Make sure we found the calls
    expect(playCalls.length).toBeGreaterThan(0);
    expect(finishCalls.length).toBeGreaterThan(0);
    
    // Get the callback functions
    const playCallback = playCalls[0][1];
    const finishCallback = finishCalls[0][1];
    
    // Trigger the callbacks
    playCallback();
    expect(mockSetCurrent).toHaveBeenCalledWith('123');
    
    finishCallback();
    expect(mockSetCurrent).toHaveBeenCalledWith(null);
  });
}); 