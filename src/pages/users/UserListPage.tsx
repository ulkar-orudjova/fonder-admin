import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/layout';
import type { User } from '../../types';
import $api from '../../api/api';
import toast from 'react-hot-toast';
import { HiOutlineUserAdd, HiOutlineSearch, HiOutlineRefresh } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const imageUrl = import.meta.env.VITE_IMAGE_URL;
  const { t } = useTranslation();
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await $api.users.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await $api.users.changeRole({ user_id: userId, role: newRole });
      toast.success(t('users.roleChanged'));
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data || t('common.error'));
    }
  };

  return (
    <>
      <Header title={t('users.title')} />
      <div className="page-scroll-container">
        
        {/* Modern Header Section */}
        <div className="content-header">
          <div className="content-header-left">
            <h1>{t('users.allUsers')}</h1>
            <p className="content-header-subtitle">{t('users.usersFound', { count: users.length })}</p>
          </div>
          <div className="content-header-actions">
            <div className="search-box">
              <HiOutlineSearch className="search-icon" />
              <input 
                type="text" 
                placeholder={t('users.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={fetchUsers} className="icon-btn" title={t('common.refresh')}>
              <HiOutlineRefresh className={loading ? 'animate-spin' : ''} />
            </button>
            <Link to="/users/add" className="btn btn-primary">
              <HiOutlineUserAdd className="w-5 h-5" />
              {t('users.newUser')}
            </Link>
          </div>
        </div>

        {/* Users Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <HiOutlineSearch className="w-16 h-16" />
            <h3>{t('users.notFound')}</h3>
            <p>{t('users.notFoundDesc')}</p>
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar-wrapper">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage}
                        alt={user.name}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {user.name?.charAt(0)}{user.surname?.charAt(0)}
                      </div>
                    )}
                    <span className={`status-dot ${user.isActive ? 'active' : 'inactive'}`}></span>
                  </div>
                  <div className="user-info">
                    <h3>{user.name} {user.surname}</h3>
                    <p>{user.email}</p>
                  </div>
                </div>
                
                <div className="user-card-body">
                  <div className="user-meta">
                    <div className="meta-item">
                      <span className="meta-label">{t('users.role')}</span>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value as 'user' | 'admin')}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">{t('users.status')}</span>
                      <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? t('users.active') : t('users.inactive')}
                      </span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">{t('users.registration')}</span>
                      <span className="meta-value">
                        {user.registerDate ? new Date(user.registerDate).toLocaleDateString('az-AZ') : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
