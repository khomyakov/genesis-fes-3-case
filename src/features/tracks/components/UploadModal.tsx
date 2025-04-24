import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress'; // shadcn component

import { useUploadTrack } from '../hooks/useUploadMutations';

export const UploadModal = () => {
  const { id } = useParams({ from: '/tracks/$id/upload' });

  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pct, setPct] = useState(0);
  const listSearch = useSearch({ from: '/tracks' });
  const { mutateAsync, isPending } = useUploadTrack();

  const onSubmit = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return toast.error('Choose a file first');

    if (!/audio\/(mpeg|wav)/.test(file.type)) return toast.error('Only MP3 or WAV files allowed');
    if (file.size > 50 * 1024 * 1024) return toast.error('Max file size is 50 MB');

    try {
      await mutateAsync({ id, file, onProgress: setPct });
      toast.success('Uploaded!');
      navigate({ to: '/tracks', search: listSearch });
    } catch (e: any) {
      toast.error(e?.message ?? 'Upload failed');
    }
  };

  return (
    <Dialog open onOpenChange={() => navigate({ to: '/tracks' })}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>{'Upload audio file'}</DialogTitle>

        <div className="space-y-4">
          <Input
            type="file"
            className="cursor-pointer"
            accept=".mp3,audio/mpeg,.wav,audio/wav"
            ref={fileRef}
            disabled={isPending}
          />
          {isPending && <Progress value={pct} />}

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="cursor-pointer"
              onClick={() => navigate({ to: '/tracks' })}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={isPending} className="cursor-pointer">
              {isPending ? 'Uploading…' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
