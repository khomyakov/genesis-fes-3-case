import { useSearch } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useUpdateSearch } from '../hooks/useUpdateSearch';

interface Props {
  totalPages: number;
}

export const Pagination = ({ totalPages }: Props) => {
  const updateSearch = useUpdateSearch();
  const { page } = useSearch({ from: '/tracks' });
  const [animate, setAnimate] = useState<'prev' | 'next' | null>(null);

  // Reset animation state after animation completes
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(null), 300);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  const prev = () => {
    if (page > 1) {
      setAnimate('prev');
      updateSearch({ page: page - 1 });
    }
  };
  
  const next = () => {
    if (page < totalPages) {
      setAnimate('next');
      updateSearch({ page: page + 1 });
    }
  };

  return (
    <div data-testid="pagination" className="flex items-center justify-between mt-6">
      <Button
        onClick={prev}
        disabled={page === 1}
        data-testid="pagination-prev"
        aria-disabled={page === 1}
        variant="outline"
        size="sm"
        className={`gap-1 transition-transform duration-200 ${animate === 'prev' ? 'scale-95' : ''}`}
      >
        <ChevronLeft size={16} className={`transition-transform duration-200 ${animate === 'prev' ? '-translate-x-1' : ''}`} />
        Previous
      </Button>
      
      <span className={`text-sm font-medium px-3 py-1 rounded-md transition-all duration-300 ${animate ? 'bg-muted/50 scale-105' : ''}`}>
        Page {page} of {totalPages}
      </span>
      
      <Button
        onClick={next}
        disabled={page === totalPages}
        data-testid="pagination-next"
        aria-disabled={page === totalPages}
        variant="outline"
        size="sm"
        className={`gap-1 transition-transform duration-200 ${animate === 'next' ? 'scale-95' : ''}`}
      >
        Next
        <ChevronRight size={16} className={`transition-transform duration-200 ${animate === 'next' ? 'translate-x-1' : ''}`} />
      </Button>
    </div>
  );
};
