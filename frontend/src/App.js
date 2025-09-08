import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        return _jsx("div", { children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    if (error) {
        return _jsx("div", { children: "\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F:" });
    }
    return (_jsxs("div", { children: [heroMovieList.length >= 3 && _jsx(HeroSwiper, { movies: heroMovieList }), _jsxs("section", { className: "moviecard-section", children: [_jsx("h3", { className: "movie-list__header", children: "\u4EBA\u6C17\u6620\u753B" }), _jsx("div", { className: "movie-list", children: popularMovies.map((movie) => (_jsx(MovieCard, { movie: movie }, movie.id))) })] })] }));
}
export default App;
