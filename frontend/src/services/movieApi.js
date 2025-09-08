const API_BASE_URL = 'http://localhost:8000/api'; // Updated to point to the FastAPI backend
/**
 * 人気映画リスト、映画の詳細、関連映画リスト、映画のyoutubeKeyを取得する
 * @returns 映画のリスト
 * @throws 通信やAPIのエラーが発生した場合
 */
export const fetchFromApi = async (endpoint) => {
    const url = `${API_BASE_URL}${endpoint}`;
    // Headers are no longer needed as the backend handles authentication
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
};
export const fetchPopularMovies = async () => {
    // The endpoint path is now just the part after the base URL
    const data = await fetchFromApi('/movie/popular?language=ja&page=1');
    return data.results.map((movie) => ({
        id: movie.id,
        backdrop_path: movie.backdrop_path,
        original_title: movie.original_title,
        poster_path: movie.poster_path,
        overview: movie.overview,
    }));
};
export const fetchMovieDetail = async (movieId) => {
    const data = await fetchFromApi(`/movie/${movieId}?language=ja`);
    return {
        id: data.id,
        backdrop_path: data.backdrop_path,
        original_title: data.original_title,
        poster_path: data.poster_path,
        overview: data.overview,
        year: new Date(data.release_date).getFullYear(),
        rating: data.vote_average,
        runtime: data.runtime,
        score: data.vote_average * 10, // Assuming score is a percentage
        genres: data.genres.map((genre) => genre.name),
        company_logo: data.production_companies[0]?.logo_path ?? null,
    };
};
export const fetchYoutubeKey = async (movieId) => {
    const data = await fetchFromApi(`/movie/${movieId}/videos?language=ja`);
    return data.results[0]?.key ?? null;
};
export const fetchSimilarMovies = async (movieId) => {
    const data = await fetchFromApi(`/movie/${movieId}/similar?language=ja&page=1`);
    return data.results.map((movie) => ({
        id: movie.id,
        backdrop_path: movie.backdrop_path,
        original_title: movie.original_title,
        poster_path: movie.poster_path,
        overview: movie.overview,
    }));
};
export const fetchTitleImagePath = async (movieId) => {
    const data = await fetchFromApi(`/movie/${movieId}/images?language=ja`);
    return data.logos[0]?.file_path ?? '';
};
