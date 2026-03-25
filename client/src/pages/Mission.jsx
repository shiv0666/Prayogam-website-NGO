import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import prayogamLogo from '../LOGOs/final.png';
import handsImage from '../random/hands.jpg';
import helpingHandsImage from '../random/helping hands.jpg';
import communityImage from '../random/images.jpg';
import plantImage from '../random/plant.jpg';
import globeImage from '../random/globe.jpg';
import educationSupportImage from '../extra/education-support.svg';
import socialSupportImage from '../extra/social-support.svg';
import environmentCareImage from '../extra/environment-care.svg';
import healthcareSupportImage from '../extra/healthcare-support.svg';

const defaultMissionContent = {
  title: 'Mission & Vision',
  body: 'To create inclusive opportunities in education, health, and community development.'
};

const defaultVisionCopy = 'A society where every individual has access to opportunities to thrive.';

const missionFocusAreas = [
  {
    title: 'Education',
    symbol: 'EDU',
    accentClass: 'education',
    image: educationSupportImage,
    backgroundImage: handsImage,
    copy: 'We support children with learning resources, mentoring, and opportunities that improve long-term educational continuity.'
  },
  {
    title: 'Social Development',
    symbol: 'SOC',
    accentClass: 'social',
    image: socialSupportImage,
    backgroundImage: helpingHandsImage,
    copy: 'We strengthen local communities through awareness drives, inclusion-led engagement, and youth participation programs.'
  },
  {
    title: 'Environment',
    symbol: 'ENV',
    accentClass: 'environment',
    image: environmentCareImage,
    backgroundImage: plantImage,
    copy: 'We encourage responsible habits and community action for cleaner surroundings, healthier neighborhoods, and greener futures.'
  },
  {
    title: 'Healthcare',
    symbol: 'HLT',
    accentClass: 'healthcare',
    image: healthcareSupportImage,
    backgroundImage: globeImage,
    copy: 'We contribute to better well-being through preventive awareness, local support efforts, and family-centered health initiatives.'
  }
];

const Mission = () => {
  const [content, setContent] = useState(defaultMissionContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await api.get('/content/mission');
        if (response.data && (response.data.title || response.data.body)) {
          setContent({
            title: response.data.title || defaultMissionContent.title,
            body: response.data.body || defaultMissionContent.body
          });
        } else {
          setContent(defaultMissionContent);
        }
      } catch (_err) {
        setContent(defaultMissionContent);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) return <Loader />;

  return (
    <section>
      <div className="page-hero mission-hero mb-4" style={{ backgroundImage: `linear-gradient(135deg, rgba(12, 34, 69, 0.76), rgba(19, 104, 132, 0.68)), url(${handsImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <p className="section-kicker text-white-50 mb-2">Mission & Vision</p>
        <h1 className="section-title text-white">{content?.title || defaultMissionContent.title}</h1>
        <p className="mb-0 text-white-50">Focused, inclusive, and people-centered action across urgent social priorities.</p>
      </div>
      <div className="content-card p-4 p-lg-5">
        <div className="row g-4 align-items-center mb-4">
          <div className="col-lg-7">
            <p className="lead text-muted mb-0">{content?.body || defaultMissionContent.body}</p>
          </div>
          <div className="col-lg-5">
            <div className="section-illustration-shell">
              <img
                src={prayogamLogo}
                alt="Prayogam Foundation Logo"
                className="section-illustration"
              />
            </div>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="p-4 border rounded-3 h-100 bg-light-subtle">
              <h6 className="mb-2">Mission</h6>
              <p className="text-muted mb-0">To create inclusive opportunities in education, health, and community development.</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 border rounded-3 h-100 bg-light-subtle">
              <h6 className="mb-2">Vision</h6>
              <p className="text-muted mb-0">{defaultVisionCopy}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mission-focus-wrap mt-4 mt-lg-5">
        <div className="mission-focus-head text-center mb-4 mb-lg-5">
          <p className="section-kicker mb-2">Our Key Areas</p>
          <h2 className="section-title mb-2">Four Focus Areas That Drive Our Mission</h2>
          <p className="mission-focus-intro text-muted mb-0">
            Our programs are designed to create practical and lasting impact where families need support the most.
          </p>
        </div>

        <div className="row g-4">
          {missionFocusAreas.map((area) => (
            <div className="col-sm-6 col-xl-3" key={area.title}>
              <article
                className={`focus-card focus-card-${area.accentClass} mission-focus-card h-100 p-4`}
                style={{
                  backgroundImage: `url(${area.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="mission-focus-content">
                  <div className="mission-focus-top d-flex align-items-center justify-content-between mb-3">
                    <span className="focus-symbol">{area.symbol}</span>
                    <img
                      src={area.image}
                      alt={`${area.title} focus icon`}
                      className="mission-focus-icon"
                    />
                  </div>
                  <h3 className="h4 mb-2 mission-focus-title">{area.title}</h3>
                  <p className="mb-0 mission-focus-copy">{area.copy}</p>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="mission-statement-band mt-4 mt-lg-5 p-4 p-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <p className="section-kicker mb-2">How We Work</p>
              <h3 className="section-title h2 mb-3">From Local Action to Long-Term Change</h3>
              <p className="mb-3 text-muted">
                We work with students, parents, community leaders, and volunteers to identify urgent needs and deliver practical support.
                Each initiative is built around dignity, participation, and measurable outcomes.
              </p>
              <p className="mb-0 text-muted">
                By combining education, social development, environmental care, and healthcare awareness, we create connected progress that
                strengthens the full community ecosystem.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="mission-media-shell">
                <img
                  src={communityImage}
                  alt="Community members engaged in a mission activity"
                  className="mission-media-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
