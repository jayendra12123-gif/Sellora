import { useEffect, useState } from 'react';
import { adminDelete, adminGet, adminPut } from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminGet('/admin/users');
      setUsers(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = async (userId, updates) => {
    try {
      await adminPut(`/admin/users/${userId}`, updates);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminDelete(`/admin/users/${userId}`);
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 12 }}>Users</div>
        {error && <div style={{ color: '#c0392b', marginBottom: 12 }}>{error}</div>}
        {loading ? (
          <div style={{ color: '#6b6b6b' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        className="select"
                        value={user.role}
                        onChange={(e) => updateUser(user._id, { role: e.target.value })}
                      >
                        <option value="customer">customer</option>
                      </select>
                    </td>
                    <td>
                      <select
                        className="select"
                        value={user.status}
                        onChange={(e) => updateUser(user._id, { status: e.target.value })}
                      >
                        <option value="active">active</option>
                        <option value="disabled">disabled</option>
                      </select>
                    </td>
                    <td>
                      <button className="button danger" onClick={() => deleteUser(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan="5" style={{ padding: 20, textAlign: 'center', color: '#6b6b6b' }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
