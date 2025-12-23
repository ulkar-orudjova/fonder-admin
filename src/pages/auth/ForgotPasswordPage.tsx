import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $api from '../../api/api';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineKey, HiOutlineLockClosed, HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheckCircle } from 'react-icons/hi';

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

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email daxil edin');
      return;
    }

    setLoading(true);
    try {
      await $api.users.sendResetPasswordOTP(email);
      toast.success('OTP kod emailinizə göndərildi');
      setStep(2);
    } catch (error: any) {
      toast.error(error.response?.data || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || !newPassword) {
      toast.error('Bütün sahələri doldurun');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Şifrələr uyğun gəlmir');
      return;
    }

    setLoading(true);
    try {
      await $api.users.changePassword({ email, otp, newPassword });
      toast.success('Şifrə uğurla dəyişdirildi');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data || 'Xəta baş verdi');
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
          <h1>Şifrəni Bərpa Et</h1>
          <p>Narahat olmayın, biz sizə kömək edəcəyik. Sadəcə email adresinizi daxil edin.</p>
        </div>
        <div className="auth-brand-footer">
          <span>© 2024 Fonder. Bütün hüquqlar qorunur.</span>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          
          {/* Progress Steps */}
          <div className="auth-steps">
            <div className={`auth-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="auth-step-icon">
                {step > 1 ? <HiOutlineCheckCircle /> : '1'}
              </div>
              <span>Email</span>
            </div>
            <div className="auth-step-line"></div>
            <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
              <div className="auth-step-icon">2</div>
              <span>Yeni Şifrə</span>
            </div>
          </div>

          <div className="auth-form-header">
            <h2>{step === 1 ? 'Emailinizi daxil edin' : 'Yeni şifrə təyin edin'}</h2>
            <p>{step === 1 
              ? 'Sizə OTP kod göndərəcəyik' 
              : 'OTP kodu və yeni şifrənizi daxil edin'}</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="email">Email</label>
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

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-spinner"></span>
                ) : (
                  <>
                    OTP Göndər
                    <HiOutlineArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="otp">OTP Kod</label>
                <div className="auth-input-wrapper">
                  <HiOutlineKey className="auth-input-icon" />
                  <input
                    type="text"
                    id="otp"
                    placeholder="6 rəqəmli kod"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="newPassword">Yeni Şifrə</label>
                <div className="auth-input-wrapper">
                  <HiOutlineLockClosed className="auth-input-icon" />
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="confirmPassword">Şifrə Təkrarı</label>
                <div className="auth-input-wrapper">
                  <HiOutlineLockClosed className="auth-input-icon" />
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Şifrəni Yenilə
                    <HiOutlineCheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="auth-back-link">
            <Link to="/login">
              <HiOutlineArrowLeft className="w-4 h-4" />
              Girişə qayıt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
