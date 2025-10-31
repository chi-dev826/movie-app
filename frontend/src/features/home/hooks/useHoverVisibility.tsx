import { useEffect, useState, useRef } from 'react';

export const useHoverVisibility = (isHovered: boolean) => {
  const [isBackdropVisible, setIsBackdropVisible] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
    if (isHovered) {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = window.setTimeout(() => {
        setIsBackdropVisible(false);
      }, 1500); // 1.5秒後に背景を非表示にする
      setIsVideoVisible(true);

      return () => clearTimeout(timeoutId.current!);
    } else {
      clearTimeout(timeoutId.current!);
      setIsBackdropVisible(true);
      setIsVideoVisible(false);
    }
  }, [isHovered]);

  return { isBackdropVisible, isVideoVisible };
};
