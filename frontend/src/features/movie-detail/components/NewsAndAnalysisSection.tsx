import { useMovieNews } from '../hooks/useMovieNews';

export default function NewsAndAnalysisSection({
  movieId,
  movieTitle,
}: {
  movieId: number;
  movieTitle: string;
}) {
  const { data: newsItems, isLoading, error } = useMovieNews(movieId, movieTitle);
  if (isLoading) {
    return <div>ニュースを読み込み中...</div>;
  }

  if (error) {
    return <div>ニュースの取得中にエラーが発生しました: {error.message}</div>;
  }

  return (
    <section className="z-20 mt-10 lg:m-12 2xl:m-16 3xl:m-20">
      <span className="text-2xl font-bold border-b-2 border-gray-700 xl:mt-0">関連ニュース</span>
      <div className="flex flex-col gap-3 mt-6 xl:gap-8 xl:grid xl:grid-cols-2 xl:hover">
        {newsItems?.map((item) => (
          <a
            key={item.title}
            href={`https://eiga.com/${item.url}`}
            className="flex p-2 bg-gray-800 border rounded-lg xl:p-4 xl:hover:transition xl:duration-300 border-gray-950 xl:hover:shadow-lg xl:hover:scale-110 xl:hover:bg-gray-700"
          >
            <div className="flex-shrink-0 h-24 w-36 xl:h-48 xl:w-64">
              {item.thumbnailUrl && (
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex flex-col ml-2 xl:p-2 xl:mx-2">
              <h3 className="overflow-hidden font-semibold text-md line-clamp-2 xl:p-3 md:text-lg xl:text-xl">
                {item.title}
              </h3>
              <p className="text-xs text-gray-300 line-clamp-4 xl:text-sm xl:line-clamp-5">
                {item.summary}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
