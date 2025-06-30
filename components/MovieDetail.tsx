import { useParams } from "react-router";
import { useEffect, useState } from "react";
import "../styles/MovieDetail.css";
import MovieCard from "./MovieCard";

type MovieDetailJson = {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: string;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
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

type Movie = {
  id: string;
  backdrop_path: string | null;
  original_title: string;
  overview: string;
  poster_path: string;
  year: number;
  rating: number;
  runtime: number;
  score: number;
  genres: string[];
  company_logo: string | null;
};

function MovieDetail() {
  const { movieId } = useParams();
  const [ similarMovieList, setSimilarMovie ] = useState<Movie[]>([]);
  const [ heroMovie, setHeroMovie ] = useState<Movie | null>(null);
  const [ youtubeKey, setYoutubeKey] = useState();

  useEffect(() => {
    const fetchMovie = async() => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=ja`
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        }
      });

      const data = (await response.json()) as MovieDetailJson
      setHeroMovie({
        id: data.id,
        backdrop_path: data.backdrop_path,
        original_title: data.original_title,
        overview: data.overview,
        poster_path: data.poster_path,
        year: data.release_date ? parseInt(data.release_date.slice(0, 4)) : 0,
        rating: data.vote_average,
        runtime: data.runtime,
        score: data.vote_count,
        genres: data.genres ? data.genres.map((g: { name: string }) => g.name) : [],
        company_logo: data.production_companies[0].logo_path,
      })
    };

    fetchMovie();
  }, [movieId])

  //Youtubeのkeyデータ取得
  useEffect(() => {
    const fetchUrl = async() => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=ja`;
      const response = await fetch(url, {
          headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        }
      });

      const data = await response.json();
      setYoutubeKey(data.results[0].key);

    }
    fetchUrl();
  }, [movieId])

  // 関連映画データ取得
  useEffect(() => {
    const fetchMovie = async () => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=ja&page=1`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        },
      });

      const data = await response.json();
      const result = data.results;
      const similarMovieList = result.map((movie: MovieJson) => ({
        id: movie.id,
        backdrop_path: movie.backdrop_path,
        original_title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        original_language: movie.original_language,
      }));
      setSimilarMovie(similarMovieList);
    };
    fetchMovie();
  }, [movieId]);
  
    return (
      <div className="movie-page"
       style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie?.backdrop_path})`,
         }}>
        {heroMovie && (
          <>
            <div className="MovieDetail-gradient"></div>

            <section className="hero-content">
              <div className="hero-metadata">
                <div key={heroMovie.id} className="MovieDetail-overlay-contents"> 
                  <img src={`https://image.tmdb.org/t/p/w92/${heroMovie.company_logo}`}
                       alt="logo"
                       className="company-logo" />
                  <h1 className="Movie-title">{heroMovie.original_title.replace(/\s+/g, "")}</h1>
                  <span className="MovieDetail-overlay">
                    <span>{heroMovie.year}・{heroMovie.runtime}分・{heroMovie.genres.join(",")}</span>
                  </span>
                  <p className="MovieDetail-overview">{heroMovie.overview}</p>
                </div>
              </div>
              <div className="video-container">
                <div className="video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=1&loop=1&rel=0&modestbranding=1&showinfo=0&controls=1`}
                    width="1200"
                    height="680"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </section>
            <section className="moviecard-section">
              <h2 className="moviecard-title">関連作品</h2>
              <div className="moviecard-list">
                {similarMovieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    )
}

export default MovieDetail;