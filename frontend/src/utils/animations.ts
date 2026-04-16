import { Variants } from 'framer-motion';

/**
 * Pattern A: 水平スライド (左右)
 * ページ階層の前後移動を表現。
 * 右矢印(→)などのUIコンポーネントとの整合性を保つための標準遷移。
 */
export const horizontalSlideVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute' as const,
    width: '100%',
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: 'relative' as const,
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    position: 'absolute' as const,
    width: '100%',
    transition: {
      x: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};
