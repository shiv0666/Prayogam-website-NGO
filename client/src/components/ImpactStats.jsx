import { useEffect, useRef, useState } from 'react';

const ImpactStats = ({ stats }) => {
  const [animatedValues, setAnimatedValues] = useState({});
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView || !stats?.length) {
      return undefined;
    }

    // Initialize animated values
    const initial = {};
    stats.forEach((stat) => {
      initial[stat._id] = 0;
    });
    setAnimatedValues(initial);

    const duration = 1800;
    const startTime = Date.now();
    let frameId = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const updated = {};
      stats.forEach((stat) => {
        const numericMatch = stat.value.match(/[\d,.]+/);
        if (numericMatch) {
          const targetNum = parseFloat(numericMatch[0].replace(/,/g, ''));
          updated[stat._id] = Math.floor(targetNum * easedProgress);
        }
      });

      setAnimatedValues(updated);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [hasEnteredView, stats]);

  const formatValue = (stat) => {
    const numericMatch = stat.value.match(/[\d,.]+/);
    const suffix = stat.value.replace(/[\d,.]+/, '').trim();
    
    if (numericMatch && animatedValues[stat._id] !== undefined) {
      const animated = animatedValues[stat._id];
      const formatted = animated.toLocaleString();
      return `${formatted}${suffix}`;
    }
    
    return stat.value;
  };

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef}>
      <div className="mb-4">
        <p className="section-kicker mb-2">Our Reach & Impact</p>
        <h2 className="section-title mb-0">The difference we make</h2>
      </div>
      
      <div className="row g-3">
        {stats.map((stat) => (
          <div key={stat._id} className="col-sm-6 col-lg-4">
            <div className="content-card stat-card p-4 h-100 text-center d-flex flex-column justify-content-center">
              {stat.icon && (
                <div className="stat-card-icon mb-3">
                  {stat.icon}
                </div>
              )}
              <div className="display-6 fw-bold stat-card-value mb-2">
                {formatValue(stat)}
              </div>
              <p className="text-muted mb-0 stat-card-copy">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactStats;
