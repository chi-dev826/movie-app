import type { Movie } from '../types';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/App.css';
import 'swiper/css/autoplay';
import 'swiper/css';
type Props = {
    movies: Movie[];
};
declare const HeroSwiper: ({ movies }: Props) => import("react/jsx-runtime").JSX.Element;
export default HeroSwiper;
