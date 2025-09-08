import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/App.css';
import { TMDB_IMAGE_BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
const MovieCard = ({ movie }) => {
    const movieImageUrl = `${TMDB_IMAGE_BASE_URL}w300_and_h450_bestv2${movie.poster_path}`;
    return (_jsxs(Link, { to: `/movie/${movie.id}`, className: "movie-img-wrap", children: [_jsx("img", { src: `${movieImageUrl}`, alt: movie.original_title, className: "movie-card__image" }), _jsx("div", { className: "movie-card__overlay", children: _jsx("h3", { className: "movie-card__title", children: movie.original_title }) })] }, movie.id));
};
export default MovieCard;
