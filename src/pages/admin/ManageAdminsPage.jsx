import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllAdmins,
  deactivateAdmin,
  activateAdmin,
  deleteAdmin,
  resetAdminPassword,
  clearError,
} from '../../store/slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import CreateAdminModal from '../../components/admin/CreateAdminModal';
import toast from 'react-hot-toast';

const ManageAdminsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admins, isLoading, error } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const isSuperAdmin = currentUser?.user?.role === 'ROLE_SUPER_ADMIN';

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate('/admin/dashboard');
      return;
    }
    dispatch(fetchAllAdmins());
  }, [dispatch, isSuperAdmin, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDeactivate = async (id) => {
    const result = await dispatch(deactivateAdmin(id));
    if (!result.error) toast.success('Admin deactivated');
    setOpenMenuId(null);
  };

  const handleActivate = async (id) => {
    const result = await dispatch(activateAdmin(id));
    if (!result.error) toast.success('Admin activated');
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    const result = await dispatch(deleteAdmin(id));
    if (!result.error) toast.success('Admin deleted');
    setOpenMenuId(null);
  };

  const handleResetPassword = async (id) => {
    const result = await dispatch(resetAdminPassword(id));
    if (!result.error) {
      toast.success(`New password: ${result.payload.newPassword}`, { duration: 10000 });
    }
    setOpenMenuId(null);
  };

  const closeMenu = () => setOpenMenuId(null);

  useEffect(() => {
    const handleClick = () => closeMenu();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Admins</h1>
          <p style={styles.subtitle}>
            Create, deactivate, or delete admin accounts
          </p>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => setShowCreateModal(true)}
        >
          + Add New Admin
        </button>
      </div>

      {isLoading ? (
        <div style={styles.loading}>Loading admins...</div>
      ) : (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const isSA = admin.role === 'ROLE_SUPER_ADMIN';
                const isSelf = admin.id === currentUser?.user?.id;
                return (
                  <tr key={admin.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.nameCell}>
                        <div style={styles.avatar}>
                          {admin.firstName?.[0]}
                          {admin.lastName?.[0]}
                        </div>
                        <span>{admin.fullName}</span>
                        {isSelf && <span style={styles.youBadge}>You</span>}
                      </div>
                    </td>
                    <td style={styles.td}>{admin.email}</td>
                    <td style={styles.td}>
                      <span style={isSA ? styles.saBadge : styles.adminBadge}>
                        {isSA ? '👑 SUPER_ADMIN' : 'ADMIN'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={admin.isActive ? styles.activeBadge : styles.inactiveBadge}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {!isSA && !isSelf && (
                        <div style={styles.menuWrapper}>
                          <button
                            style={styles.menuBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === admin.id ? null : admin.id);
                            }}
                          >
                            ⋯
                          </button>
                          {openMenuId === admin.id && (
                            <div style={styles.menu} onClick={(e) => e.stopPropagation()}>
                              <button
                                style={styles.menuItem}
                                onClick={() => handleResetPassword(admin.id)}
                              >
                                🔑 Reset Password
                              </button>
                              {admin.isActive ? (
                                <button
                                  style={styles.menuItem}
                                  onClick={() => handleDeactivate(admin.id)}
                                >
                                  🚫 Deactivate
                                </button>
                              ) : (
                                <button
                                  style={styles.menuItem}
                                  onClick={() => handleActivate(admin.id)}
                                >
                                  ✅ Activate
                                </button>
                              )}
                              <button
                                style={{ ...styles.menuItem, ...styles.deleteItem }}
                                onClick={() => handleDelete(admin.id)}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateAdminModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

// ==================== STYLES ====================

const styles = {
  container: { maxWidth: '1100px', margin: '40px auto', padding: '0 24px' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    gap: '16px',
    flexWrap: 'wrap',
  },
  title: { fontSize: '26px', fontWeight: '800', color: '#1e293b', margin: '0 0 4px 0' },
  subtitle: { fontSize: '14px', color: '#64748b', margin: 0 },
  addBtn: {
    padding: '12px 22px',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
  },
  loading: { textAlign: 'center', padding: '60px', color: '#64748b' },
  tableCard: {
    background: 'white',
    borderRadius: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #f1f5f9',
    // overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '14px 18px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
  },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '16px 18px', fontSize: '14px', color: '#1e293b' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
  },
  youBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    background: '#eef2ff',
    color: '#4f46e5',
    borderRadius: '4px',
    fontWeight: '700',
  },
  saBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    background: '#fef3c7',
    color: '#92400e',
    borderRadius: '6px',
    fontWeight: '700',
  },
  adminBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    background: '#dbeafe',
    color: '#1e40af',
    borderRadius: '6px',
    fontWeight: '700',
  },
  activeBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    background: '#dcfce7',
    color: '#166534',
    borderRadius: '6px',
    fontWeight: '700',
  },
  inactiveBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    background: '#fee2e2',
    color: '#991b1b',
    borderRadius: '6px',
    fontWeight: '700',
  },
  menuWrapper: { position: 'relative' },
  menuBtn: {
    width: '32px',
    height: '32px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#64748b',
  },
  menu: {
    position: 'absolute',
    top: '36px',
    right: 0,
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    border: '1px solid #f1f5f9',
    padding: '6px',
    minWidth: '180px',
    zIndex: 100,
  },
  menuItem: {
    width: '100%',
    padding: '9px 12px',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: '13px',
    color: '#475569',
    cursor: 'pointer',
    borderRadius: '6px',
    fontFamily: 'inherit',
  },
  deleteItem: { color: '#ef4444' },
};

export default ManageAdminsPage;