import { ReactNode } from 'react';

type Props = {
  /** セクション内に表示するコンテンツ */
  children: ReactNode;
  /** 追加のスタイルクラス（必要な場合のみ使用、基本はデフォルトに従う） */
  className?: string;
  /** アンカーリンク等に使用するID */
  id?: string;
};

export const SectionContainer = ({ children, className = '', id }: Props) => {
  return (
    <section
      id={id}
      className={`
      w-full
      mt-10 mb-10
      px-4
      xl:px-12
      2xl:px-16
      3xl:px-20
      ${className}
    `}
    >
      {children}
    </section>
  );
};
