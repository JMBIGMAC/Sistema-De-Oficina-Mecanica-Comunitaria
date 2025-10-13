import React from 'react';
import {
  Box,
  Container,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Badge,
  Button,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Card,
  CardBody,
  Divider,
  SimpleGrid,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { 
  FaUser, 
  FaCog, 
  FaHome,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaBell,
  FaCreditCard,
} from 'react-icons/fa';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RoleBasedRender from '../components/RoleBasedRender';
import { UserRole } from '../types';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure();
  
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const bgGradient = useColorModeValue(
    'linear(to-br, brand.50, secondary.50)',
    'linear(to-br, gray.900, gray.800)'
  );
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) return null;

  const sidebarItems = [
    {
      icon: FaHome,
      label: 'Dashboard',
      path: '/dashboard',
      roles: [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]
    },
    {
      icon: FaUser,
      label: 'Profile',
      path: '/profile',
    },
    {
      icon: FaCog,
      label: 'Settings',
      path: '/settings',
    },
  ];

  // Client/User Home Content
  const ClientHomeContent = () => (
    <VStack spacing={8} align="stretch">
      <Box
        bgGradient={bgGradient}
        p={8}
        rounded="2xl"
        textAlign="center"
      >
        <Heading size="2xl" mb={4}>
          Welcome, {user.firstName}! 👋
        </Heading>
        <Text fontSize="lg" mb={6}>
          Your personal dashboard is ready. Explore your features and manage your account.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card bg={cardBg} as={RouterLink} to="/dashboard" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaHome as any} boxSize={12} color="brand.500" mb={4} />
            <Heading size="md" mb={2}>Dashboard</Heading>
            <Text fontSize="sm" color="gray.600">View your stats and activity</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/profile" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaUser as any} boxSize={12} color="secondary.500" mb={4} />
            <Heading size="md" mb={2}>Profile</Heading>
            <Text fontSize="sm" color="gray.600">Manage your personal information</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/home/payment" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaCreditCard as any} boxSize={12} color="green.500" mb={4} />
            <Heading size="md" mb={2}>Payment</Heading>
            <Text fontSize="sm" color="gray.600">Manage subscriptions and billing</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/contactUs" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaBell as any} boxSize={12} color="orange.500" mb={4} />
            <Heading size="md" mb={2}>Contact Us</Heading>
            <Text fontSize="sm" color="gray.600">Get help and support</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Quick Stats</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box textAlign="center" p={4}>
              <Stat>
                <StatLabel>Profile Completion</StatLabel>
                <StatNumber>85%</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Almost there!
                </StatHelpText>
              </Stat>
            </Box>
            <Box textAlign="center" p={4}>
              <Stat>
                <StatLabel>Account Status</StatLabel>
                <StatNumber>Active</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="green">Good standing</Badge>
                </StatHelpText>
              </Stat>
            </Box>
            <Box textAlign="center" p={4}>
              <Stat>
                <StatLabel>Member Since</StatLabel>
                <StatNumber>{new Date(user.createdAt).getFullYear()}</StatNumber>
                <StatHelpText>
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                </StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );

  // Owner/Moderator Home Content
  const OwnerHomeContent = () => (
    <VStack spacing={8} align="stretch">
      <Box
        bgGradient={bgGradient}
        p={8}
        rounded="2xl"
        textAlign="center"
      >
        <Heading size="2xl" mb={4}>
          Moderator Control Center 🛡️
        </Heading>
        <Text fontSize="lg" mb={6}>
          Welcome back, {user.firstName}! Monitor analytics and manage user issues.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card bg={cardBg} as={RouterLink} to="/analytics" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaChartLine as any} boxSize={12} color="purple.500" mb={4} />
            <Heading size="md" mb={2}>Analytics</Heading>
            <Text fontSize="sm" color="gray.600">Monitor system performance</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/analytics/users" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaUsers as any} boxSize={12} color="blue.500" mb={4} />
            <Heading size="md" mb={2}>User Analytics</Heading>
            <Text fontSize="sm" color="gray.600">User behavior and stats</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/usersProblems" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaShieldAlt as any} boxSize={12} color="orange.500" mb={4} />
            <Heading size="md" mb={2}>User Problems</Heading>
            <Text fontSize="sm" color="gray.600">Handle user issues</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/dashboard" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaHome as any} boxSize={12} color="green.500" mb={4} />
            <Heading size="md" mb={2}>Dashboard</Heading>
            <Text fontSize="sm" color="gray.600">Your personal dashboard</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="md" mb={4}>System Overview</Heading>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text>Active Users</Text>
                <Badge colorScheme="green" fontSize="md">1,284</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text>Pending Issues</Text>
                <Badge colorScheme="orange" fontSize="md">23</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text>System Health</Text>
                <Badge colorScheme="green" fontSize="md">98%</Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <VStack spacing={3}>
              <Button as={RouterLink} to="/analytics/trends" leftIcon={<Icon as={FaChartLine as any} />} w="full" variant="outline">
                View Trends
              </Button>
              <Button as={RouterLink} to="/analytics/all-time" leftIcon={<Icon as={FaChartLine as any} />} w="full" variant="outline">
                Historical Data
              </Button>
              <Button as={RouterLink} to="/profile/all" leftIcon={<Icon as={FaUsers as any} />} w="full" variant="outline">
                All Profiles
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );

  // Admin/Developer Home Content
  const AdminHomeContent = () => (
    <VStack spacing={8} align="stretch">
      <Box
        bgGradient={bgGradient}
        p={8}
        rounded="2xl"
        textAlign="center"
      >
        <Heading size="2xl" mb={4}>
          Administrator Portal 👨‍💻
        </Heading>
        <Text fontSize="lg" mb={6}>
          Full system access enabled. Manage everything from here, {user.firstName}.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card bg={cardBg} as={RouterLink} to="/organization/roles" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaShieldAlt as any} boxSize={12} color="purple.500" mb={4} />
            <Heading size="md" mb={2}>Role Management</Heading>
            <Text fontSize="sm" color="gray.600">Configure user roles</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/control/users" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaUsers as any} boxSize={12} color="blue.500" mb={4} />
            <Heading size="md" mb={2}>User Monitoring</Heading>
            <Text fontSize="sm" color="gray.600">Monitor all users</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/analytics" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaChartLine as any} boxSize={12} color="green.500" mb={4} />
            <Heading size="md" mb={2}>Analytics Hub</Heading>
            <Text fontSize="sm" color="gray.600">Complete analytics suite</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/home/payment/test" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaCog as any} boxSize={12} color="orange.500" mb={4} />
            <Heading size="md" mb={2}>Payment Test</Heading>
            <Text fontSize="sm" color="gray.600">Test payment systems</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Developer Tools</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Button as={RouterLink} to="/about/edit" variant="outline" size="lg">
              Edit About Page
            </Button>
            <Button as={RouterLink} to="/error/raw" variant="outline" size="lg">
              View Error Logs
            </Button>
            <Button as={RouterLink} to="/organization/roles" variant="solid" colorScheme="purple" size="lg">
              Role Config
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>1,284</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>System Health</StatLabel>
              <StatNumber color="green.500">98%</StatNumber>
              <StatHelpText>
                <Badge colorScheme="green">Excellent</Badge>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>Active Sessions</StatLabel>
              <StatNumber>892</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                142 new
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w={{ base: 0, lg: '280px' }}
        bg={sidebarBg}
        borderRight="1px"
        borderColor={borderColor}
        display={{ base: 'none', lg: 'block' }}
        position="fixed"
        h="full"
        overflowY="auto"
      >
        <VStack spacing={6} p={6} align="stretch">
          {/* Profile Section */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4}>
                <Avatar 
                  size="lg" 
                  name={`${user.firstName} ${user.lastName}`}
                  src={user.avatar}
                />
                <VStack spacing={1} textAlign="center">
                  <Text fontWeight="bold" fontSize="lg">
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    ID: {user.id}
                  </Text>
                  <HStack spacing={2}>
                    <Badge 
                      colorScheme={user.role === UserRole.ADMIN ? 'purple' : 
                                  user.role === UserRole.MODERATOR ? 'blue' : 'green'}
                      variant="solid"
                    >
                      {user.role.toUpperCase()}
                    </Badge>
                    {user.isActive && (
                      <Badge colorScheme="green" variant="outline">
                        ACTIVE
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="xs" color="gray.400">
                    Last active: {new Date().toLocaleString()}
                  </Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Navigation */}
          <VStack spacing={2} align="stretch">
            {sidebarItems.map((item) => (
              <RoleBasedRender 
                key={item.path}
                roles={item.roles}
                fallback={null}
              >
                <Button
                  as={RouterLink}
                  to={item.path}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  {item.label}
                </Button>
              </RoleBasedRender>
            ))}
            
            <Divider />
            
            {/* Color Mode Toggle */}
            <Button
              variant="ghost"
              justifyContent="flex-start"
              onClick={toggleColorMode}
            >
              {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
            </Button>
            
            {/* Messages */}
            <Button
              as={RouterLink}
              to="/messages"
              variant="ghost"
              justifyContent="flex-start"
            >
              Messages
            </Button>
          </VStack>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" ml={{ base: 0, lg: '280px' }}>
        {/* Top Bar for Mobile */}
        <Flex
          p={4}
          bg={sidebarBg}
          borderBottom="1px"
          borderColor={borderColor}
          display={{ base: 'flex', lg: 'none' }}
          align="center"
        >
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            onClick={onSidebarOpen}
            variant="ghost"
          />
          <Text ml={4} fontWeight="bold">
            Welcome, {user.firstName}!
          </Text>
        </Flex>

        {/* Role-Specific Content */}
        <Container maxW="container.xl" py={8}>
          <RoleBasedRender roles={[UserRole.ADMIN]}>
            <AdminHomeContent />
          </RoleBasedRender>

          <RoleBasedRender roles={[UserRole.MODERATOR]} fallback={null}>
            <OwnerHomeContent />
          </RoleBasedRender>

          <RoleBasedRender roles={[UserRole.USER]} fallback={null}>
            <ClientHomeContent />
          </RoleBasedRender>
        </Container>
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer isOpen={isSidebarOpen} placement="left" onClose={onSidebarClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {/* Mobile Profile */}
              <VStack spacing={2}>
                <Avatar 
                  size="md" 
                  name={`${user.firstName} ${user.lastName}`}
                  src={user.avatar}
                />
                <Text fontWeight="bold">{user.firstName} {user.lastName}</Text>
                <Badge 
                  colorScheme={user.role === UserRole.ADMIN ? 'purple' : 
                              user.role === UserRole.MODERATOR ? 'blue' : 'green'}
                >
                  {user.role.toUpperCase()}
                </Badge>
              </VStack>
              
              <Divider />
              
              {/* Mobile Navigation */}
              {sidebarItems.map((item) => (
                <Button
                  key={item.path}
                  as={RouterLink}
                  to={item.path}
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={onSidebarClose}
                >
                  {item.label}
                </Button>
              ))}
              
              <Button
                variant="ghost"
                justifyContent="flex-start"
                onClick={() => {
                  toggleColorMode();
                  onSidebarClose();
                }}
              >
                {colorMode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
              
              <Button
                as={RouterLink}
                to="/messages"
                variant="ghost"
                justifyContent="flex-start"
                onClick={onSidebarClose}
              >
                Messages
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Home;