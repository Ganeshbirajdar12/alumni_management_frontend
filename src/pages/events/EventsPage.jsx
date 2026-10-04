import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchEvents,
  fetchFeaturedEvents,
  updateFilters,
  resetFilters,
} from '../../store/slices/eventSlice';
import EventCard from './EventCard';
import toast from 'react-hot-toast';

const CATEGORIES = ['REUNION', 'WEBINAR', 'WORKSHOP', 'NETWORKING', 'CONFERENCE', 'SOCIAL', 'OTHER'];

const EventsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, featuredEvents, pagination, isLoading, error, filters } =
    useSelector((state) => state.event);

  const { user } = useSelector((state) => state.auth);
  const canCreate =
    user?.user?.role === 'ROLE_ALUMNI' ||
    user?.user?.role === 'ROLE_ADMIN' ||
    user?.user?.role === 'ROLE_SUPER_ADMIN';

  const [search, setSearch] = useState(filters.search || '');

  useEffect(() => {
    dispatch(fetchFeaturedEvents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEvents(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(updateFilters({ search, page: 0 }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(updateFilters({ [key]: value, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(updateFilters({ page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSearch('');
    dispatch(resetFilters());
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📅 Events</h1>
          <p style={styles.subtitle}>
            Discover reunions, workshops, webinars and more
          </p>
        </div>
        {canCreate && (
          <button style={styles.createBtn} onClick={() => navigate('/events/create')}>
            + Create Event
          </button>
        )}
      </div>

      {/* Featured */}
      {featuredEvents.length > 0 && (
        <div style={styles.featuredSection}>
          <h2 style={styles.sectionTitle}>⭐ Featured Events</h2>
          <div style={styles.featuredGrid}>
            {featuredEvents.map((e) => (
              <EventCard key={e.id} event={e} featured />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filtersCard}>
        <form onSubmit={handleSearch} style={styles.searchBar}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or location..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>

        <div style={styles.filters}>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={styles.select}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{formatCategory(c)}</option>
            ))}
          </select>

          <select
            value={filters.onlineOnly === null || filters.onlineOnly === '' ? '' : filters.onlineOnly}
            onChange={(e) => {
              const v = e.target.value;
              handleFilterChange('onlineOnly', v === '' ? null : v === 'true');
            }}
            style={styles.select}
          >
            <option value="">All Modes</option>
            <option value="false">In-person</option>
            <option value="true">Online</option>
          </select>

          <select
            value={filters.upcomingOnly ? 'true' : 'false'}
            onChange={(e) => handleFilterChange('upcomingOnly', e.target.value === 'true')}
            style={styles.select}
          >
            <option value="true">Upcoming Only</option>
            <option value="false">All Events</option>
          </select>

          <button onClick={handleReset} style={styles.resetBtn}>
            Reset
          </button>
        </div>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div style={styles.loading}>Loading events...</div>
      ) : events.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>No events found</h3>
          <p>Try changing your filters or create a new event.</p>
        </div>
      ) : (
        <>
          <div style={styles.eventsGrid}>
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                style={{
                  ...styles.pageBtn,
                  ...(pagination.page === 0 ? styles.pageBtnDisabled : {}),
                }}
              >
                ← Previous
              </button>
              <span style={styles.pageInfo}>
                Page {pagination.page + 1} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages - 1}
                style={{
                  ...styles.pageBtn,
                  ...(pagination.page >= pagination.totalPages - 1 ? styles.pageBtnDisabled : {}),
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const formatCategory = (cat) =>
  cat ? cat.charAt(0) + cat.slice(1).toLowerCase() : '';

const styles = {
  container: { maxWidth: '1200px', margin: '40px auto', padding: '0 24px' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '28px', gap: '16px', flexWrap: 'wrap',
  },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  createBtn: {
    padding: '12px 22px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white', border: 'none', borderRadius: '10px',
    fontWeight: '700', fontSize: '14px', cursor: 'pointer',
    fontFamily: 'inherit', boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
  },
  featuredSection: { marginBottom: '32px' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  filtersCard: {
    background: 'white', padding: '20px', borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
    marginBottom: '28px',
  },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '16px' },
  searchInput: {
    flex: 1, padding: '11px 14px', border: '1.5px solid #e2e8f0',
    borderRadius: '10px', fontSize: '14px', outline: 'none', fontFamily: 'inherit',
  },
  searchBtn: {
    padding: '11px 24px', background: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '10px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
  },
  filters: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  select: {
    padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '14px', outline: 'none', background: 'white',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  resetBtn: {
    padding: '10px 20px', background: 'white', color: '#64748b',
    border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  loading: { textAlign: 'center', padding: '80px', color: '#64748b' },
  empty: {
    textAlign: 'center', padding: '80px 20px', background: 'white',
    borderRadius: '16px', border: '1px solid #f1f5f9',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  pagination: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    gap: '20px', marginTop: '32px',
  },
  pageBtn: {
    padding: '10px 20px', background: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '10px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  pageBtnDisabled: { background: '#cbd5e1', cursor: 'not-allowed' },
  pageInfo: { fontSize: '14px', color: '#64748b', fontWeight: '500' },
};

export default EventsPage;