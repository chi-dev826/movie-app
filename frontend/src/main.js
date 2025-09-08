import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import MovieDetailPage from './components/MovieDetailPage';
import { createBrowserRouter, RouterProvider } from 'react-router';
const router = createBrowserRouter([
    { path: '/', Component: App },
    { path: '/movie/:movieId', Component: MovieDetailPage },
]);
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
