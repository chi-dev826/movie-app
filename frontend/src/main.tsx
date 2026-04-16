import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import HomePage from './features/home';
import SearchPage from './features/search';
import MovieDetailPage from './features/movie-detail';
import TrailerPage from './features/video-player';
import MovieList from './features/movie-list';
import UpcomingList from './features/upcoming-list';
import WatchListPage from './features/watch-list';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { APP_PATHS } from '@shared/constants/routes';
import { RouteHandle } from './types/transitions';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: APP_PATHS.HOME,
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: { transition: 'horizontal' } as RouteHandle,
      },
      {
        path: APP_PATHS.SEARCH.replace('/', ''),
        element: <SearchPage />,
        handle: { transition: 'horizontal' } as RouteHandle,
      },
      {
        path: APP_PATHS.WATCH_LIST.replace('/', ''),
        element: <WatchListPage />,
        handle: { transition: 'horizontal' } as RouteHandle,
      },
      {
        path: APP_PATHS.MOVIE_DETAIL.replace('/', ''),
        element: <MovieDetailPage />,
        handle: { transition: 'horizontal' } as RouteHandle,
      },
      {
        path: APP_PATHS.MOVIES.UPCOMING.replace('/', ''),
        element: <UpcomingList />,
        handle: { transition: 'horizontal' } as RouteHandle,
      },
      {
        path: APP_PATHS.MOVIES.BY_TYPE.replace('/', ''),
        element: <MovieList />,
        handle: { transition: 'horizontal' } as RouteHandle,
      },
      {
        path: APP_PATHS.TRAILER.replace('/', ''),
        element: <TrailerPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
