import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import contactSupportImage from '../random/get.png';
import donationBannerImage from '../random/donation banner.jpg';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId') || '';
  const eventTitleParam = searchParams.get('eventTitle') || '';

  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [volunteerFormData, setVolunteerFormData] = useState({ name: '', email: '', phone: '', city: '', message: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventLoading, setSelectedEventLoading] = useState(false);
  const [volunteerError, setVolunteerError] = useState('');
  const [volunteerSuccess, setVolunteerSuccess] = useState('');
  const [volunteerSubmitting, setVolunteerSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data);
      } catch (err) {
        setSettings(null);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const loadSelectedEvent = async () => {
      if (!eventId) {
        setSelectedEvent(null);
        setVolunteerError('');
        return;
      }

      setSelectedEventLoading(true);
      try {
        const response = await api.get(`/volunteers/event/${eventId}`);
        setSelectedEvent(response.data);
        setVolunteerError('');
      } catch (err) {
        setSelectedEvent(null);
        setVolunteerError('Could not load event details right now. You can still submit the volunteer request.');
      } finally {
        setSelectedEventLoading(false);
      }
    };

    loadSelectedEvent();
  }, [eventId]);

  const remainingSlots = useMemo(() => {
    if (!selectedEvent) return null;
    return Math.max(0, Number(selectedEvent.remainingVolunteers || 0));
  }, [selectedEvent]);

  const isEventFull = typeof remainingSlots === 'number' && remainingSlots <= 0;

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleVolunteerChange = (event) => {
    setVolunteerFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/contact', formData);
      setSuccess('Message sent successfully.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Unable to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVolunteerSubmit = async (event) => {
    event.preventDefault();
    setVolunteerError('');
    setVolunteerSuccess('');
    setVolunteerSubmitting(true);

    try {
      await api.post('/volunteers', {
        eventId,
        ...volunteerFormData
      });

      setVolunteerSuccess('You are successfully registered for this event.');
      setVolunteerFormData({ name: '', email: '', phone: '', city: '', message: '' });

      if (eventId) {
        try {
          const response = await api.get(`/volunteers/event/${eventId}`);
          setSelectedEvent(response.data);
        } catch {
          // Keep success state even if event refetch fails.
        }
      }
    } catch (err) {
      const fieldError = Array.isArray(err?.response?.data?.errors)
        ? err.response.data.errors[0]?.msg
        : '';
      setVolunteerError(fieldError || err?.response?.data?.message || 'Unable to submit volunteer request.');
    } finally {
      setVolunteerSubmitting(false);
    }
  };

  return (
    <section>
      <div className="page-hero contact-hero mb-4" style={{ backgroundImage: `linear-gradient(135deg, rgba(8, 22, 46, 0.8), rgba(14, 72, 92, 0.72)), url(${donationBannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <p className="section-kicker text-white-50 mb-2">Contact</p>
        <h1 className="section-title text-white mb-2">Get in Touch</h1>
        <p className="mb-0 text-white-50">Partner with Prayogam Foundation, ask questions, or share how you’d like to contribute.</p>
      </div>
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="content-card p-4 h-100">
            <div className="section-illustration-shell section-illustration-shell-compact mb-4">
              <img
                src={contactSupportImage}
                alt="Illustration of support staff connecting with communities and partners"
                className="section-illustration"
              />
            </div>
            <h5 className="mb-3">Get in touch</h5>
            <p className="text-muted mb-2">{settings?.address || 'Address will be updated by admin.'}</p>
            <p className="mb-2"><strong>Contact:</strong> {settings?.contact || 'Not available'}</p>
            <p className="mb-2"><strong>Founder:</strong> {settings?.founder || 'Not available'}</p>
            <p className="mb-0"><strong>Location:</strong> {settings?.location || 'Not available'}</p>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="form-card bg-white p-4 p-lg-5 h-100">
            <h5 className="mb-3">Send a message</h5>
            <form className="form" onSubmit={handleSubmit}>
            <ErrorMessage message={error} />
            {success && <div className="success">{success}</div>}
            <input
              className="form-control"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className="form-control"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              className="form-control"
              name="message"
              placeholder="Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
            </form>
          </div>
        </div>
      </div>

      {eventId && (
        <div className="row g-4 mt-1">
          <div className="col-12">
            <div className="content-card p-4 p-lg-5">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                <div>
                  <p className="section-kicker mb-2">Event Volunteer Registration</p>
                  <h3 className="h4 mb-1">{selectedEvent?.title || eventTitleParam || 'Selected Event'}</h3>
                  {selectedEvent && (
                    <p className="text-muted mb-0">
                      {new Date(selectedEvent.date).toLocaleDateString()} | {selectedEvent.location || 'Location to be announced'}
                    </p>
                  )}
                </div>
                {selectedEvent && (
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-primary">Needed: {selectedEvent.totalVolunteersRequired || 0}</span>
                    <span className="badge text-bg-info">Registered: {selectedEvent.currentApprovedVolunteers || 0}</span>
                    <span className={`badge ${isEventFull ? 'text-bg-danger' : 'text-bg-success'}`}>
                      {isEventFull ? 'Full' : `${remainingSlots} spots left`}
                    </span>
                  </div>
                )}
              </div>

              <ErrorMessage message={volunteerError} />
              {selectedEventLoading && <p className="text-muted small mb-3">Loading event details...</p>}
              {volunteerSuccess && <div className="success mb-3">{volunteerSuccess}</div>}

              <form className="form" onSubmit={handleVolunteerSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      name="name"
                      placeholder="Full Name"
                      value={volunteerFormData.name}
                      onChange={handleVolunteerChange}
                      required
                      disabled={!eventId || isEventFull || volunteerSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={volunteerFormData.email}
                      onChange={handleVolunteerChange}
                      required
                      disabled={!eventId || isEventFull || volunteerSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      name="phone"
                      placeholder="Phone Number"
                      value={volunteerFormData.phone}
                      onChange={handleVolunteerChange}
                      required
                      disabled={!eventId || isEventFull || volunteerSubmitting}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      name="city"
                      placeholder="City"
                      value={volunteerFormData.city}
                      onChange={handleVolunteerChange}
                      required
                      disabled={!eventId || isEventFull || volunteerSubmitting}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control"
                      name="message"
                      placeholder="Message (optional)"
                      rows="4"
                      value={volunteerFormData.message}
                      onChange={handleVolunteerChange}
                      disabled={!eventId || isEventFull || volunteerSubmitting}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!eventId || isEventFull || volunteerSubmitting}
                  >
                    {isEventFull ? 'Event Full' : volunteerSubmitting ? 'Submitting...' : 'Volunteer for This Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
