import { jsx as _jsx } from "react/jsx-runtime";
import { Swiper, SwiperSlide } from 'swiper/react';
import HeroSectionComponents from './HeroSection';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../styles/App.css';
import 'swiper/css/autoplay';
import 'swiper/css';
const HeroSwiper = ({ movies }) => {
    const SwiperSettings = {
        modules: [EffectCoverflow, Autoplay],
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 2,
        loop: true,
        autoplay: { delay: 10000, disableOnInteraction: false },
        coverflowEffect: {
            rotate: 0,
            stretch: 30,
            depth: 100,
            modifier: 1.5,
            slideShadows: false,
        },
    };
    return (_jsx(Swiper, { ...SwiperSettings, className: "hero-swiper", children: movies.map((movie) => (_jsx(SwiperSlide, { className: "hero-slide", children: _jsx(HeroSectionComponents, { movie: movie }, movie.id) }))) }));
};
export default HeroSwiper;
