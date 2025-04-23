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
  
  const trackCreateRoute = createRoute({
    getParentRoute: () => tracksRoute,
    path: '/new',
    component: TrackCreateWrapper,
  });
  
  const trackEditRoute = createRoute({
    getParentRoute: () => tracksRoute,
    path: '/$id/edit',
    component: TrackEditWrapper,
  });
  
  const trackUploadRoute = createRoute({
    getParentRoute: () => tracksRoute,
    path: '/$id/upload',
    component: UploadModal,
  });
  
  // 5️⃣ Assemble the tree and export the router -----------------------
  const routeTree = rootRoute.addChildren([
    indexRoute,                       // "/"
    tracksRoute.addChildren([
      trackCreateRoute,
      trackEditRoute,
      trackUploadRoute
    ]),
  ]);
  
  export const router = createRouter({ routeTree });
  