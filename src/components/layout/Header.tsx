import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../LanguageSwitcher';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-user">
        <LanguageSwitcher />
        <div className="header-user-info">
          <span className="name">{user?.name} {user?.surname}</span>
          <span className="role">{user?.role}</span>
        </div>
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center">
            <span className="text-primary-600 font-medium text-xs">
              {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
