import { useQuery } from '@tanstack/react-query';
import { fetchEigaComNews } from '../../../services/movieApi'; // 相対パスでインポート
import { NewsItem } from '@/types/domain'; // 共通の型定義からインポート

export const useMovieNews = (movieId: number, movieTitle: string) => {
  return useQuery<NewsItem[], Error>({
    queryKey: ['movieNews', movieId],
    queryFn: async () => {
      const response = await fetchEigaComNews(movieId, movieTitle);
      return response;
    },
  });
};
