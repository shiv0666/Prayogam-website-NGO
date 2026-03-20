import { useEffect, useState } from 'react';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const nextProgress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setProgress(nextProgress);
      setVisible(scrollTop > 320);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={handleClick}
      aria-label="Back to top"
      title="Back to top"
      style={{ '--scroll-progress': `${Math.round(progress * 360)}deg` }}
    >
      <span className="back-to-top-icon" aria-hidden="true">↑</span>
    </button>
  );
};

export default BackToTop;
