import { useEffect, useState } from 'react';

interface ILoadingBarProps {
  isLoading?: boolean;
}

export const LoadingBar = ({ isLoading }: ILoadingBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(interval);
            return 100;
          }
          const diff = Math.random() * 20;
          return Math.min(oldProgress + diff, 100);
        });
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="absolute left-0 top-0 z-loading h-1 w-full bg-transparent">
      <div
        className="bg-primary-normal h-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
