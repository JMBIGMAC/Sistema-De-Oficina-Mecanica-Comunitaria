import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FaRocket, 
  FaUsers, 
  FaShieldAlt, 
  FaPalette, 
  FaCode, 
  FaMobile 
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import RoleBasedRender from '../components/RoleBasedRender';
import { UserRole } from '../types';
import { getFeatureFlags } from '../utils/permissions';

const About: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const featureFlags = getFeatureFlags(user);
  
  const gradientBg = useColorModeValue(
    'linear(to-r, brand.500, secondary.500)',
    'linear(to-r, brand.600, secondary.600)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const features = [
    {
      icon: FaRocket,
      title: 'Modern Tech Stack',
      description: 'Built with React, TypeScript, Chakra UI, and Django for a robust full-stack experience.',
      color: 'brand.500',
    },
    {
      icon: FaUsers,
      title: 'Role-Based Access',
      description: 'Sophisticated user role management with granular permissions and feature flags.',
      color: 'secondary.500',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Authentication',
      description: 'Comprehensive authentication system with JWT tokens and secure session management.',
      color: 'success.500',
    },
    {
      icon: FaPalette,
      title: 'Customizable Theme',
      description: 'Beautiful, customizable color palette with dark/light mode support.',
      color: 'accent.500',
    },
    {
      icon: FaCode,
      title: 'Developer Friendly',
      description: 'Clean code architecture with TypeScript, comprehensive testing, and excellent DX.',
      color: 'warning.500',
    },
    {
      icon: FaMobile,
      title: 'Responsive Design',
      description: 'Mobile-first design that works beautifully on all devices and screen sizes.',
      color: 'error.500',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={gradientBg}
        color="white"
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
              lineHeight="shorter"
            >
              Modern Full-Stack
              <br />
              Web Application Template
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              maxW="2xl"
              opacity={0.9}
            >
              A production-ready template with React, TypeScript, Chakra UI, and Django.
              Features role-based access control, modern UI components, and comprehensive testing.
            </Text>

            <HStack spacing={4} flexWrap="wrap" justify="center">
              {!isAuthenticated ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/signup"
                    size="lg"
                    bg="white"
                    color="brand.500"
                    _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'translateY(0)' }}
                    boxShadow="lg"
                  >
                    Get Started
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/login"
                    size="lg"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    Login
                  </Button>
                </>
              ) : (
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  size="lg"
                  bg="white"
                  color="brand.500"
                  _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                  _active={{ transform: 'translateY(0)' }}
                  boxShadow="lg"
                >
                  Go to Dashboard
                </Button>
              )}
            </HStack>

            {/* User Welcome */}
            <RoleBasedRender requireAuth>
              <Box
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                px={6}
                py={4}
                rounded="xl"
                border="1px solid"
                borderColor="whiteAlpha.300"
              >
                <Text fontSize="lg">
                  Welcome back, <strong>{user?.firstName}</strong>!
                </Text>
                <HStack spacing={2} justify="center" mt={2}>
                  <Badge colorScheme="blue" variant="solid">
                    {user?.role.toUpperCase()}
                  </Badge>
                  {featureFlags.showAdminPanel && (
                    <Badge colorScheme="purple" variant="solid">
                      ADMIN ACCESS
                    </Badge>
                  )}
                  {featureFlags.canModerateContent && (
                    <Badge colorScheme="green" variant="solid">
                      MODERATOR
                    </Badge>
                  )}
                </HStack>
              </Box>
            </RoleBasedRender>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 16, md: 20 }}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">
                Everything You Need
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                This template includes all the essential features for building modern web applications
                with proper authentication, authorization, and user management.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  shadow="lg"
                  _hover={{ 
                    transform: 'translateY(-4px)', 
                    shadow: 'xl' 
                  }}
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <VStack spacing={4} align="start">
                      <Flex
                        align="center"
                        justify="center"
                        w={12}
                        h={12}
                        bg={`${feature.color.split('.')[0]}.50`}
                        color={feature.color}
                        rounded="lg"
                      >
                        <Icon as={feature.icon as any} boxSize={6} />
                      </Flex>
                      <Heading size="md">
                        {feature.title}
                      </Heading>
                      <Text color={textColor}>
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Role-Based Feature Preview */}
      <RoleBasedRender requireAuth>
        <Box bg={useColorModeValue('gray.50', 'gray.900')} py={{ base: 16, md: 20 }}>
          <Container maxW="container.xl">
            <VStack spacing={8}>
              <Heading size="xl" textAlign="center">
                Your Available Features
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                <RoleBasedRender roles={[UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]}>
                  <Card bg={cardBg} shadow="md">
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaUsers as any} boxSize={8} color="brand.500" />
                        <Heading size="md">User Dashboard</Heading>
                        <Text textAlign="center" color={textColor}>
                          Access your personal dashboard and profile settings.
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </RoleBasedRender>

                <RoleBasedRender roles={[UserRole.MODERATOR, UserRole.ADMIN]}>
                  <Card bg={cardBg} shadow="md">
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaShieldAlt as any} boxSize={8} color="secondary.500" />
                        <Heading size="md">Moderation Tools</Heading>
                        <Text textAlign="center" color={textColor}>
                          Moderate content and manage community interactions.
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </RoleBasedRender>

                <RoleBasedRender roles={[UserRole.ADMIN]}>
                  <Card bg={cardBg} shadow="md">
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaCode as any} boxSize={8} color="accent.500" />
                        <Heading size="md">Admin Panel</Heading>
                        <Text textAlign="center" color={textColor}>
                          Full system administration and user management.
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </RoleBasedRender>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </RoleBasedRender>
    </Box>
  );
};

export default About;