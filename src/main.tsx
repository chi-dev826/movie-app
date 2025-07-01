import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MovieDetail from './components/MovieDetail.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'

const router = createBrowserRouter([
  { path: "/", Component: App},
  { path: "/movies/:movieId", Component: MovieDetail },
  ],
  {
    basename: "/movie-app", //GitHub pages用
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
