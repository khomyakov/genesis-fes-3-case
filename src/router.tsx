// src/router.tsx
import {
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
    useParams,
    Navigate,
  } from '@tanstack/react-router';
  import { TracksPage } from '@/features/tracks/routes';
  import { TrackModal } from '@/features/tracks/components/TrackModal';
  import { UploadModal } from '@/features/tracks/components/UploadModal';
  import { z } from 'zod';
  
  /* Route wrappers ---------------------------------- */
const TrackCreateWrapper = () => <TrackModal mode="create" />;

const TrackEditWrapper = () => {
  const { id } = useParams({ from: '/tracks/$id/edit' });
  return <TrackModal mode="edit" id={id} />;
};
  
  // 1️⃣ Root layout ----------------------------------------------------
  const rootRoute = createRootRoute({
    component: () => <Outlet />,          // where child routes render
    errorComponent: () => <div className="p-6 text-red-600">Something went wrong.</div>,
  });
  
  // 2️⃣ Optional index route => redirect "/" → "/tracks"
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Navigate to="/tracks" replace />, // simple redirect
  });
  
  // 3️⃣ Tracks page ----------------------------------------------------
  const tracksRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/tracks',
    component: TracksPage,
    validateSearch: z.object({
        page: z.coerce.number().min(1).catch(1),
        limit: z.coerce.number().min(1).max(100).catch(10),
        search: z.string().catch(''),
        sort: z.enum(['title', 'artist', 'album', 'createdAt']).catch('createdAt'),
        order: z.enum(['asc', 'desc']).catch('asc'),
        genre: z.string().catch(''),
        artist: z.string().catch(''),
    }),
  });
  
const searchSchema = (tracksRoute.options as any).validateSearch as z.ZodTypeAny;

export const trackCreateRoute = createRoute({
  getParentRoute: () => tracksRoute,
  path: 'new',
  component: TrackCreateWrapper,
  validateSearch: searchSchema,
});

export const trackEditRoute = createRoute({
  getParentRoute: () => tracksRoute,
  path: '$id/edit',
  component: TrackEditWrapper,
  validateSearch: searchSchema,
});

export const trackUploadRoute = createRoute({
  getParentRoute: () => tracksRoute,
  path: '$id/upload',
  component: UploadModal,
  validateSearch: searchSchema,
});

  const routeTree = rootRoute.addChildren([
    tracksRoute.addChildren([
      trackCreateRoute,
      trackEditRoute,
      trackUploadRoute,
    ]),
  ]);
  
  export const router = createRouter({ routeTree });