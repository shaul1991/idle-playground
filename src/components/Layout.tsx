import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showHomeButton?: boolean;
  showAdBanner?: boolean;
  headerActions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'idle-playground',
  showHomeButton = true,
  showAdBanner = true,
  headerActions
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 홈 페이지인지 확인
  const isHomePage = location.pathname === '/';

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="layout">
      {/* 헤더 영역 */}
      <header className="layout-header">
        <div className="header-content">
          {showHomeButton && !isHomePage && (
            <button 
              className="home-button"
              onClick={handleHomeClick}
              aria-label="홈으로 가기"
            >
              🏠
            </button>
          )}
          <h1 className="page-title">{title}</h1>
          <div className="header-actions">
            {headerActions}
          </div>
        </div>
      </header>

      {/* 본문 영역 */}
      <main className="layout-main">
        {children}
      </main>

      {/* 광고 배너 영역 */}
      {showAdBanner && (
        <section className="layout-ad-banner">
          <div className="ad-banner-content">
            <p>🎯 광고 배너 영역</p>
            <small>슬라이더 배너나 링크 배너가 들어갈 예정입니다</small>
          </div>
        </section>
      )}

      {/* 푸터 영역 */}
      <footer className="layout-footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>idle-playground</h3>
            <p>아이들을 위한 인터랙티브 놀이터</p>
          </div>
          <div className="footer-links">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              📷 Instagram
            </a>
            <a 
              href="mailto:contact@idle-playground.com" 
              className="footer-link"
            >
              📧 Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 