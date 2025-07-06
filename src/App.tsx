import { useEffect, useState } from 'react';
import HeroSwiper from './components/HeroSwiper.tsx';
import MovieCard from './components/MovieCard.tsx';
import type { Movie, MovieJson } from './types';

import './styles/App.css';

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  // 映画データ取得
  useEffect(() => {
    const fetchMovieList = async () => {
      const url = 'https://api.themoviedb.org/3/movie/popular?language=ja&page=1';
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      });

      const data = await response.json();
      const result = data.results;
      const movieList = result.map((movie: MovieJson) => ({
        id: movie.id,
        backdrop_path: movie.backdrop_path,
        original_title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
      }));
      setMovieList(movieList);
    };
    fetchMovieList();
  }, []);

  //ヒーローセクションデータ
  const heroMovieList = movieList
    .filter((movie) => movie.overview && movie.overview.trim() !== '')
    .slice(0, 5);

  return (
    <div>
      {heroMovieList.length >= 5 && (
        <>
          <HeroSwiper movies={heroMovieList} />
        </>
      )}

      <section className="movie-section">
        <h3 className="movie-list__header">人気映画</h3>
        {/* 映画リストの横スクロール */}
        <div className="movie-list">
          {movieList && (
            <>
              {movieList.map((movie: Movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
