import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'az', label: 'AZ' },
    { code: 'tr', label: 'TR' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`lang-btn ${isOpen ? 'active' : ''}`}
      >
        <span className="lang-label">{currentLanguage.label}</span>
        <HiChevronDown className={`lang-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`lang-option ${i18n.language === lang.code ? 'selected' : ''}`}
            >
              <span className="option-label">{lang.label}</span>
              {i18n.language === lang.code && <div className="selected-dot" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
