import '@/index.css'; // tailwind entry

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';

import { AudioProvider } from '@/features/tracks/AudioContext';
import { router } from '@/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: 'offlineFirst', // Use cached data when offline
      refetchOnReconnect: true, // Refetch when connection is restored
    },
  },
});

// Create localStorage persister
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'genesis-tracks-cache',
  throttleTime: 1000, // Save to storage every 1 second
});

// Setup persistence
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      // Only persist tracks related queries
      return query.queryKey[0] === 'tracks' || 
             query.queryKey[0] === 'genres' || 
             query.queryKey[0] === 'track';
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AudioProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors />
      </QueryClientProvider>
    </AudioProvider>
  </StrictMode>,
);
