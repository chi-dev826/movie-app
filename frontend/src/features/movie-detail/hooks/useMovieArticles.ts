import { useQuery } from '@tanstack/react-query';
import { fetchEigaComNews, fetchMovieAnalysis } from '../../../services/movieApi';
import { Article } from '@/types/domain'; // 共通の型定義からインポート

export const useMovieNews = (movieId: number, movieTitle: string) => {
  return useQuery<Article[], Error>({
    queryKey: ['movieNews', movieId],
    queryFn: async () => {
      const response = await fetchEigaComNews(movieId, movieTitle);
      return response;
    },
  });
};

export const useMovieAnalysis = (movieId: number, movieTitle: string) => {
  return useQuery<Article[], Error>({
    queryKey: ['movieAnalysis', movieId],
    queryFn: async () => {
      const response = await fetchMovieAnalysis(movieId, movieTitle);
      return response;
    },
  });
};
