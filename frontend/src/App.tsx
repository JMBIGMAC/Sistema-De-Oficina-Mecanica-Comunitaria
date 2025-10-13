import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import ContactUs from './pages/ContactUs';
import UserProblems from './pages/UserProblems';
import RoleManagement from './pages/RoleManagement';
import NotFound from './pages/NotFound';
import TechnicalError from './pages/TechnicalError';
import ProfileAll from './pages/ProfileAll';
import AnalyticsUsers from './pages/AnalyticsUsers';
import AnalyticsGraphics from './pages/AnalyticsGraphics';
import AnalyticsAllTime from './pages/AnalyticsAllTime';
import AnalyticsTrends from './pages/AnalyticsTrends';
import AboutEdit from './pages/AboutEdit';
import PaymentTest from './pages/PaymentTest';
import Payment from './pages/Payment';
import ControlUsers from './pages/ControlUsers';
import ClientesManagement from './pages/ClientesManagement';
import VeiculosManagement from './pages/VeiculosManagement';
import ServicosManagement from './pages/ServicosManagement';
import { UserRole } from './types';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Client (User) Routes */}
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contactUs" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <ContactUs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/home/payment" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <Payment />
                  </ProtectedRoute>
                } 
              />
              
              {/* Owner (Moderator) Routes */}
              <Route 
                path="/profile/all" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.MODERATOR}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>All Profiles</h2>
                        <p>This feature requires owner access or higher.</p>
                      </div>
                    }
                  >
                    <ProfileAll />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.MODERATOR}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Analytics Dashboard</h2>
                        <p>This feature requires owner access or higher.</p>
                      </div>
                    }
                  >
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics/users" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.MODERATOR}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>User Analytics</h2>
                        <p>This feature requires owner access or higher.</p>
                      </div>
                    }
                  >
                    <AnalyticsUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics/graphics" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.MODERATOR}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Graphics & Charts</h2>
                        <p>This feature requires owner access or higher.</p>
                      </div>
                    }
                  >
                    <AnalyticsGraphics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics/all-time" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.MODERATOR}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>All Time View</h2>
                        <p>This feature requires owner access or higher.</p>
                      </div>
                    }
                  >
                    <AnalyticsAllTime />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics/trends" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.MODERATOR}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Trends Analysis</h2>
                        <p>This feature requires owner access or higher.</p>
                      </div>
                    }
                  >
                    <AnalyticsTrends />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/usersProblems" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.MODERATOR}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>User Problems</h2>
                        <p>This feature requires owner access or higher.</p>
                      </div>
                    }
                  >
                    <UserProblems />
                  </ProtectedRoute>
                } 
              />
              
              {/* Dev (Admin) Routes */}
              <Route 
                path="/about/edit" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.ADMIN}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Edit About Page</h2>
                        <p>This area requires developer access.</p>
                      </div>
                    }
                  >
                    <AboutEdit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/home/payment/test" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.ADMIN}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Payment Testing</h2>
                        <p>This area requires developer access.</p>
                      </div>
                    }
                  >
                    <PaymentTest />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/control/users" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.ADMIN}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>User Monitoring</h2>
                        <p>This area requires developer access.</p>
                      </div>
                    }
                  >
                    <ControlUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/organization/roles" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.ADMIN}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Role Management</h2>
                        <p>This area requires developer access.</p>
                      </div>
                    }
                  >
                    <RoleManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/error/raw" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.ADMIN}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Technical Error Details</h2>
                        <p>This area requires developer access.</p>
                      </div>
                    }
                  >
                    <TechnicalError />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute 
                    requiredRole={UserRole.ADMIN}
                    fallback={
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h2>Admin Panel</h2>
                        <p>This area requires administrator access.</p>
                      </div>
                    }
                  >
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <h2>Admin Panel</h2>
                      <p>Admin content would go here...</p>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Messages Route */}
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <Messages />
                  </ProtectedRoute>
                } 
              />
              
              {/* Workshop Management Routes */}
              <Route 
                path="/clientes" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <ClientesManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/veiculos" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <VeiculosManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/servicos" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <ServicosManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                      <h2>Settings</h2>
                      <p>User settings page coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
