import React from 'react';

/**
 * @summary 映画詳細画面のスケルトンスクリーン。
 * DetailHeroSection と DetailActionSection のレイアウト・スタイルを完全に模倣し、
 * ロード中のレイアウトシフト（ガタつき）を最小限に抑える。
 */
export const MovieDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      {/* --- DetailHeroSection スケルトン --- */}
      <section className="relative w-full overflow-hidden aspect-video 2xl:aspect-cinema bg-surface-container-high">
        {/* 背景画像のプレースホルダー */}
        <div className="w-full h-full bg-surface-container-highest" />

        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* 評価バッジのプレースホルダー (デスクトップ) */}
        <div className="absolute items-center hidden w-12 h-6 border rounded-md shadow-lg top-4 right-4 bg-surface-container-highest/80 backdrop-blur-md border-white/10 md:flex" />
      </section>

      {/* メタデータ スケルトン */}
      <section className="relative px-4 pt-4 pb-6 mx-auto max-w-7xl">
        <div className="mb-4">
          {/* タイトル プレースホルダー */}
          <div className="w-3/4 h-10 mb-4 rounded-lg bg-surface-container-highest md:h-12 md:w-1/2" />

          {/* 公開年、上映時間、評価ラインのプレースホルダー */}
          <div className="flex items-center gap-5 mt-3">
            <div className="w-12 h-4 rounded-md bg-surface-container-high" />
            <div className="w-1.5 h-1.5 rounded-full bg-surface-container-high" />
            <div className="w-16 h-4 rounded-md bg-surface-container-high" />
            <div className="w-1.5 h-1.5 rounded-full bg-surface-container-high" />
            <div className="w-10 h-4 rounded-md bg-surface-container-high" />
          </div>

          {/* ジャンルタグ プレースホルダー */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-6 rounded-full bg-surface-container-high" />
            ))}
          </div>
        </div>
      </section>

      {/* --- DetailActionSection スケルトン --- */}
      <section className="relative w-full px-4 pb-6 mx-auto xl:max-w-7xl">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            {/* メインアクションボタン (予告編) プレースホルダー */}
            <div className="flex-1 h-[60px] md:h-[68px] bg-surface-container-highest rounded-xl" />

            {/* サブアクションボタン (リスト追加) プレースホルダー */}
            <div className="flex-1 h-[60px] md:h-[68px] bg-surface-container-high rounded-xl" />
          </div>

          {/* サードアクションボタン (公式サイト) プレースホルダー */}
          <div className="w-full h-[52px] md:h-[60px] bg-surface-container-highest rounded-xl" />
        </div>
      </section>

      {/* --- その他のセクション (ストーリー、キャスト等) の簡易スケルトン --- */}
      <section className="px-4 py-8 mx-auto max-w-7xl">
        <div className="w-32 h-6 mb-4 rounded-md bg-surface-container-high" />
        <div className="space-y-2">
          <div className="w-full h-4 rounded-md bg-surface-container-low" />
          <div className="w-full h-4 rounded-md bg-surface-container-low" />
          <div className="w-2/3 h-4 rounded-md bg-surface-container-low" />
        </div>
      </section>
    </div>
  );
};
