import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi';

const Logo = () => (
  <svg width="120" height="28" viewBox="0 0 305 72" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M290.846 38.5019L289.892 38.219L290.867 38.0252C299.718 36.2337 305 29.5601 305 20.1835C305 8.46537 297.612 0.895996 286.182 0.895996H256.75V70.2828H274.436L274.265 45.7465H277.71C283.459 45.7465 286.25 48.7166 286.25 54.8193V70.2828H303.739V57.8889C303.739 47.7004 299.282 40.9953 290.846 38.5019ZM280.496 30.3039H274.447V14.3428H281.295C285.077 14.3428 287.516 17.2657 287.516 21.7969C287.516 27.2028 284.958 30.3039 280.496 30.3039Z" fill=""/>
    <path d="M102.387 0.890503V70.2773H117.52V32.5928L131.611 70.2773H149.215V0.890503H134.086V38.7898L119.995 0.890503H102.387Z" fill=""/>
    <path d="M228.655 42.8233H243.97V27.454H228.655V16.1707H250.243V0.890503H210.969V70.2773H251.483V55.0024H228.655V42.8233Z" fill=""/>
    <path d="M17.6863 43.7138H35.6632V28.3498H17.6863V16.1707H43.1756V0.890503H0V70.2773H17.6863V43.7138Z" fill=""/>
    <path d="M205.698 34.9605C205.698 13.3106 196.131 0.890503 179.462 0.890503H156.93V70.2773H179.462C196.136 70.2773 205.698 57.4015 205.698 34.9605ZM175.897 56.5896H174.497V14.5835H175.897C183.311 14.5835 187.073 21.6028 187.073 35.4582C187.073 54.5361 179.259 56.5896 175.897 56.5896Z" fill=""/>
    <path d="M97.1936 35.4058C97.1936 12.9072 87.7305 0 71.2374 0C54.7443 0 45.0996 13.0696 45.0996 34.9606C45.0996 57.9725 54.6302 71.1678 71.2374 71.1678C87.8446 71.1678 97.1936 58.1297 97.1936 35.4006V35.4058ZM69.5098 13.9863C74.5267 13.5725 77.5358 20.2199 78.7654 34.3843C80.0365 49.0516 78.1843 56.7101 73.2504 57.1501C73.1051 57.1606 72.9651 57.1658 72.825 57.1658C66.0597 57.1658 64.0519 42.5247 63.4967 36.1287C62.2619 21.8962 64.2853 14.4421 69.5098 13.9811V13.9863Z" fill=""/>
  </svg>
);

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isAuthenticated) {
    navigate(isAdmin ? '/' : '/profile');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t('auth.enterEmailPassword'));
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success(t('auth.loginSuccess'));
    } catch (error: any) {
      const message = error.response?.data || t('auth.loginError');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side - Branding */}
      <div className="auth-brand">
        <div className="auth-brand-content">
          <Logo />
          <h1>{t('auth.brandTitle')}</h1>
          <p>{t('auth.brandDescription')}</p>
        </div>
        <div className="auth-brand-footer">
          <span>{t('auth.footerRights')}</span>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h2>{t('auth.loginTitle')}</h2>
            <p>{t('auth.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="email">{t('auth.email')}</label>
              <div className="auth-input-wrapper">
                <HiOutlineMail className="auth-input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="auth-label-row">
                <label htmlFor="password">{t('auth.password')}</label>
                <Link to="/forgot-password" className="auth-forgot-link">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="auth-input-wrapper">
                <HiOutlineLockClosed className="auth-input-icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                <>
                  {t('auth.loginButton')}
                  <HiOutlineArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
