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
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import ContactUs from './pages/ContactUs';
import UserProblems from './pages/UserProblems';
import RoleManagement from './pages/RoleManagement';
import NotFound from './pages/NotFound';
import PaymentTest from './pages/PaymentTest';
import Payment from './pages/Payment';
import ControlUsers from './pages/ControlUsers';
import ClientesManagement from './pages/ClientesManagement';
import VeiculosManagement from './pages/VeiculosManagement';
import ServicosManagement from './pages/ServicosManagement';
import OrdensServicoManagement from './pages/OrdensServicoManagement';
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
              
              {/* All Authenticated Users */}
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute requiredRole={UserRole.USER}>
                    <Home />
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
              
              {/* Cliente (USER) Routes - Can only contact and hire services */}
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
              
              {/* Mecânico/Trabalhador (MODERATOR) Routes - Workshop operations */}
              <Route 
                path="/clientes" 
                element={
                  <ProtectedRoute requiredRole={UserRole.MODERATOR}>
                    <ClientesManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/veiculos" 
                element={
                  <ProtectedRoute requiredRole={UserRole.MODERATOR}>
                    <VeiculosManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/servicos" 
                element={
                  <ProtectedRoute requiredRole={UserRole.MODERATOR}>
                    <ServicosManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/ordens" 
                element={
                  <ProtectedRoute requiredRole={UserRole.MODERATOR}>
                    <OrdensServicoManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Gerente (ADMIN) Routes - Full monitoring and control */}
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/usersProblems" 
                element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <UserProblems />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/control/users" 
                element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <ControlUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/organization/roles" 
                element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <RoleManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/home/payment/test" 
                element={
                  <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <PaymentTest />
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
