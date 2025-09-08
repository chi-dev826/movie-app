import type { Movie } from '../types';
export declare const usePopularMovies: () => {
    popularMovies: Movie[];
    isLoading: boolean;
    error: string | null;
};
