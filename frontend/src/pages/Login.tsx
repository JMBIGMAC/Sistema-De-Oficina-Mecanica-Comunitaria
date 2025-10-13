import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  Link,
  Alert,
  AlertIcon,
  Divider,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginFormData } from '../types';

const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const location = useLocation();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const gradientBg = useColorModeValue(
    'linear(to-br, brand.50, secondary.50)',
    'linear(to-br, gray.800, gray.900)'
  );
  const demoBg = useColorModeValue('blue.50', 'blue.900');

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Redirect if already authenticated
  const from = (location.state as any)?.from?.pathname || '/home';
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box bgGradient={gradientBg} minH="100vh" py={12}>
      <Container maxW="md">
        <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
          <CardBody p={8}>
            <VStack spacing={6}>
              {/* Header */}
              <VStack spacing={2} textAlign="center">
                <Heading size="xl" color="brand.500">
                  Welcome Back
                </Heading>
                <Text color="gray.600">
                  Please sign in to your account
                </Text>
              </VStack>

              {/* Demo Credentials */}
              <Box
                bg={demoBg}
                p={4}
                rounded="lg"
                w="full"
              >
                <Text fontSize="sm" fontWeight="medium" mb={2} color="blue.700">
                  Demo Credentials:
                </Text>
                <VStack spacing={1} align="start" fontSize="xs" color="blue.600">
                  <Text>Admin: admin@example.com / admin123</Text>
                  <Text>User: user@example.com / user123</Text>
                  <Text>Moderator: moderator@example.com / mod123</Text>
                </VStack>
              </Box>

              {/* Error Alert */}
              {error && (
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Box as="form" onSubmit={handleSubmit} w="full">
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      size="lg"
                      focusBorderColor="brand.500"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        size="lg"
                        focusBorderColor="brand.500"
                      />
                      <InputRightElement h="full">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          onClick={togglePasswordVisibility}
                          variant="ghost"
                          size="sm"
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Box w="full">
                    <Checkbox
                      name="rememberMe"
                      isChecked={formData.rememberMe}
                      onChange={handleInputChange}
                      colorScheme="brand"
                    >
                      Remember me
                    </Checkbox>
                  </Box>

                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    variant="solid"
                  >
                    Sign In
                  </Button>
                </VStack>
              </Box>

              {/* Divider */}
              <Box w="full">
                <Divider />
              </Box>

              {/* Sign up link */}
              <Text textAlign="center" color="gray.600">
                Don't have an account?{' '}
                <Link
                  as={RouterLink}
                  to="/signup"
                  color="brand.500"
                  fontWeight="medium"
                  _hover={{ color: 'brand.600', textDecoration: 'underline' }}
                >
                  Sign up here
                </Link>
              </Text>

              {/* Forgot password link */}
              <Link
                color="brand.500"
                fontSize="sm"
                _hover={{ color: 'brand.600', textDecoration: 'underline' }}
              >
                Forgot your password?
              </Link>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;