import HeroMovieComponents from "./components/heroMovieComponents.tsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import MovieCard from "./components/MovieCard.tsx";
import { EffectCoverflow, Autoplay } from "swiper/modules";

import "swiper/css/effect-coverflow";
import "./styles/App.css";
import 'swiper/css/autoplay';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type Movie = {
    id: string;
    backdrop_path: string;
    original_title: string;
    poster_path: string;
    overview: string;
};

type MovieJson = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: string;
    original_language: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
};

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  // 映画データ取得
  useEffect(() => {
    const fetchMovieList = async () => {
      const url = "https://api.themoviedb.org/3/movie/popular?language=ja&page=1";
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      });

      const data = await response.json();
      const result = data.results;
      console.log(result);
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
    .filter((movie) => movie.overview && movie.overview.trim() !== "")
    .slice(0, 5);

  return (
    <div>
      {heroMovieList.length >= 3 && (
      <Swiper
        modules={[EffectCoverflow, Autoplay]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={2}
        loop={true}
        autoplay={{ delay: 14000, disableOnInteraction: false }}
        coverflowEffect={{
          rotate: 0,      
          stretch: 30,
          depth: 100,
          modifier: 1.5,
          slideShadows: false,
        }}
        className="hero-swiper"
        >
      {heroMovieList.map((movie) => (
        <SwiperSlide key={movie.id} className="hero-slide">
          <HeroMovieComponents key={movie.id} movie={movie} />
        </SwiperSlide>
      ))}
      </Swiper>
      )}

      <section className="movie-section">
        <h3 className="movie-list__header">人気映画</h3>
        {/* 映画リストの横スクロール */}
        <div className="movie-list">
          {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
