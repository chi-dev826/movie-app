import { useLocation, useOutlet, useNavigationType } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { horizontalSlideVariants } from '@/utils/animations';

/**
 * ルート切り替え時にスライドアニメーションを付与するコンポーネント。
 */
const AnimatedOutlet = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const navigationType = useNavigationType();

  // 1. 戻る操作（POP）の判定
  const isBack = navigationType === 'POP';
  const custom = isBack ? -1 : 1;

  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence mode="popLayout" custom={custom}>
        <motion.div
          key={location.pathname}
          custom={custom}
          variants={horizontalSlideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedOutlet;
