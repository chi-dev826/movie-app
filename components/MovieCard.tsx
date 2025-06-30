import "../styles/App.css";
import { Link } from "react-router-dom";

type Movie = {
  id: string;
  poster_path: string;
  original_title: string;
}

type Props = {
  movie: Movie;
}

const MovieCard = (props: Props) => {
    const { movie } = props;

    return (
        <Link to={`/movies/${movie.id}`} key={movie.id} className="movie-img-wrap">
            <img
                src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}
                alt={movie.original_title}
                className="movie-card__image"
            />
            <div className="movie-card__overlay">
                <h3 className="movie-card__title">{movie.original_title}</h3>
            </div>
        </Link>
    )
}

export default MovieCard;