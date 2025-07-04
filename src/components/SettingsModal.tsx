import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/SettingsModal.scss';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ 설정</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="settings-section">
          <h3>🎨 테마 설정</h3>
          <div className="theme-options">
            <div 
              className={`theme-option ${theme === 'light' ? 'selected' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <div className="theme-icon">☀️</div>
              <div className="theme-info">
                <div className="theme-name">라이트 모드</div>
                <div className="theme-description">밝은 화면</div>
              </div>
              <div className="theme-radio">
                {theme === 'light' && <div className="radio-dot"></div>}
              </div>
            </div>

            <div 
              className={`theme-option ${theme === 'dark' ? 'selected' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="theme-icon">🌙</div>
              <div className="theme-info">
                <div className="theme-name">다크 모드</div>
                <div className="theme-description">어두운 화면</div>
              </div>
              <div className="theme-radio">
                {theme === 'dark' && <div className="radio-dot"></div>}
              </div>
            </div>

            <div 
              className={`theme-option ${theme === 'system' ? 'selected' : ''}`}
              onClick={() => handleThemeChange('system')}
            >
              <div className="theme-icon">🔄</div>
              <div className="theme-info">
                <div className="theme-name">시스템 설정</div>
                <div className="theme-description">기기 설정을 따름</div>
              </div>
              <div className="theme-radio">
                {theme === 'system' && <div className="radio-dot"></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="done-button" onClick={onClose}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 