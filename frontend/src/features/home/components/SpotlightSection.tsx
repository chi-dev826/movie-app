import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

import React, { ReactNode } from 'react';
import SectionHeader from './SectionHeader';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import { APP_PATHS } from '@shared/constants/routes';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/** スワイパーに表示する最大作品数 */
const SPOTLIGHT_COUNT = 5;

type Props<T> = {
  title: string;
  subtitle?: string;
  type: string;
  items: T[] | undefined;
  renderSpotlightItem: (item: T) => ReactNode;
  renderRemainingItem: (item: T) => ReactNode;
};

/**
 * スポットライトセクション
 *
 * 先頭N件を大型 `SpotlightCard` のスワイパーで表示し、
 * 残りのアイテムを横スクロール可能なカード列として表示する純粋なレイアウトセクション。
 *
 * @param title - セクションタイトル
 * @param subtitle - サブテキスト
 * @param type - カテゴリタイプ
 * @param items - 表示するアイテムのリスト
 * @param renderSpotlightItem - スワイパー内のアイテムを描画する関数
 * @param renderRemainingItem - 横スクロール内のアイテムを描画する関数
 */
const SpotlightSection = <T extends { id: number | string }>(props: Props<T>) => {
  const { title, subtitle, type, items, renderSpotlightItem, renderRemainingItem } = props;
  if (!items || items.length === 0) return null;

  const spotlightItems = items.slice(0, SPOTLIGHT_COUNT);
  const remainingItems = items.slice(SPOTLIGHT_COUNT);

  return (
    <div>
      <SectionHeader title={title} subtitle={subtitle} type={type} variant="primary" />

      {/* スポットライトスワイパー */}
      <div className="px-2 md:px-4 xl:px-6 spotlight-swiper">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={spotlightItems.length >= 3}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation
          watchSlidesProgress
          className="rounded-xl overflow-hidden"
        >
          {spotlightItems.map((item) => (
            <SwiperSlide key={item.id}>
              {renderSpotlightItem(item)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 残りのカード群 */}
      {remainingItems.length > 0 && (
        <div className="pt-4">
          {/* リスト表示ページへのリンク */}
          <Link to={APP_PATHS.MOVIES.BY_TYPE.replace(':type', type)}>
            <span className="flex items-center gap-1 mb-1 ml-4 text-xs font-semibold text-gray-500 hover:text-gray-300">
              {title}
              <ChevronRightIcon className="relative w-3 h-3 -bottom-px" />
            </span>
          </Link>
          <HorizontalScrollContainer>
            {remainingItems.map((item) => (
              <React.Fragment key={item.id}>
                {renderRemainingItem(item)}
              </React.Fragment>
            ))}
          </HorizontalScrollContainer>
        </div>
      )}
    </div>
  );
};

export default SpotlightSection;

