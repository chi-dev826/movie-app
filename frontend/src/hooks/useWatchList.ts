import { useState, useEffect } from 'react';

export const useWatchList = () => {
  const [watchList, setWatchList] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('watchList');
    if (saved) {
      setWatchList(JSON.parse(saved));
    }
  }, []);

  const toggleWatchList = (movieId: number) => {
    let updatedList: number[];
    if (watchList.includes(movieId)) {
      updatedList = watchList.filter((id) => id !== movieId);
    } else {
      updatedList = [...watchList, movieId];
    }
    setWatchList(updatedList);
    localStorage.setItem('watchList', JSON.stringify(updatedList));
    return watchList;
  };

  // リストに映画が含まれているかを確認する関数
  const isInWatchList = (movieId: number) => {
    return watchList.includes(movieId);
  };

  return { watchList, toggleWatchList, isInWatchList };
};
