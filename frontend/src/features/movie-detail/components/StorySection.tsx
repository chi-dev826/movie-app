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
    <section className="px-4 py-6 max-w-7xl mx-auto border-t border-white/5">
      <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4 tracking-tight text-on-surface flex items-center gap-3">
        <span className="inline-block w-1 h-6 rounded-full bg-red-500 xl:h-7" />
        The Story
      </h3>
      <p className="font-body text-sm md:text-base text-on-surface-variant leading-relaxed font-medium">
        {overview || '概要はありません。'}
      </p>
    </section>
  );
};
