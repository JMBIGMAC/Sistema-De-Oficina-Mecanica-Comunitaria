import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
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
  FormErrorMessage,
  Progress,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { SignUpFormData } from '../types';

const SignUp: React.FC = () => {
  const { signup, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const gradientBg = useColorModeValue(
    'linear(to-br, secondary.50, accent.50)',
    'linear(to-br, gray.800, gray.900)'
  );

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 40) return 'red';
    if (strength < 70) return 'yellow';
    return 'green';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await signup(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box bgGradient={gradientBg} minH="100vh" py={12}>
      <Container maxW="lg">
        <Card bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden">
          <CardBody p={8}>
            <VStack spacing={6}>
              {/* Header */}
              <VStack spacing={2} textAlign="center">
                <Heading size="xl" color="secondary.500">
                  Create Your Account
                </Heading>
                <Text color="gray.600">
                  Join our community and get started today
                </Text>
              </VStack>

              {/* Error Alert */}
              {error && (
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              {/* Sign Up Form */}
              <Box as="form" onSubmit={handleSubmit} w="full">
                <VStack spacing={4}>
                  {/* Name Fields */}
                  <HStack spacing={4} w="full">
                    <FormControl isRequired isInvalid={!!validationErrors.firstName}>
                      <FormLabel>First Name</FormLabel>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        size="lg"
                        focusBorderColor="secondary.500"
                      />
                      <FormErrorMessage>{validationErrors.firstName}</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!validationErrors.lastName}>
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        size="lg"
                        focusBorderColor="secondary.500"
                      />
                      <FormErrorMessage>{validationErrors.lastName}</FormErrorMessage>
                    </FormControl>
                  </HStack>

                  {/* Email */}
                  <FormControl isRequired isInvalid={!!validationErrors.email}>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      size="lg"
                      focusBorderColor="secondary.500"
                    />
                    <FormErrorMessage>{validationErrors.email}</FormErrorMessage>
                  </FormControl>

                  {/* Password */}
                  <FormControl isRequired isInvalid={!!validationErrors.password}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a strong password"
                        size="lg"
                        focusBorderColor="secondary.500"
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
                    {formData.password && (
                      <Box mt={2}>
                        <Text fontSize="sm" color="gray.600" mb={1}>
                          Password strength
                        </Text>
                        <Progress
                          value={passwordStrength}
                          colorScheme={getPasswordStrengthColor(passwordStrength)}
                          size="sm"
                          borderRadius="full"
                        />
                      </Box>
                    )}
                    <FormErrorMessage>{validationErrors.password}</FormErrorMessage>
                  </FormControl>

                  {/* Confirm Password */}
                  <FormControl isRequired isInvalid={!!validationErrors.confirmPassword}>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      size="lg"
                      focusBorderColor="secondary.500"
                    />
                    <FormErrorMessage>{validationErrors.confirmPassword}</FormErrorMessage>
                  </FormControl>

                  {/* Terms Agreement */}
                  <FormControl isInvalid={!!validationErrors.agreeToTerms}>
                    <Checkbox
                      name="agreeToTerms"
                      isChecked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      colorScheme="secondary"
                    >
                      <Text fontSize="sm">
                        I agree to the{' '}
                        <Link color="secondary.500" _hover={{ textDecoration: 'underline' }}>
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link color="secondary.500" _hover={{ textDecoration: 'underline' }}>
                          Privacy Policy
                        </Link>
                      </Text>
                    </Checkbox>
                    <FormErrorMessage>{validationErrors.agreeToTerms}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    size="lg"
                    w="full"
                    isLoading={isLoading}
                    loadingText="Creating account..."
                    variant="solid"
                    colorScheme="secondary"
                  >
                    Create Account
                  </Button>
                </VStack>
              </Box>

              {/* Divider */}
              <Box w="full">
                <Divider />
              </Box>

              {/* Login link */}
              <Text textAlign="center" color="gray.600">
                Already have an account?{' '}
                <Link
                  as={RouterLink}
                  to="/login"
                  color="secondary.500"
                  fontWeight="medium"
                  _hover={{ color: 'secondary.600', textDecoration: 'underline' }}
                >
                  Sign in here
                </Link>
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default SignUp;