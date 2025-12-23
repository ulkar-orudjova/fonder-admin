import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/layout';
import { useAuth } from '../../context/AuthContext';
import $api from '../../api/api';
import toast from 'react-hot-toast';
import { HiOutlineCamera, HiOutlineCheck } from 'react-icons/hi';

export const SettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    age: user?.age || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await $api.users.updateProfile(formData);
      await refreshUser();
      toast.success(t('settings.profileUpdated'));
    } catch (error: any) {
      toast.error(error.response?.data || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    setLoading(true);
    try {
      await $api.users.changeProfileImage(formData);
      await refreshUser();
      toast.success(t('settings.avatarUpdated'));
    } catch (error: any) {
      toast.error(error.response?.data || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={t('settings.title')} />
      <div className="page-scroll-container">
        <div className="settings-layout">
          
          {/* Settings Sidebar */}
          <div className="settings-sidebar">
            <div className="settings-avatar-section" onClick={() => fileInputRef.current?.click()}>
              <div className="settings-avatar-wrapper">
                {user?.profileImage ? (
                  <img 
                    src={`${imageUrl}/${user.profileImage}`}
                    alt={user.name}
                    className="settings-avatar"
                  />
                ) : (
                  <div className="settings-avatar-placeholder">
                    {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
                  </div>
                )}
                <div className="settings-avatar-overlay">
                  <HiOutlineCamera />
                </div>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <p className="settings-avatar-hint">{t('settings.changeAvatar')}</p>
            </div>
            
            <div className="settings-user-info">
              <h3>{user?.name} {user?.surname}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          {/* Settings Form */}
          <div className="settings-content">
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>{t('settings.personalInfo')}</h2>
                <p>{t('settings.updateDesc')}</p>
              </div>
              
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>{t('auth.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={true}
                      className="disabled"
                    />
                    <span className="field-hint">{t('settings.emailHint')}</span>
                  </div>

                  <div className="form-field">
                    <label>{t('profile.phone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder={t('settings.phonePlaceholder')}
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field full">
                    <label>{t('profile.address')}</label>
                    <input
                      type="text"
                      name="address"
                      placeholder={t('settings.addressPlaceholder')}
                      value={formData.address}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label>{t('settings.age')}</label>
                    <input
                      type="number"
                      name="age"
                      placeholder="25"
                      value={formData.age}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="btn-spinner"></span>
                    ) : (
                      <>
                        <HiOutlineCheck />
                        {t('common.save')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
