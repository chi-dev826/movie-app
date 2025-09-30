import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { fetchFullMovieData, searchMovies as searchMoviesApi } from '../services/movieApi';
import type { Movie, MovieDetail } from '../types';

export const useMovies = () => {
  const { id: movieId } = useParams<{ id: string }>();
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [youtubeKey, setYoutubeKey] = useState<string | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [titleImagePath, setTitleImagePath] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovieData = async () => {
      if (!movieId) return;

      try {
        setIsLoading(true);
        setError(null);

        const fullData = await fetchFullMovieData(movieId);

        const detailData = fullData.details;
        setMovieDetail({
          id: detailData.id,
          backdrop_path: detailData.backdrop_path || null,
          original_title: detailData.original_title,
          poster_path: detailData.poster_path || null,
          overview: detailData.overview,
          year: new Date(detailData.release_date).getFullYear(),
          rating: detailData.vote_average,
          runtime: detailData.runtime,
          score: detailData.vote_average * 10,
          genres: detailData.genres.map((genre) => genre.name),
          company_logo: detailData.production_companies[0]?.logo_path ?? null,
        });

        setYoutubeKey(fullData.videos.results[0]?.key ?? null);

        setSimilarMovies(
          fullData.similar.results.map((movie) => ({
            id: movie.id,
            backdrop_path: movie.backdrop_path || null,
            original_title: movie.original_title,
            poster_path: movie.poster_path || null,
            overview: movie.overview,
          })),
        );

        setTitleImagePath(fullData.images.logos[0]?.file_path ?? '');
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

    loadMovieData();
  }, [movieId]);

  const searchMovies = useCallback(async (query: string): Promise<Movie[]> => {
    try {
      const results = await searchMoviesApi(query);
      return results;
    } catch (err) {
      console.error('Search error:', err);
      throw new Error('検索中にエラーが発生しました');
    }
  }, []);

  return { movieDetail, youtubeKey, similarMovies, titleImagePath, isLoading, error, searchMovies };
};
