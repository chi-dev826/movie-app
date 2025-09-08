import { usePopularMovies } from './hooks/usePopularMovies';
import HeroSwiper from './components/HeroSwiper';
import MovieCard from './components/MovieCard';
import './styles/App.css';

function App() {
  const { popularMovies, isLoading, error } = usePopularMovies();

  //ヒーローセクション用データフィルタリング
  const heroMovieList = popularMovies
    .filter((movie) => movie.overview && movie.overview.trim() !== '')
    .slice(0, 5);

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました:</div>;
  }

  return (
    <div>
      {heroMovieList.length >= 3 && <HeroSwiper movies={heroMovieList} />}

      <section className="moviecard-section">
        <h3 className="movie-list__header">人気映画</h3>
        <div className="movie-list">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
