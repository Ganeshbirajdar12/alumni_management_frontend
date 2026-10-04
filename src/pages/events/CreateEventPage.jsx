import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent, clearError } from '../../store/slices/eventSlice';
import toast from 'react-hot-toast';

const CATEGORIES = ['REUNION', 'WEBINAR', 'WORKSHOP', 'NETWORKING', 'CONFERENCE', 'SOCIAL', 'OTHER'];

const CreateEventPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSubmitting, error } = useSelector((state) => state.event);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'REUNION',
    eventDate: '',
    endDate: '',
    isOnline: false,
    location: '',
    meetingLink: '',
    coverImage: '',
    maxParticipants: '',
    registrationDeadline: '',
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.title || !form.category || !form.eventDate) {
      toast.error('Title, category, and event date are required');
      return;
    }

    if (form.isOnline && !form.meetingLink) {
      toast.error('Meeting link is required for online events');
      return;
    }

    if (!form.isOnline && !form.location) {
      toast.error('Location is required for in-person events');
      return;
    }

    // Build payload
    const payload = {
      title: form.title.trim(),
      description: form.description,
      category: form.category,
      eventDate: form.eventDate,
      endDate: form.endDate || null,
      isOnline: form.isOnline,
      location: form.isOnline ? null : form.location,
      meetingLink: form.isOnline ? form.meetingLink : null,
      coverImage: form.coverImage || null,
      maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : null,
      registrationDeadline: form.registrationDeadline || null,
    };

    const result = await dispatch(createEvent(payload));
    if (!result.error) {
      toast.success('Event created! 🎉');
      navigate(`/events/${result.payload.id}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <BackButton to="/events" label="Back to Events" />
        <h1 style={styles.title}>Create Event</h1>
        <p style={styles.subtitle}>Share an event with the alumni community</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.card}>
        {/* Basic Info */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Basic Information</h3>

          <div style={styles.field}>
            <label style={styles.label}>Event Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Batch of 2020 Reunion"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.select}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell attendees what this event is about..."
              rows={5}
              style={styles.textarea}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              style={styles.input}
            />
          </div>
        </div>

        {/* Date & Time */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Date & Time</h3>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Start Date & Time *</label>
              <input
                type="datetime-local"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>End Date & Time</label>
              <input
                type="datetime-local"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Location</h3>

          <div style={styles.toggleRow}>
            <label style={styles.toggleLabel}>
              <input
                type="checkbox"
                name="isOnline"
                checked={form.isOnline}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>This is an online event</span>
            </label>
          </div>

          {form.isOnline ? (
            <div style={styles.field}>
              <label style={styles.label}>Meeting Link *</label>
              <input
                type="url"
                name="meetingLink"
                value={form.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
                style={styles.input}
              />
            </div>
          ) : (
            <div style={styles.field}>
              <label style={styles.label}>Location *</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Mumbai, India"
                style={styles.input}
              />
            </div>
          )}
        </div>

        {/* Capacity */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Registration (Optional)</h3>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Max Participants</label>
              <input
                type="number"
                name="maxParticipants"
                value={form.maxParticipants}
                onChange={handleChange}
                placeholder="Leave empty for unlimited"
                min="1"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Registration Deadline</label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                value={form.registrationDeadline}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/events')}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={styles.submitBtn}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : '🎉 Publish Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: '780px', margin: '40px auto', padding: '0 24px' },
  header: { marginBottom: '28px' },
  backBtn: {
    background: 'none', border: 'none', color: '#64748b',
    fontSize: '14px', cursor: 'pointer', padding: 0,
    marginBottom: '12px', fontFamily: 'inherit',
  },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  card: {
    background: 'white', borderRadius: '16px', padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
  },
  section: { marginBottom: '28px' },
  sectionTitle: {
    fontSize: '14px', fontWeight: '700', color: '#4f46e5',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', flex: 1 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#334155' },
  input: {
    padding: '11px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none',
  },
  textarea: {
    padding: '11px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none', resize: 'vertical',
  },
  select: {
    padding: '11px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px',
    fontFamily: 'inherit', outline: 'none',
    background: 'white', cursor: 'pointer',
  },
  toggleRow: { marginBottom: '16px' },
  toggleLabel: {
    display: 'flex', alignItems: 'center', gap: '10px',
    fontSize: '14px', color: '#334155', fontWeight: '500', cursor: 'pointer',
  },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  actions: {
    display: 'flex', gap: '12px', justifyContent: 'flex-end',
    marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f5f9',
  },
  cancelBtn: {
    padding: '12px 24px', background: '#f1f5f9', color: '#475569',
    border: 'none', borderRadius: '10px', fontWeight: '600',
    fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
  },
  submitBtn: {
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white', border: 'none', borderRadius: '10px',
    fontWeight: '700', fontSize: '14px', cursor: 'pointer',
    fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
  },
};

export default CreateEventPage;