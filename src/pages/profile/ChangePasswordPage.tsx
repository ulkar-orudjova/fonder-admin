import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/layout';
import $api from '../../api/api';
import toast from 'react-hot-toast';
import { HiOutlineShieldCheck, HiOutlineKey, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export const ChangePasswordPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.oldPassword || !formData.newPassword) {
      toast.error(t('common.fillAllFields'));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t('password.mismatch'));
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error(t('password.lengthError'));
      return;
    }

    setLoading(true);
    try {
      await $api.users.changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      toast.success(t('password.success'));
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.response?.data || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={t('password.title')} />
      <div className="page-scroll-container">
        <div className="password-layout">
          
          <div className="password-card">
            <div className="password-header">
              <div className="password-icon">
                <HiOutlineShieldCheck />
              </div>
              <div>
                <h2>{t('password.headerTitle')}</h2>
                <p>{t('password.description')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="password-form">
              <div className="password-field">
                <label>
                  <HiOutlineKey className="field-icon" />
                  {t('password.currentPassword')}
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showOld ? 'text' : 'password'}
                    name="oldPassword"
                    placeholder={t('password.currentPlaceholder')}
                    value={formData.oldPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="toggle-visibility"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <div className="password-divider">
                <span>{t('password.newPassword')}</span>
              </div>

              <div className="password-field">
                <label>
                  <HiOutlineLockClosed className="field-icon" />
                  {t('password.newPassword')}
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showNew ? 'text' : 'password'}
                    name="newPassword"
                    placeholder={t('password.newPlaceholder')}
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="toggle-visibility"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <div className="password-field">
                <label>
                  <HiOutlineLockClosed className="field-icon" />
                  {t('password.confirmPassword')}
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder={t('password.confirmPlaceholder')}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button 
                    type="button" 
                    className="toggle-visibility"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
              </div>

              <div className="password-tips">
                <h4>{t('password.tipsTitle')}</h4>
                <ul>
                  <li>{t('password.tip1')}</li>
                  <li>{t('password.tip2')}</li>
                  <li>{t('password.tip3')}</li>
                </ul>
              </div>

              <button 
                type="submit" 
                className="password-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner"></span>
                ) : (
                  <>
                    <HiOutlineShieldCheck />
                    {t('password.updateButton')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
