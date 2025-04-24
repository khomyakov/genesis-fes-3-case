import { useSearch } from '@tanstack/react-router';
import { useUpdateSearch } from '../hooks/useUpdateSearch';

interface Props { totalPages: number }

export const Pagination = ({ totalPages }: Props) => {
  const updateSearch = useUpdateSearch();
  const { page } = useSearch({ from: '/tracks' });

  const prev = () => updateSearch({ page: Math.max(1, page - 1) });
  const next = () => updateSearch({ page: Math.min(totalPages, page + 1) });

  return (
    <div data-testid="pagination" className="flex items-center gap-4 mt-4">
      <button
        onClick={prev}
        disabled={page === 1}
        data-testid="pagination-prev"
        aria-disabled={page === 1}
        className="btn btn-sm cursor-pointer"
      >
        Prev
      </button>
      <span>{page} / {totalPages}</span>
      <button
        onClick={next}
        disabled={page === totalPages}
        data-testid="pagination-next"
        aria-disabled={page === totalPages}
        className="btn btn-sm cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};
