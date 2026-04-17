import React from 'react';

interface StorySectionProps {
  overview?: string;
}

/**
 * @summary 映画のあらすじを表示するコンポーネント。
 * @param {StorySectionProps} props - あらすじテキスト
 * @returns {React.ReactElement}
 */
export const StorySection: React.FC<StorySectionProps> = ({ overview }) => {
  return (
    <section className="w-full px-4 py-6 mx-auto border-t xl:max-w-7xl border-white/5">
      <h3 className="flex items-center gap-3 mb-4 text-2xl font-bold tracking-tight font-headline md:text-3xl text-on-surface">
        <span className="inline-block w-1 h-6 bg-red-500 rounded-full xl:h-7" />
        The Story
      </h3>
      <p className="text-sm font-medium leading-relaxed font-body md:text-base text-on-surface-variant">
        {overview || '概要はありません。'}
      </p>
    </section>
  );
};
