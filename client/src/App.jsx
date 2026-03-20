import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Mission from './pages/Mission.jsx';
import Programs from './pages/Programs.jsx';
import Contact from './pages/Contact.jsx';
import Donate from './pages/Donate.jsx';
import VolunteerRegistration from './pages/VolunteerRegistration.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminPrograms from './pages/admin/AdminPrograms.jsx';
import AdminAnnouncements from './pages/admin/AdminAnnouncements.jsx';
import AdminMessages from './pages/admin/AdminMessages.jsx';
import AdminContent from './pages/admin/AdminContent.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import AdminEvents from './pages/admin/AdminEvents.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminImpactStats from './pages/admin/AdminImpactStats.jsx';
import AdminDonations from './pages/admin/AdminDonations.jsx';
import AdminStories from './pages/admin/AdminStories.jsx';
import AdminVolunteers from './pages/admin/AdminVolunteers.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminFundLedger from './pages/admin/AdminFundLedger.jsx';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/volunteer/:eventId" element={<VolunteerRegistration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout admin>
              <Navigate to="/admin/dashboard" replace />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/programs"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminPrograms />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/announcements"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminAnnouncements />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminEvents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout admin>
              <AdminMessages />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/content"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminContent />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/impact-stats"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminImpactStats />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/impact"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminImpactStats />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout admin>
              <AdminSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/ngo-details"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout admin>
              <AdminSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout admin>
              <AdminUsers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/donations"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminDonations />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/volunteers"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminVolunteers />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/stories"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminStories />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/fund-ledger"
        element={
          <ProtectedRoute allowedRoles={['admin', 'ngo_admin']}>
            <Layout admin>
              <AdminFundLedger />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
