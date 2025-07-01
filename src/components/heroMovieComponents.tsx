import "../styles/App.css"
import { Link } from "react-router-dom";

type Movie = {
  id: string;
  poster_path: string;
  original_title: string;
  backdrop_path: string | null;
  overview: string | null;
};

type Props = {
  movie: Movie;
}

const HeroMovieComponents = (props: Props) => {
    const { movie } = props;

    return (
        <Link to={`/movies/${movie.id}`} 
          className="heroMovie-img-wrap"
          style = {{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          }}>
            <div className="heroMovie-gradient"></div>
            <div className="heroMovie-overlay-content">
              <div className="heroMovie-card">
              <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}/>
              </div>
              <h2 className="heroMovie-title">{movie.original_title}</h2>
              <p className="heroMovie-overview">{movie.overview}</p>
            </div>
        </Link>
    )
}

export default HeroMovieComponents;