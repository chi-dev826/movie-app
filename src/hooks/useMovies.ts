import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import {
  fetchMovieDetail,
  fetchYoutubeKey,
  fetchSimilarMovies,
  fetchTitleImagePath,
} from '../services/movieApi';
import type { Movie, MovieDetail } from '../types';

export const useMovies = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [youtubeKey, setYoutubeKey] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [titleImagePath, setTitleImagePath] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const movieList = await Promise.all([
          movieId ? fetchMovieDetail(movieId) : Promise.resolve(null),
          movieId ? fetchYoutubeKey(movieId) : Promise.resolve(null),
          movieId ? fetchSimilarMovies(movieId) : Promise.resolve([]),
          movieId ? fetchTitleImagePath(movieId) : Promise.resolve(''),
        ]);
        setMovieDetail(movieList[0]);
        setYoutubeKey(movieList[1]);
        setSimilarMovies(movieList[2]);
        setTitleImagePath(movieList[3]);
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
  }, [movieId]);

  return { movieDetail, youtubeKey, similarMovies, titleImagePath, isLoading, error };
};
