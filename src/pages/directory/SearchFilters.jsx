import React from 'react';

const SearchFilters = ({ filters, filterOptions, onFilterChange, onReset }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>⚙️ Filters</h3>
        <button onClick={onReset} style={styles.resetBtn}>Reset All</button>
      </div>

      <div style={styles.grid}>
        <Field label="Department">
          <select value={filters.department || ''} onChange={(e) => onFilterChange('department', e.target.value)} style={styles.select}>
            <option value="">All</option>
            {filterOptions.departments?.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

        <Field label="Graduation Year">
          <select value={filters.graduationYear || ''} onChange={(e) => onFilterChange('graduationYear', e.target.value)} style={styles.select}>
            <option value="">All</option>
            {filterOptions.graduationYears?.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>

        <Field label="Industry">
          <select value={filters.industry || ''} onChange={(e) => onFilterChange('industry', e.target.value)} style={styles.select}>
            <option value="">All</option>
            {filterOptions.industries?.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>

        <Field label="Degree">
          <select value={filters.degree || ''} onChange={(e) => onFilterChange('degree', e.target.value)} style={styles.select}>
            <option value="">All</option>
            {filterOptions.degrees?.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>

        <Field label="Company">
          <input type="text" value={filters.company || ''} onChange={(e) => onFilterChange('company', e.target.value)} placeholder="e.g. Google" style={styles.input} />
        </Field>

        <Field label="Location">
          <input type="text" value={filters.location || ''} onChange={(e) => onFilterChange('location', e.target.value)} placeholder="e.g. Mumbai" style={styles.input} />
        </Field>

        <Field label="Sort By">
          <select value={filters.sortBy || 'firstName'} onChange={(e) => onFilterChange('sortBy', e.target.value)} style={styles.select}>
            <option value="firstName">Name</option>
            <option value="graduationYear">Graduation Year</option>
            <option value="currentCompany">Company</option>
            <option value="location">Location</option>
            <option value="createdAt">Recently Added</option>
          </select>
        </Field>

        <Field label="Order">
          <select value={filters.sortDirection || 'asc'} onChange={(e) => onFilterChange('sortDirection', e.target.value)} style={styles.select}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </Field>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

const styles = {
  container: { background: 'white', padding: '24px', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', marginBottom: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' },
  resetBtn: { padding: '6px 16px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: '8px', color: '#64748b', cursor: 'pointer', fontSize: '13px', fontWeight: '600', fontFamily: 'inherit' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#475569' },
  input: { padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' },
  select: { padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white', cursor: 'pointer', fontFamily: 'inherit' },
};

export default SearchFilters;