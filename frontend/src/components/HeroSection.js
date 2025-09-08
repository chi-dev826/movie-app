import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/App.css';
import { Link } from 'react-router-dom';
import { TMDB_IMAGE_BASE_URL } from '../../config';
const HeroSection = ({ movie }) => {
    const backgorundImageUrl = `${TMDB_IMAGE_BASE_URL}original${movie.backdrop_path}`;
    const movieCardUrl = `${TMDB_IMAGE_BASE_URL}w300_and_h450_bestv2${movie.poster_path}`;
    return (_jsxs(Link, { to: `/movie/${movie.id}`, className: "heroMovie-img-wrap", style: {
            backgroundImage: `url(${backgorundImageUrl})`,
        }, children: [_jsx("div", { className: "heroMovie-gradient" }), _jsxs("div", { className: "heroMovie-overlay-content", children: [_jsx("div", { className: "heroMovie-card", children: _jsx("img", { src: `${movieCardUrl}` }) }), _jsx("h2", { className: "heroMovie-title", children: movie.original_title }), _jsx("p", { className: "heroMovie-overview", children: movie.overview })] })] }));
};
export default HeroSection;
