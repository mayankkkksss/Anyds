import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../common/Footer';
import { BackToTop } from '../common/BackToTop';
import { CookieBanner } from '../common/CookieBanner';
import { ToastContainer } from '../common/ToastContainer';
import { SearchModal } from '../search/SearchModal';
import { mockReferences } from '../../data';
import { Reference } from '../../types/models';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSelectReference = (ref: Reference) => {
    setIsSearchOpen(false);
    navigate(`/reference/${ref.id}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global search modal — opened by the navbar button or ⌘K / Ctrl+K */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        references={mockReferences}
        onSelectReference={handleSelectReference}
      />

      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        activePath={location.pathname}
      />

      <main id="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      <Footer />
      <BackToTop />
      <CookieBanner />
      <ToastContainer />
    </div>
  );
}
