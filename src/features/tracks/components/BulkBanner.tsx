import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSelection } from '@/store/useSelection';

import { useBulkDelete } from '../hooks/useBulkDelete'; // your existing hook

export const BulkBanner = () => {
  const { selected, clear } = useSelection();
  const { mutateAsync: bulkDelete, isPending } = useBulkDelete();
  const total = selected.size;

  if (total === 0) return null;

  return (
    <Alert className="flex items-center justify-between" data-testid="bulk-banner">
      <AlertDescription className="font-medium">
        {total} item{total > 1 && 's'} selected
      </AlertDescription>

      <Button
        variant="destructive"
        size="sm"
        data-testid="bulk-delete-button"
        disabled={isPending}
        onClick={async () => {
          try {
            await bulkDelete([...selected]);
            toast.success('Tracks deleted');
            clear();
          } catch {
            toast.error('Bulk delete failed');
          }
        }}
        className="flex items-center gap-1 cursor-pointer"
      >
        <Trash2 size={16} />
        Delete
      </Button>
    </Alert>
  );
};
