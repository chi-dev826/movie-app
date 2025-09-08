import { useEffect, useState } from 'react';
import { fetchPopularMovies } from '../services/movieApi';
export const usePopularMovies = () => {
    const [popularMovies, setPupularMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const LoadPoupularMovies = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const movies = await fetchPopularMovies();
                setPupularMovies(movies);
            }
            catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }
                else {
                    setError('不明なエラーが発生しました。');
                }
            }
            finally {
                setIsLoading(false);
            }
        };
        LoadPoupularMovies();
    }, []);
    return { popularMovies, isLoading, error };
};
