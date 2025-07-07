import { useState, useEffect } from 'react';
import { fetchPopularMovies } from '../services/movieApi';
import type { Movie } from '../types';

export const useMovies = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const movies = await fetchPopularMovies();
        setMovieList(movies);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('不明なエラーが発生しました。');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  return { movieList, isLoading, error };
};
