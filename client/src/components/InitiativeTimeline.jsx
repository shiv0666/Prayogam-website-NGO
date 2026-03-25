import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api.js';
import readingImg from '../extra/reading.png';

const defaultTimelineItem = {
  _id: 'default-reading-room',
  title: 'Reading Room Initiative',
  description:
    'Prayogam Foundation has launched a reading room for students at minimal cost to support education and self-learning.',
  image: readingImg,
  date: '',
  order: 0
};

const placeholderItems = [
  {
    _id: 'placeholder-1',
    title: 'Coming Soon',
    description: 'A new grassroots initiative will be added here soon.',
    image: '',
    date: '',
    isPlaceholder: true,
    order: 9990
  }
];

const resolveMediaUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/uploads')) {
    const base = import.meta.env.DEV ? `http://${window.location.hostname}:5050` : '';
    return `${base}${path}`;
  }
  return path;
};

const normalizeTitle = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const READING_ROOM_KEY = normalizeTitle(defaultTimelineItem.title);

function generatePath(points) {
  if (points.length < 2) return '';

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1];
    const curr = points[index];
    const midY = (prev.y + curr.y) / 2;

    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }

  return d;
}

const InitiativeTimeline = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const [curve, setCurve] = useState({ d: '', width: 0, height: 0, length: 0 });
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const curvePathRef = useRef(null);
  const nodeRefs = useRef({});

  useEffect(() => {
    const loadInitiatives = async () => {
      try {
        const response = await api.get('/initiatives');
        setInitiatives(Array.isArray(response.data) ? response.data : []);
      } catch {
        setInitiatives([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitiatives();
  }, []);

  const items = useMemo(() => {
    const preparedInitiatives = initiatives
      .map((item) => ({
        ...item,
        image: resolveMediaUrl(item.image)
      }))
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    const hasReadingRoomInApi = preparedInitiatives.some(
      (item) => normalizeTitle(item.title).startsWith(READING_ROOM_KEY)
    );

    const baseItems = hasReadingRoomInApi
      ? preparedInitiatives
      : [
          {
            ...defaultTimelineItem,
            image: resolveMediaUrl(defaultTimelineItem.image)
          },
          ...preparedInitiatives
        ];

    return [...baseItems, ...placeholderItems];
  }, [initiatives]);

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loading || !trackRef.current) return undefined;

    const buildCurvePath = () => {
      const trackElement = trackRef.current;
      if (!trackElement) return;

      const trackRect = trackElement.getBoundingClientRect();
      const points = items
        .map((item, index) => {
          const itemId = item._id || `${item.title}-${index}`;
          return nodeRefs.current[itemId];
        })
        .filter(Boolean)
        .map((nodeEl) => {
          const rect = nodeEl.getBoundingClientRect();
          return {
            x: rect.left - trackRect.left + rect.width / 2,
            y: rect.top - trackRect.top + rect.height / 2
          };
        });

      if (points.length < 2) {
        setCurve((prev) => ({ ...prev, d: '', length: 0, width: trackElement.clientWidth, height: trackElement.scrollHeight }));
        return;
      }

      const d = generatePath(points);

      const width = trackElement.clientWidth;
      const height = Math.max(trackElement.scrollHeight, Math.ceil(points[points.length - 1].y + 80));
      setCurve({ d, width, height, length: 0 });

      requestAnimationFrame(() => {
        if (curvePathRef.current) {
          const length = curvePathRef.current.getTotalLength();
          setCurve((prev) => ({ ...prev, length }));
        }
      });
    };

    buildCurvePath();

    window.addEventListener('resize', buildCurvePath);

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => buildCurvePath());
      resizeObserver.observe(trackRef.current);
    }

    return () => {
      window.removeEventListener('resize', buildCurvePath);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [items, loading, activeId]);

  const toggleItem = (id) => {
    setActiveId((previous) => (previous === id ? null : id));
  };

  return (
    <section ref={sectionRef} className={`initiative-timeline-wrap p-4 p-lg-5 ${isInView ? 'is-inview' : ''}`}>
      <div className="text-center mb-4 mb-lg-5">
        <p className="section-kicker mb-2">Our Journey</p>
        <h2 className="section-title mb-2">Our Journey of Impact</h2>
        <p className="mb-0 initiative-timeline-intro">
          A growing roadmap of programs and milestones that reflect our commitment to meaningful community impact.
        </p>
      </div>

      <div
        ref={trackRef}
        className="initiative-timeline-track"
        style={{ '--timeline-curve-length': `${curve.length || 1}` }}
      >
        {curve.d && (
          <svg
            className="initiative-timeline-curve timeline-svg"
            width={curve.width}
            height={curve.height}
            viewBox={`0 0 ${curve.width} ${curve.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="initiativeJourneyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <path className="initiative-timeline-curve-base" d={curve.d} />
            <path
              ref={curvePathRef}
              className="initiative-timeline-curve-progress"
              d={curve.d}
              stroke="url(#initiativeJourneyGradient)"
            />
          </svg>
        )}

        {items.map((item, index) => {
          const itemId = item._id || `${item.title}-${index}`;
          const isRight = index % 2 === 1;
          const hasImage = Boolean(item.image);
          const isActive = activeId === itemId;
          const nodeLabel = String(index + 1);

          return (
            <article
              key={itemId}
              className={`initiative-timeline-item ${isRight ? 'is-right' : 'is-left'} ${item.isPlaceholder ? 'is-placeholder' : ''} ${isInView ? 'is-visible' : ''} ${isActive ? 'is-active' : ''}`}
              style={{ '--timeline-delay': `${Math.min(index, 8) * 90}ms` }}
            >
              <button
                type="button"
                className="initiative-timeline-dot journey-node"
                ref={(node) => {
                  nodeRefs.current[itemId] = node;
                }}
                onClick={() => toggleItem(itemId)}
                title={item.title}
                aria-label={`Open ${item.title}`}
              >
                <span className="initiative-timeline-dot-label">{nodeLabel}</span>
              </button>

              <div className="initiative-timeline-card" onClick={() => toggleItem(itemId)} role="button" tabIndex={0} onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  toggleItem(itemId);
                }
              }}>
                <div className="initiative-timeline-media initiative-timeline-media-summary">
                  {hasImage ? (
                    <img src={item.image} alt={item.title} className="initiative-timeline-image" loading="lazy" />
                  ) : (
                    <div className="initiative-timeline-image-placeholder">Planned</div>
                  )}
                </div>
                <div className="initiative-timeline-body">
                  {item.date && !isActive && (
                    <p className="initiative-timeline-date mb-2">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}
                  {item.isPlaceholder && <p className="initiative-timeline-status mb-2">Planned</p>}
                  <h3 className="h5 mb-0 initiative-timeline-title">{item.title}</h3>
                  <p className="mb-0 initiative-timeline-snippet">{item.description}</p>
                </div>
                <div className={`initiative-timeline-expand ${isActive ? 'is-open' : ''}`}>
                  <div className="initiative-timeline-expand-inner">
                    {item.date && (
                      <p className="initiative-timeline-date mb-2">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    )}
                    <p className="mb-0 initiative-timeline-copy">{item.description}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default InitiativeTimeline;
