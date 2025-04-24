import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BulkBanner } from '../BulkBanner';
import { toast } from 'sonner';
import { useSelection } from '@/store/useSelection';
import { useBulkDelete } from '../../hooks/useBulkDelete';

// Mock the hooks
vi.mock('@/store/useSelection');
vi.mock('../../hooks/useBulkDelete');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('BulkBanner', () => {
  const mockClear = vi.fn();
  const mockBulkDelete = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    (useSelection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selected: new Set(['1', '2']),
      clear: mockClear,
      toggle: vi.fn(),
      has: vi.fn(),
    });

    // Mock the hook with just the properties that are used in the component
    (useBulkDelete as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: mockBulkDelete,
      isPending: false
    });
  });

  it('renders correctly with selected items', () => {
    render(<BulkBanner />);
    
    expect(screen.getByTestId('bulk-banner')).toBeInTheDocument();
    expect(screen.getByText('2 items selected')).toBeInTheDocument();
    expect(screen.getByTestId('bulk-delete-button')).toBeInTheDocument();
  });

  it('renders correctly with one selected item', () => {
    (useSelection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selected: new Set(['1']),
      clear: mockClear,
      toggle: vi.fn(),
      has: vi.fn(),
    });

    render(<BulkBanner />);
    
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('does not render when no items are selected', () => {
    (useSelection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      selected: new Set(),
      clear: mockClear,
      toggle: vi.fn(),
      has: vi.fn(),
    });

    const { container } = render(<BulkBanner />);
    
    expect(container).toBeEmptyDOMElement();
  });

  it('handles bulk delete success', async () => {
    mockBulkDelete.mockResolvedValue(undefined);
    
    render(<BulkBanner />);
    
    fireEvent.click(screen.getByTestId('bulk-delete-button'));
    
    expect(mockBulkDelete).toHaveBeenCalledWith(['1', '2']);
    
    // Wait for the async function to complete
    await vi.waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Tracks deleted');
      expect(mockClear).toHaveBeenCalled();
    });
  });

  it('handles bulk delete failure', async () => {
    mockBulkDelete.mockRejectedValue(new Error('Failed'));
    
    render(<BulkBanner />);
    
    fireEvent.click(screen.getByTestId('bulk-delete-button'));
    
    // Wait for the async function to complete
    await vi.waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Bulk delete failed');
      expect(mockClear).not.toHaveBeenCalled();
    });
  });

  it('disables the delete button when pending', () => {
    (useBulkDelete as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutateAsync: mockBulkDelete,
      isPending: true
    });

    render(<BulkBanner />);
    
    expect(screen.getByTestId('bulk-delete-button')).toBeDisabled();
  });
}); 