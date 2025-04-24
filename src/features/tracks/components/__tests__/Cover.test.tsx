import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Cover } from '../Cover';

describe('Cover', () => {
  it('renders an image when coverImage is provided', () => {
    render(<Cover title="Test Title" artist="Test Artist" coverImage="test-image.jpg" />);
    
    const coverElement = screen.getByTestId('track-cover');
    expect(coverElement.tagName).toBe('IMG');
    expect(coverElement).toHaveAttribute('src', 'test-image.jpg');
    expect(coverElement).toHaveAttribute('alt', 'Test Title cover');
    expect(coverElement).toHaveClass('w-12 h-12 shrink-0 rounded object-cover');
  });

  it('renders a fallback cover with initials when no coverImage is provided', () => {
    render(<Cover title="Test Title" artist="Test Artist" />);
    
    const coverElement = screen.getByTestId('track-cover');
    expect(coverElement.tagName).toBe('DIV');
    expect(coverElement.textContent).toBe('TT');
    expect(coverElement).toHaveClass('w-12 h-12 shrink-0 flex items-center justify-center rounded text-sm font-semibold uppercase select-none');
  });

  it('handles empty title or artist gracefully', () => {
    render(<Cover title="" artist="Artist" />);
    
    const coverElement = screen.getByTestId('track-cover');
    expect(coverElement.textContent).toBe('A');
  });
}); 