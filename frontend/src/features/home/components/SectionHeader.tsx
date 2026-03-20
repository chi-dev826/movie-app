import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
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
            <span className="inline-block w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-red-700 md:h-7" />
            <span className="text-base font-bold tracking-wide text-white md:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl drop-shadow-lg">
              {title}
            </span>
            <ChevronRightIcon className="w-5 h-5 text-gray-400 transition-transform duration-200 md:w-6 md:h-6 group-hover/header:translate-x-1 group-hover/header:text-red-400" />
          </span>
          {subtitle && (
            <span className="ml-3 text-xs text-gray-400 md:text-sm xl:text-base">
              {subtitle}
            </span>
          )}
        </Link>
      </div>
    );
  }

  // secondary (従来のスタイル)
  return (
    <Link to={APP_PATHS.MOVIES.BY_TYPE.replace(':type', type)}>
      <span className="flex items-center gap-1 mb-1 ml-2 text-xs font-semibold text-gray-500 md:text-sm 2xl:text-md 3xl:text-lg hover:text-gray-300">
        {title}
        <ChevronRightIcon className="relative w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6 -bottom-px" />
      </span>
    </Link>
  );
};

export default SectionHeader;
