import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders when open is true', () => {
    const mockOnConfirm = vi.fn();
    const mockOnClose = vi.fn();
    
    render(
      <ConfirmDialog 
        open={true} 
        title="Test Title" 
        onConfirm={mockOnConfirm} 
        onClose={mockOnClose} 
      />
    );
    
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-delete')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-delete')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const mockOnConfirm = vi.fn();
    const mockOnClose = vi.fn();
    
    render(
      <ConfirmDialog 
        open={true} 
        title="Test Title" 
        onConfirm={mockOnConfirm} 
        onClose={mockOnClose} 
      />
    );
    
    fireEvent.click(screen.getByTestId('confirm-delete'));
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', () => {
    const mockOnConfirm = vi.fn();
    const mockOnClose = vi.fn();
    
    render(
      <ConfirmDialog 
        open={true} 
        title="Test Title" 
        onConfirm={mockOnConfirm} 
        onClose={mockOnClose} 
      />
    );
    
    fireEvent.click(screen.getByTestId('cancel-delete'));
    
    // The AlertDialog component from shadcn might internally handle this differently
    // This is testing the integration with the underlying component
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 