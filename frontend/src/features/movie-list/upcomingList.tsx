import { Link } from 'react-router-dom';
import { useUpcomingMovies } from '@/hooks/useMovies';
import { ArrowLeft } from 'lucide-react';
import UpcomingListCard from './components/UpcomingListCard';

const UpcomingList = () => {
  const { data, isLoading, error } = useUpcomingMovies();

  const upcomingMovies = data
    ? data
        .filter((movie) => movie.release_date)
        .slice()
        .sort(
          (a, b) =>
            new Date(a.release_date ?? '').getTime() - new Date(b.release_date ?? '').getTime(),
        )
    : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen text-white bg-gray-900 pb-12">
      <div className="container px-4 py-8 mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center mb-4 text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
          <h1 className="mb-2 text-3xl font-bold">公開予定の映画</h1>
          <p className="text-gray-400">
            {upcomingMovies.length}件の映画
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingMovies &&
            upcomingMovies.map((movie) => (
              <UpcomingListCard key={movie.id} movie={movie} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingList;
