import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router';
import { AudioProvider } from '@/features/tracks/AudioContext';
import { Toaster } from 'sonner';
import '@/index.css'; // tailwind entry


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<StrictMode>
  <AudioProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>
  </AudioProvider>
</StrictMode>
);
