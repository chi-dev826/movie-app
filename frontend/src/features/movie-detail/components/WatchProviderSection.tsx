import React from 'react';
import { IMAGE_CONFIG } from '@/constants/config';

export interface WatchProvider {
  link?: string | null;
  logoPath: string | null;
  name: string;
}

interface WatchProviderSectionProps {
  watchProviders?: WatchProvider[];
}

/**
 * @summary 視聴可能なプロバイダー（VODサービス等）のアイコンを表示するコンポーネント。
 * @param {WatchProviderSectionProps} props - プロバイダー情報のリスト
 * @returns {React.ReactElement | null} プロバイダーがない場合はnullを返す
 */
export const WatchProviderSection: React.FC<WatchProviderSectionProps> = ({ watchProviders }) => {
  if (!watchProviders || watchProviders.length === 0) return null;

  return (
    <section className="w-full px-4 py-2 xl:max-w-7xl mx-auto flex flex-col items-start gap-2 overflow-hidden">
      <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest flex-shrink-0">
        Available on
      </span>
      <div className="flex flex-wrap gap-3">
        {watchProviders.map((provider, idx) =>
          provider.link ? (
            <a
              key={idx}
              href={provider.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative transition-transform hover:scale-110 active:scale-95"
            >
              <img
                src={`${IMAGE_CONFIG.IMAGE_BASE_URL}w92${provider.logoPath}`}
                alt={provider.name}
                title={provider.name}
                fetchPriority="high"
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-white/10 shadow-lg"
              />
            </a>
          ) : (
            <div key={idx} className="relative">
              <img
                src={`${IMAGE_CONFIG.IMAGE_BASE_URL}w92${provider.logoPath}`}
                alt={provider.name}
                title={provider.name}
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-white/10 shadow-lg opacity-50"
              />
            </div>
          ),
        )}
      </div>
    </section>
  );
};
