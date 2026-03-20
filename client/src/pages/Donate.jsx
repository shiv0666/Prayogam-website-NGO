import { useEffect, useMemo, useState } from 'react';
import qrCodeImage from '../extra/qr.png';
import api from '../services/api.js';
import donationImpactImage from '../random/donation.jpg';
import educationSupportImage from '../extra/education-support.svg';
import socialSupportImage from '../extra/social-support.svg';
import environmentCareImage from '../extra/environment-care.svg';
import healthcareSupportImage from '../extra/healthcare-support.svg';
import educationBgImage from '../random/education.jpg';
import socialBgImage from '../random/helping hands.jpg';
import environmentBgImage from '../random/plant.jpg';
import healthcareBgImage from '../random/health1.jpg';
import donationHeroImage from '../extra/donation page.jpg';
import ImpactCalculator from '../components/ImpactCalculator.jsx';

const donationCategories = [
  {
    title: 'Education',
    image: educationSupportImage,
    backgroundImage: educationBgImage,
    description: 'Support learning materials, mentoring, and better access to educational opportunities.'
  },
  {
    title: 'Social Welfare',
    image: socialSupportImage,
    backgroundImage: socialBgImage,
    description: 'Strengthen community initiatives focused on inclusion, support, and local well-being.'
  },
  {
    title: 'Environment',
    image: environmentCareImage,
    backgroundImage: environmentBgImage,
    description: 'Enable awareness and action that encourages cleaner, healthier surroundings.'
  },
  {
    title: 'Healthcare',
    image: healthcareSupportImage,
    backgroundImage: healthcareBgImage,
    description: 'Support health awareness, preventive care, and stronger well-being for families.'
  }
];

const presetAmounts = [50, 100, 250, 500];

const Donate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Education'
  });
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedDonation, setSubmittedDonation] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [volunteerData, setVolunteerData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: ''
  });
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);
  const [volunteerError, setVolunteerError] = useState('');
  const [volunteerSuccess, setVolunteerSuccess] = useState('');

  const resolvedAmount = useMemo(() => {
    if (customAmount.trim()) {
      return Number(customAmount);
    }
    return selectedAmount;
  }, [customAmount, selectedAmount]);

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, category }));
  };

  const handlePresetAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (event) => {
    setCustomAmount(event.target.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleVolunteerInputChange = (event) => {
    const { name, value } = event.target;
    setVolunteerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVolunteerSubmit = async (event) => {
    event.preventDefault();
    setVolunteerError('');
    setVolunteerSuccess('');
    setVolunteerSubmitting(true);

    try {
      await api.post('/volunteers/register', volunteerData);
      setVolunteerSuccess('Thank you for volunteering. Your registration has been submitted.');
      setVolunteerData({ name: '', email: '', phone: '', city: '', message: '' });
      window.setTimeout(() => {
        setIsVolunteerModalOpen(false);
        setVolunteerSuccess('');
      }, 1200);
    } catch (_error) {
      setVolunteerError('Unable to submit volunteer registration right now. Please try again.');
    } finally {
      setVolunteerSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = Number.isFinite(resolvedAmount) && resolvedAmount > 0 ? resolvedAmount : selectedAmount;
    try {
      await api.post('/donations', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        amount
      });
    } catch (_err) {
      // Record best-effort; still show QR so donor can proceed
    }
    setSubmittedDonation({
      amount,
      category: formData.category,
      paymentStatus: 'Pending'
    });
    setIsModalOpen(true);
  };

  return (
    <section>
      <div className="donate-landing-wrap mb-5">
        <div
          className="donate-hero-banner"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${donationHeroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container donate-hero-content">
            <div className="donate-hero-text">
              <p className="section-kicker text-white-50 mb-2">Donate Now</p>
              <h1 className="donate-hero-title mb-3">You Can Help Change Lives</h1>
              <p className="donate-hero-subtitle mb-4">
                Every contribution supports education, healthcare, and community development.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn donate-hero-btn"
                  onClick={() => {
                    setShowDonationForm(true);
                    window.setTimeout(() => {
                      const formSection = document.getElementById('donation-form-section');
                      if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 30);
                  }}
                >
                  Donate Now
                </button>
                <button type="button" className="btn donate-hero-secondary-btn" onClick={() => setIsVolunteerModalOpen(true)}>
                  Become Volunteer
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="content-card p-4 p-lg-5 mt-4 mb-4">
        <h2 className="section-title h3 mb-2">Your Impact Calculator</h2>
        <p className="text-muted mb-4">See how your contribution can power real outcomes in communities.</p>
        <ImpactCalculator />
      </div>

      {showDonationForm && (
        <div className="row g-4 align-items-stretch reveal-on-scroll is-visible" id="donation-form-section">
          <div className="col-lg-7">
            <div className="form-card bg-white p-4 p-lg-5 h-100 donate-form-shell">
              <div className="mb-4">
                <h5 className="mb-2">Make a Donation</h5>
                <p className="text-muted mb-0">Click Donate Now and scan the QR code to complete your payment.</p>
              </div>

              <form className="form" onSubmit={handleSubmit}>
                <div>
                  <label className="form-label fw-semibold">1. Select a cause</label>
                  <div className="row g-3 mt-1">
                    {donationCategories.map((category) => (
                      <div className="col-md-6" key={category.title}>
                        <button
                          type="button"
                          className={`donation-category-card donation-category-with-bg ${formData.category === category.title ? 'active' : ''}`}
                          style={{
                            backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.56)), url(${category.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                          onClick={() => handleCategorySelect(category.title)}
                        >
                          <span className="fw-semibold d-block mb-1 donation-category-title">{category.title}</span>
                          <span className="small d-block donation-category-desc">{category.description}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">2. Choose an amount</label>
                  <div className="d-flex flex-wrap gap-2 mt-1 mb-3">
                    {presetAmounts.map((amount) => {
                      const isActive = !customAmount && selectedAmount === amount;
                      return (
                        <button
                          type="button"
                          key={amount}
                          className={`donation-amount-chip ${isActive ? 'active' : ''}`}
                          onClick={() => handlePresetAmountSelect(amount)}
                        >
                          ₹{amount}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    className="form-control"
                    name="customAmount"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Or enter a custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold">3. Donor details</label>
                  <div className="row g-3 mt-1">
                    <div className="col-12">
                      <input
                        className="form-control"
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-control"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="donation-submit-row d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <p className="small text-muted mb-1">Selected category</p>
                    <strong>{formData.category}</strong>
                  </div>
                  <div>
                    <p className="small text-muted mb-1">Selected amount</p>
                    <strong>₹{Number.isFinite(resolvedAmount) && resolvedAmount > 0 ? resolvedAmount : 0}</strong>
                  </div>
                  <button className="btn btn-primary" type="submit">
                    Donate Now
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="content-card p-4 p-lg-5 h-100 donate-side-panel">
              <div className="section-illustration-shell section-illustration-shell-compact mb-4">
                <img
                  src={donationImpactImage}
                  alt="Illustration showing donations creating visible community impact"
                  className="section-illustration"
                />
              </div>
              <p className="section-kicker mb-2">Donation Impact</p>
              <h3 className="section-title h2 mb-3">Every contribution supports action on the ground.</h3>
              <p className="text-muted mb-4">
                Your support helps Prayogam Foundation continue programs across education, social welfare, environment, and healthcare for communities that need consistent support.
              </p>
              <div className="donate-impact-list d-grid gap-3">
                <div className="donate-impact-item">
                  <strong className="d-block mb-1">Education</strong>
                  <span className="text-muted">Learning access, mentorship, and youth development support.</span>
                </div>
                <div className="donate-impact-item">
                  <strong className="d-block mb-1">Social Welfare</strong>
                  <span className="text-muted">Community support systems and awareness-led initiatives.</span>
                </div>
                <div className="donate-impact-item">
                  <strong className="d-block mb-1">Environment</strong>
                  <span className="text-muted">Programs that encourage safer and more sustainable local environments.</span>
                </div>
                <div className="donate-impact-item">
                  <strong className="d-block mb-1">Healthcare</strong>
                  <span className="text-muted">Health awareness and community well-being initiatives.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isVolunteerModalOpen && (
        <div className="program-modal-backdrop" role="presentation" onClick={() => setIsVolunteerModalOpen(false)}>
          <div className="program-modal-panel content-card volunteer-modal-panel" role="dialog" aria-modal="true" aria-labelledby="volunteer-modal-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="program-modal-close" onClick={() => setIsVolunteerModalOpen(false)} aria-label="Close volunteer form">
              ×
            </button>
            <div className="p-4 p-md-5">
              <p className="section-kicker mb-2">Become Volunteer</p>
              <h2 className="section-title h4 mb-3" id="volunteer-modal-title">Volunteer Registration</h2>

              <form className="form" onSubmit={handleVolunteerSubmit}>
                <input className="form-control" name="name" placeholder="Full Name" value={volunteerData.name} onChange={handleVolunteerInputChange} required />
                <input className="form-control" type="email" name="email" placeholder="Email" value={volunteerData.email} onChange={handleVolunteerInputChange} required />
                <input className="form-control" name="phone" placeholder="Phone Number" value={volunteerData.phone} onChange={handleVolunteerInputChange} required />
                <input className="form-control" name="city" placeholder="City" value={volunteerData.city} onChange={handleVolunteerInputChange} required />
                <textarea className="form-control" rows="4" name="message" placeholder="Message (optional)" value={volunteerData.message} onChange={handleVolunteerInputChange} />

                {volunteerError && <p className="text-danger small mb-0">{volunteerError}</p>}
                {volunteerSuccess && <p className="text-success small mb-0">{volunteerSuccess}</p>}

                <button type="submit" className="btn btn-primary" disabled={volunteerSubmitting}>
                  {volunteerSubmitting ? 'Submitting...' : 'Register as Volunteer'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && submittedDonation && (
        <div className="donation-modal-backdrop" role="presentation" onClick={handleModalClose}>
          <div
            className="donation-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="donation-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="donation-modal-close" onClick={handleModalClose} aria-label="Close">
              ×
            </button>
            <p className="section-kicker mb-2">Complete Your Donation</p>
            <h2 className="section-title h3 mb-2" id="donation-modal-title">Complete Your Donation</h2>
            <p className="text-muted mb-4">Please scan the QR code below to complete your donation.</p>
            <div className="donation-qr-panel text-center mb-4">
              <img src={qrCodeImage} alt="QR code for donation payment" className="img-fluid donation-qr-image" />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <div className="donation-modal-meta h-100">
                  <span className="small text-muted d-block mb-1">Donation amount</span>
                  <strong>₹{submittedDonation.amount}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="donation-modal-meta h-100">
                  <span className="small text-muted d-block mb-1">Selected category</span>
                  <strong>{submittedDonation.category}</strong>
                </div>
              </div>
            </div>
            <div className="donation-modal-meta">
              <span className="small text-muted d-block mb-1">Payment status</span>
              <strong>{submittedDonation.paymentStatus}</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Donate;
