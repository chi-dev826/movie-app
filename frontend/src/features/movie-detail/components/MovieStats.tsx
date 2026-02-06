import { MovieDetail } from '@/types/domain';
import { SectionContainer } from './SectionContainer';

type Props = {
  detail: MovieDetail;
};

const MovieStats = ({ detail }: Props) => {
  const formatCurrency = (value: number) => {
    if (value === 0) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    { label: '原題', value: detail.original_title },
    { label: '制作国', value: detail.production_countries.join(', ') || '-' },
    { label: '予算', value: formatCurrency(detail.budget) },
    { label: '興行収入', value: formatCurrency(detail.revenue) },
  ];

  const { directors, writers, composers } = detail.keyStaff;

  return (
    <SectionContainer className="text-white">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* スタッフ情報 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-yellow-500">主要スタッフ</h3>
          <dl className="space-y-2 text-sm">
            {directors.length > 0 && (
              <div className="flex flex-col">
                <dt className="text-gray-400">監督</dt>
                <dd className="font-medium">{directors.map((d) => d.name).join(', ')}</dd>
              </div>
            )}
            {writers.length > 0 && (
              <div className="flex flex-col">
                <dt className="text-gray-400">脚本</dt>
                <dd className="font-medium">{writers.map((w) => w.name).join(', ')}</dd>
              </div>
            )}
            {composers.length > 0 && (
              <div className="flex flex-col">
                <dt className="text-gray-400">音楽</dt>
                <dd className="font-medium">{composers.map((c) => c.name).join(', ')}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* 統計情報 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-yellow-500">詳細データ</h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="text-gray-400">{stat.label}</dt>
                <dd className="font-medium">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </SectionContainer>
  );
};

export default MovieStats;
