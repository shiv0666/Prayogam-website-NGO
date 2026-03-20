import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  city: '',
  message: ''
};

const VolunteerRegistration = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/volunteers/event/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load event details.');
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const remainingSlots = useMemo(() => {
    if (!event) return 0;
    return Math.max(0, Number(event.remainingVolunteers || 0));
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/volunteers', {
        eventId,
        ...formData
      });

      setSuccess('Your request has been submitted. Await admin approval.');
      setFormData(emptyForm);

      const eventResponse = await api.get(`/volunteers/event/${eventId}`);
      setEvent(eventResponse.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to submit volunteer request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!event) {
    return (
      <section className="content-card p-4">
        <ErrorMessage message={error || 'Event not found.'} />
        <Link to="/" className="btn btn-outline-secondary">Back to Home</Link>
      </section>
    );
  }

  const eventDate = new Date(event.date).toLocaleDateString();
  const isFull = remainingSlots <= 0;

  return (
    <section className="row g-4">
      <div className="col-lg-5">
        <div className="content-card p-4 h-100">
          <p className="section-kicker mb-2">Volunteer Registration</p>
          <h1 className="section-title h3 mb-3">{event.title}</h1>
          <div className="d-grid gap-2">
            <p className="mb-0"><strong>Date:</strong> {eventDate}</p>
            <p className="mb-0"><strong>Location:</strong> {event.location || 'To be announced'}</p>
            <p className="mb-0"><strong>Total Needed:</strong> {event.totalVolunteersRequired}</p>
            <p className="mb-0"><strong>Registered:</strong> {event.currentApprovedVolunteers}</p>
            <p className="mb-0"><strong>Available Slots:</strong> {remainingSlots}</p>
            {isFull && <span className="badge text-bg-danger align-self-start mt-1">Full</span>}
          </div>
          <p className="text-muted mt-3 mb-0">Your request will be reviewed by admin before approval.</p>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="content-card p-4 h-100">
          <h2 className="h5 mb-3">Apply as a Volunteer</h2>
          <ErrorMessage message={error} />
          {success && <div className="success mb-3">{success}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <input
              className="form-control"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isFull || submitting}
            />
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isFull || submitting}
            />
            <input
              className="form-control"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              disabled={isFull || submitting}
            />
            <input
              className="form-control"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={isFull || submitting}
            />
            <textarea
              className="form-control"
              name="message"
              placeholder="Message (optional)"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              disabled={isFull || submitting}
            />
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-primary" type="submit" disabled={isFull || submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <Link to="/" className="btn btn-outline-secondary">Back</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default VolunteerRegistration;
