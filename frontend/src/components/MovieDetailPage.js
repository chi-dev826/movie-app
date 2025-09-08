import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import MovieCard from './MovieCard';
import HeroMetadata from '../components/HeroMetadata';
import HeroMovie from '../components/HeroMovie';
import { useMovies } from '../hooks/useMovies';
import { TMDB_IMAGE_BASE_URL } from '../../config';
import '../styles/MovieDetailPage.css';
function MovieDetailPage() {
    const { movieDetail, youtubeKey, similarMovies, isLoading, error } = useMovies();
    const backdropUrl = `${TMDB_IMAGE_BASE_URL}original${movieDetail?.backdrop_path}`;
    if (isLoading) {
        return _jsx("div", { children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    if (error) {
        return _jsx("div", { children: "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F" });
    }
    return (_jsx("div", { className: "movie-page", style: {
            backgroundImage: `url(${backdropUrl})`,
        }, children: movieDetail && (_jsxs(_Fragment, { children: [_jsx("div", { className: "MovieDetail-gradient" }), _jsxs("section", { className: "hero-content", children: [_jsx(HeroMetadata, { movieDetail: movieDetail }), _jsx(HeroMovie, { youtubeKey: youtubeKey })] }), _jsxs("section", { className: "moviecard-section", children: [_jsx("h2", { className: "moviecard-title", children: "\u95A2\u9023\u4F5C\u54C1" }), _jsx("div", { className: "moviecard-list", children: similarMovies.map((movie) => (_jsx(MovieCard, { movie: movie }, movie.id))) })] })] })) }));
}
export default MovieDetailPage;
