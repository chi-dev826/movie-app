import { useEffect, useState } from 'react';
import type { Movie } from '../types';
import { fetchPopularMovies } from '../services/movieApi';

export const usePopularMovies = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const movies = await fetchPopularMovies();
        setPopularMovies(movies);
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
    loadPopularMovies();
  }, []);

  return { popularMovies, isLoading, error };
};
