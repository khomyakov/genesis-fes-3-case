import { useNavigate, useSearch } from '@tanstack/react-router';

export const useUpdateSearch = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/tracks' });

  return (patch: Partial<typeof search>) => navigate({ search: { ...search, ...patch } });
};
