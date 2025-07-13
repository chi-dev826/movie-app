import MovieCard from './MovieCard';
import HeroMetadata from '../components/HeroMetadata';
import HeroMovie from '../components/HeroMovie';
import { useMovies } from '../hooks/useMovies';
import { TMDB_IMAGE_BASE_URL } from '../../config';
import '../styles/MovieDetail.css';

function MovieDetailPage() {
  const { movieDetail, youtubeKey, similarMovies, isLoading, error } = useMovies();
  const backdropUrl = `${TMDB_IMAGE_BASE_URL}original${movieDetail?.backdrop_path}`;

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  return (
    <div
      className="movie-page"
      style={{
        backgroundImage: `url(${backdropUrl})`,
      }}
    >
      {movieDetail && (
        <>
          <div className="MovieDetail-gradient"></div>

          <section className="hero-content">
            <HeroMetadata movieDetail={movieDetail} />
            <HeroMovie youtubeKey={youtubeKey} />
          </section>
          <section className="moviecard-section">
            <h2 className="moviecard-title">関連作品</h2>
            <div className="moviecard-list">
              {similarMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default MovieDetailPage;
