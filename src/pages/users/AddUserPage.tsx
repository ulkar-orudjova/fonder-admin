import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout';
import $api from '../../api/api';
import toast from 'react-hot-toast';
import { HiOutlineUserAdd, HiOutlineArrowLeft } from 'react-icons/hi';

export const AddUserPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      toast.error(t('common.fillAllFields'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('users.passwordsMismatch'));
      return;
    }

    setLoading(true);
    try {
      await $api.auth.register({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
      });
      toast.success(t('users.userAdded'));
      navigate('/users');
    } catch (error: any) {
      toast.error(error.response?.data || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title={t('users.addNewTitle')} />
      <div className="page-scroll-container">
        <div className="add-user-layout">
          
          <div className="add-user-card">
            <div className="add-user-header">
              <button onClick={() => navigate('/users')} className="back-btn">
                <HiOutlineArrowLeft />
              </button>
              <div className="add-user-icon">
                <HiOutlineUserAdd />
              </div>
              <div>
                <h2>{t('users.addNewTitle')}</h2>
                <p>{t('users.addNewDesc')}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="add-user-form">
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name">{t('users.name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={t('users.name')}
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="surname">{t('users.surname')}</label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    placeholder={t('users.surname')}
                    value={formData.surname}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-field full">
                  <label htmlFor="email">{t('auth.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="password">{t('auth.password')}</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="confirmPassword">{t('users.confirmPassword')}</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-footer">
                <button 
                  type="button" 
                  onClick={() => navigate('/users')}
                  className="cancel-btn"
                  disabled={loading}
                >
                  {t('common.cancel')}
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="btn-spinner"></span>
                  ) : (
                    <>
                      <HiOutlineUserAdd />
                      {t('common.addUser')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
