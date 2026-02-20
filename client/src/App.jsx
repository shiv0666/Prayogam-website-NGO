import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Mission from './pages/Mission.jsx';
import Programs from './pages/Programs.jsx';
import Contact from './pages/Contact.jsx';
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
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/contact" element={<Contact />} />
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
        path="/admin/accounts"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout admin>
              <AdminUsers />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
