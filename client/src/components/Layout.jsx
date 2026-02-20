import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Layout = ({ admin, children }) => {
  return (
    <div className={`main-shell ${admin ? 'admin-layout' : ''}`}>
      <Header admin={admin} />
      <main className="site-main container py-4 py-lg-5">
        {children || <Outlet />}
      </main>
      {!admin && <Footer />}
    </div>
  );
};

export default Layout;
