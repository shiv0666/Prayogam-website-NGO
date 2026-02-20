import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import nileshImage from '../ns.jpeg';
import bhudhanImage from '../bs.jpeg';
import akashImage from '../at1.jpeg';
import rr from '../rr.jpeg';
import img1 from '../img1.jpeg';
import img2 from '../img2.jpeg';
import img3 from '../img3.jpeg';


const founders = [
  {
    name: 'Nilesh Ghanshyam Sontakke',
    role: 'Founder,  Principal, Speaker, Poet, Writer',
    bio: 'Nilesh Ghanshyam Sontakke is the Principal and a visionary co-founder of the Prayogam Foundation, bringing deep passion for education, communication, and cultural expression to the organization. An accomplished speaker, poet, and writer, Nilesh uses the power of words and ideas to inspire communities and drive social impact. His creative work and leadership help guide Prayogam Foundation’s mission to uplift individuals through knowledge, arts, and purposeful dialogue.',
    image: nileshImage
  },
  {
    name: 'Bhushan Jadhav',
    role: 'Founder, Famous Singer, Z- Yuwa Sangeet Samrat fame',
    bio: 'Bhushan Jadhav is a renowned singer and co-founder of the Prayogam Foundation, widely celebrated for his artistry and cultural contributions. Known for his dynamic performances and influence in the music world, Bhudhan’s title as “Z- Yuwa Sangeet Samrat” reflects his commitment to nurturing youth and promoting musical expression. His creative leadership strengthens the Foundation’s focus on arts, culture, and community engagement.',
    image: bhudhanImage
  },
  {
    name: 'Akash Murlidhar Tale',
    role: 'Saptkhanjeri Vadak, Speaker, Poet',
    bio: 'Akash Murlidhar Tale plays a key role at the Prayogam Foundation as a distinguished Saptkhanjeri (a traditional rhythmic percussion) artist, speaker, and poet. With a deep connection to India’s artistic heritage and a compelling voice in cultural discourse, Akash champions creativity and community spirit. His artistic talents and thoughtful reflections help bring the Foundation’s programs to life, connecting tradition with modern social needs.',
    image: akashImage
  },
  {
    name: 'Rushabh Raut',
    role: 'Speaker',
    bio: 'Rushabh Raut is a dedicated speaker and community leader within the Prayogam Foundation. His passionate advocacy and insightful contributions help guide the Foundation’s mission of social impact and community empowerment.',
    image: rr
  }   
];


const teamPhotos = [
  {
    label: 'Volunteer Mentorship Circle',
    image: img1
  },
  {
    label: 'Field Program Team',
    image: img2
  },
  {
    label: 'Community Support Volunteers',
    image: img3
  }
];

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await api.get('/content/about');
        setContent(response.data);
      } catch (err) {
        setError('About content is not available yet.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) return <Loader />;

  return (
    <section>
      <ErrorMessage message={error} />
      <div className="page-hero mb-4">
        <p className="section-kicker text-white-50 mb-2">About Prayogam Foundation</p>
        <h1 className="section-title text-white">{content?.title || 'About Us'}</h1>
        <p className="mb-0 text-white-50">We believe lasting social impact is built through consistent local engagement and trust.</p>
      </div>
      <div className="content-card p-4 p-lg-5">
        <p className="lead text-muted mb-0">{content?.body || 'Please check back later.'}</p>
      </div>

      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title h3 mb-0">Founders</h2>
          <span className="section-kicker mb-0">Leadership stories</span>
        </div>
        <div className="row g-4">
          {founders.map((founder) => (
            <div className="col-lg-6" key={founder.name}>
              <div className="content-card h-100 overflow-hidden">
                <div className="w-100 d-flex align-items-center justify-content-center bg-light" style={{ height: '340px' }}>
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-100 h-100"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </div>
                <div className="p-4">
                  <h4 className="mb-1">{founder.name}</h4>
                  <p className="section-kicker mb-2">{founder.role}</p>
                  <p className="text-muted mb-0">{founder.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 content-card p-3 p-lg-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="section-title h3 mb-0">Volunteer & Staff Gallery</h2>
          <span className="section-kicker mb-0">Our people</span>
        </div>
        <div id="teamGalleryCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {teamPhotos.map((item, index) => (
              <button
                key={item.label}
                type="button"
                data-bs-target="#teamGalleryCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="carousel-inner rounded-4 overflow-hidden">
            {teamPhotos.map((item, index) => (
              <div key={item.label} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <div className="w-100 d-flex align-items-center justify-content-center" style={{ height: '420px', background: '#eef3f8' }}>
                  <img
                    src={item.image}
                    className="d-block w-100 h-100"
                    alt={item.label}
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </div>
                <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3">
                  <h5>{item.label}</h5>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#teamGalleryCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#teamGalleryCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
