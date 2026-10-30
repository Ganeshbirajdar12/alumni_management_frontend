import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  searchAlumni,
  fetchFilterOptions,
  updateFilters,
  resetFilters,
} from '../../store/slices/directorySlice';
import AlumniCard from './AlumniCard';
import SearchFilters from './SearchFilters';
import BackButton from '../../components/common/BackButton';
import toast from 'react-hot-toast';

const DirectoryPage = () => {
  const dispatch = useDispatch();
  const { alumni, filterOptions, pagination, isLoading, error, filters } =
    useSelector((state) => state.directory);

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchTerm || '');

  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(searchAlumni(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(updateFilters({ searchTerm: searchInput, page: 0 }));
  };

  const handleFilterChange = (name, value) => {
    dispatch(updateFilters({ [name]: value, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(updateFilters({ page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setSearchInput('');
    dispatch(resetFilters());
  };

  return (
    <div style={styles.container}>
      <BackButton to="/dashboard" />

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🔍 Alumni Directory</h1>
          <p style={styles.subtitle}>
            Discover and connect with {pagination.totalElements} alumni
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} style={styles.searchBar}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, company, position..."
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchBtn}>Search</button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          style={styles.filterToggle}
        >
          {showFilters ? 'Hide Filters' : '⚙️ Filters'}
        </button>
      </form>

      {showFilters && (
        <SearchFilters
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      )}

      {isLoading ? (
        <div style={styles.loading}>Loading alumni...</div>
      ) : alumni.length > 0 ? (
        <>
          <div style={styles.resultsInfo}>
            Showing {alumni.length} of {pagination.totalElements} alumni
          </div>

          <div style={styles.grid}>
            {alumni.map((a) => (
              <AlumniCard key={a.id} alumni={a} />
            ))}
          </div>

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
      ) : (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>👥</div>
          <h3 style={styles.emptyTitle}>No alumni found</h3>
          <p style={styles.emptyText}>Try adjusting your search or filters</p>
          <button onClick={handleReset} style={styles.resetBtn}>Reset Filters</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '40px auto', padding: '0 24px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  searchBar: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: '250px', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '15px', outline: 'none', fontFamily: 'inherit' },
  searchBtn: { padding: '12px 28px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' },
  filterToggle: { padding: '12px 20px', background: 'white', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' },
  resultsInfo: { marginBottom: '16px', color: '#64748b', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  loading: { textAlign: 'center', padding: '80px', color: '#64748b' },
  empty: { textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' },
  emptyIcon: { fontSize: '48px', marginBottom: '16px' },
  emptyTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' },
  emptyText: { fontSize: '14px', color: '#64748b', marginBottom: '20px' },
  resetBtn: { padding: '10px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '32px' },
  pageBtn: { padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' },
  pageBtnDisabled: { background: '#cbd5e1', cursor: 'not-allowed' },
  pageInfo: { fontSize: '14px', color: '#64748b', fontWeight: '500' },
};

export default DirectoryPage;