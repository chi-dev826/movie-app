import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import HomePage from './features/home';
import SearchPage from './features/search';
import MovieDetailPage from './features/movie-detail';
import MovieList from './features/movie-list';
import UpcomingList from './features/movie-list/upcomingList';
import WatchListPage from './features/watch-list'; // インポートを追加
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'watch-list', // ウォッチリストのルートを追加
        element: <WatchListPage />,
      },
      {
        path: 'movie/:id',
        element: <MovieDetailPage />,
      },
      {
        path: 'movies/upcoming',
        element: <UpcomingList />,
      },
      {
        path: 'movies/:type',
        element: <MovieList />,
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
