import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMovies } from '../hooks/useMovies';
import { TMDB_IMAGE_BASE_URL } from '../../config';
const HeroMetadata = ({ movieDetail }) => {
    const { titleImagePath } = useMovies();
    const logoUrl = `${TMDB_IMAGE_BASE_URL}w500${titleImagePath}`;
    const companyLogoUrl = `${TMDB_IMAGE_BASE_URL}w185${movieDetail.company_logo}`;
    return (_jsx("div", { className: "hero-metadata", children: _jsxs("div", { className: "MovieDetail-overlay-contents", children: [titleImagePath ? (_jsx("div", { className: "MovieDetail-header", children: _jsx("img", { src: logoUrl, alt: movieDetail.original_title, className: "MovieDetail-logo" }) })) : (_jsxs("div", { children: [_jsx("img", { src: `${companyLogoUrl}`, alt: movieDetail.original_title, className: "MovieDetail-poster" }), _jsx("h1", { className: "MovieDetail-title", children: movieDetail.original_title })] })), _jsx("span", { className: "MovieDetail-overlay", children: _jsxs("span", { children: [movieDetail.year, "\u30FB", movieDetail.runtime, "\u5206\u30FB", movieDetail.genres.join(',')] }) }), _jsx("p", { className: "MovieDetail-overview", children: movieDetail.overview })] }, movieDetail.id) }));
};
export default HeroMetadata;
