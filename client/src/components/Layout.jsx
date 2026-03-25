import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import SocialBar from './SocialBar.jsx';
import BackToTop from './BackToTop.jsx';

const Layout = ({ admin, children }) => {
  const location = useLocation();
  const showSocialBar = !admin && location.pathname === '/';

  useEffect(() => {
    if (admin) {
      return undefined;
    }

    const targets = Array.from(
      document.querySelectorAll(
        '.site-main .content-card, .site-main .impact-tile, .site-main .focus-card, .site-main .story-card, .site-main .event-day, .site-main .donation-category-card, .site-main .donate-impact-item, .site-main .presence-highlight'
      )
    );

    if (targets.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((element, index) => {
      element.classList.add('reveal-on-scroll');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 80}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [admin, location.pathname]);

  return (
    <div className={`main-shell ${admin ? 'admin-layout' : ''}`}>
      <Header admin={admin} />
      <main className="site-main container pt-2 pt-lg-3 pb-4 pb-lg-5">
        {children || <Outlet />}
      </main>
      {!admin && <Footer />}
      {showSocialBar && <SocialBar />}
      {!admin && <BackToTop />}
    </div>
  );
};

export default Layout;
