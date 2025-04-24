import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Pagination } from '../Pagination';
import * as ReactRouter from '@tanstack/react-router';
import * as UpdateSearch from '../../hooks/useUpdateSearch';

vi.mock('@tanstack/react-router', () => ({
  useSearch: vi.fn(),
}));

vi.mock('../../hooks/useUpdateSearch', () => ({
  useUpdateSearch: vi.fn(),
}));

describe('Pagination', () => {
  const mockUpdateSearch = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    (ReactRouter.useSearch as ReturnType<typeof vi.fn>).mockReturnValue({ page: 2 });
    (UpdateSearch.useUpdateSearch as ReturnType<typeof vi.fn>).mockReturnValue(mockUpdateSearch);
  });

  it('renders pagination with correct page numbers', () => {
    render(<Pagination totalPages={5} />);
    
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-prev')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
  });

  it('calls updateSearch with previous page when prev button is clicked', () => {
    render(<Pagination totalPages={5} />);
    
    fireEvent.click(screen.getByTestId('pagination-prev'));
    
    expect(mockUpdateSearch).toHaveBeenCalledWith({ page: 1 });
  });

  it('calls updateSearch with next page when next button is clicked', () => {
    render(<Pagination totalPages={5} />);
    
    fireEvent.click(screen.getByTestId('pagination-next'));
    
    expect(mockUpdateSearch).toHaveBeenCalledWith({ page: 3 });
  });

  it('disables prev button on first page', () => {
    (ReactRouter.useSearch as ReturnType<typeof vi.fn>).mockReturnValue({ page: 1 });
    
    render(<Pagination totalPages={5} />);
    
    const prevButton = screen.getByTestId('pagination-prev');
    expect(prevButton).toBeDisabled();
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables next button on last page', () => {
    (ReactRouter.useSearch as ReturnType<typeof vi.fn>).mockReturnValue({ page: 5 });
    
    render(<Pagination totalPages={5} />);
    
    const nextButton = screen.getByTestId('pagination-next');
    expect(nextButton).toBeDisabled();
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
  });
}); 