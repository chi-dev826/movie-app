import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { APP_PATHS } from '@shared/constants/routes';

type Props = {
  title: string;
  subtitle?: string;
  type: string;
  variant?: 'primary' | 'secondary';
};

/**
 * セクション見出しコンポーネント
 *
 * `variant` によって視覚的な重要度を切り替える。
 * - `primary`: 公開予定・公開中など、注目させたいセクション向け。グラデーション＋装飾付き。
 * - `secondary`: 人気映画等の従来セクション向け。控えめなスタイル。
 *
 * @param title - セクションタイトル
 * @param subtitle - サブテキスト（primaryのみ表示）
 * @param type - APIのカテゴリタイプ（URLパラメータに使用）
 * @param variant - 見出しの視覚スタイル
 */
const SectionHeader = ({ title, subtitle, type, variant = 'secondary' }: Props) => {
  if (variant === 'primary') {
    return (
      <div className="relative px-2 pt-8 pb-3 md:pt-10 md:pb-4">
        {/* 装飾アクセントライン */}
        <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

        <Link
          to={APP_PATHS.MOVIES.BY_TYPE.replace(':type', type)}
          className="group/header inline-flex flex-col gap-1"
        >
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 rounded-full bg-gradient-to-b from-red-500 to-red-700 md:h-8 lg:h-9" />
            <span className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-md">
              {title}
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-200 md:w-6 md:h-6 group-hover/header:translate-x-1 group-hover/header:text-red-400 mt-1" />
          </span>
          {subtitle && (
            <span className="ml-3 text-xs text-gray-400 md:text-sm xl:text-base">{subtitle}</span>
          )}
        </Link>
      </div>
    );
  }

  // secondary (画像に合わせた強調スタイル)
  return (
    <div className="flex items-end justify-between mb-3 ml-2 mr-4 md:mb-5 lg:mb-6">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-md">
        {title}
      </h2>
      <Link
        to={APP_PATHS.MOVIES.BY_TYPE.replace(':type', type)}
        className="flex items-center text-xs md:text-sm font-bold text-red-500 hover:text-red-400 transition-colors pb-1"
      >
        すべて見る
        <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-0.5" />
      </Link>
    </div>
  );
};

export default SectionHeader;
