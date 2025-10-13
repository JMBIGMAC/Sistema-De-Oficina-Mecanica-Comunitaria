import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Spinner, Center, Text } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { hasRoleLevel } from '../utils/permissions';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  fallback?: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = UserRole.USER,
  fallback,
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Center h="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text mt={4} color="gray.600">
            Loading...
          </Text>
        </Box>
      </Center>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has required role level
  if (!hasRoleLevel(user, requiredRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Center h="50vh">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="error.500" mb={2}>
            Access Denied
          </Text>
          <Text color="gray.600">
            You don't have permission to access this page.
          </Text>
        </Box>
      </Center>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;