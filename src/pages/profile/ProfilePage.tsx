import { useTranslation } from 'react-i18next';
import { Header } from '../../components/layout';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineCog, HiOutlineKey } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  const getStatusText = () => {
    return user?.isActive ? t('profile.status.active') : t('profile.status.inactive');
  };

  const getRoleText = () => {
    if (user?.role === 'admin') return t('profile.roles.admin');
    return t('profile.roles.user');
  };

  return (
    <>
      <Header title={t('profile.title')} />
      <div className="page-scroll-container">
        <div className="profile-layout">
          
          {/* Profile Hero */}
          <div className="profile-hero">
            <div className="profile-hero-bg"></div>
            <div className="profile-hero-content">
              <div className="profile-avatar-section">
                {user?.profileImage ? (
                  <img 
                    src={`${imageUrl}/${user.profileImage}`}
                    alt={user.name}
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
                  </div>
                )}
                <span className={`profile-status ${user?.isActive ? 'active' : 'inactive'}`}>
                  {getStatusText()}
                </span>
              </div>
              
              <div className="profile-info">
                <h1>{user?.name} {user?.surname}</h1>
                <p className="profile-email">{user?.email}</p>
                <div className="profile-badges">
                  <span className="profile-role">{getRoleText()}</span>
                </div>
              </div>

              <div className="profile-actions">
                <Link to="/settings" className="profile-action-btn">
                  <HiOutlineCog />
                  {t('common.settings')}
                </Link>
                <Link to="/change-password" className="profile-action-btn secondary">
                  <HiOutlineKey />
                  {t('common.changePassword')}
                </Link>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <div className="profile-section">
              <h2>{t('profile.contactInfo')}</h2>
              <div className="details-grid">
                <div className="detail-card">
                  <div className="detail-icon email">
                    <HiOutlineMail />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">{t('profile.email')}</span>
                    <span className="detail-value">{user?.email}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon phone">
                    <HiOutlinePhone />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">{t('profile.phone')}</span>
                    <span className="detail-value">{user?.phone || t('profile.notSpecified')}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon location">
                    <HiOutlineLocationMarker />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">{t('profile.address')}</span>
                    <span className="detail-value">{user?.address || t('profile.notSpecified')}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon calendar">
                    <HiOutlineCalendar />
                  </div>
                  <div className="detail-content">
                    <span className="detail-label">{t('profile.registrationDate')}</span>
                    <span className="detail-value">
                      {user?.registerDate 
                        ? new Date(user.registerDate).toLocaleDateString(i18n.language === 'az' ? 'az-AZ' : i18n.language === 'tr' ? 'tr-TR' : 'en-US', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          }) 
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
