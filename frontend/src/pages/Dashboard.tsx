import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Icon,
  VStack,
  HStack,
  Badge,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Avatar,
  Flex,
  Progress,
} from '@chakra-ui/react';
import { 
  FaUser, 
  FaChartLine, 
  FaUsers, 
  FaCog, 
  FaShieldAlt,
  FaBell,
  FaTasks,
  FaCalendarAlt
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { getFeatureFlags, getComponentPermissions } from '../utils/permissions';
import RoleBasedRender from '../components/RoleBasedRender';
import { UserRole } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const featureFlags = getFeatureFlags(user);
  const permissions = getComponentPermissions(user);
  
  // System health state
  const [systemHealth, setSystemHealth] = useState({
    overall: 98,
    cpu: 87,
    memory: 92,
    disk: 85,
    network: 99,
    database: 95,
    lastUpdated: new Date()
  });

  // Profile completion calculation
  const calculateProfileCompletion = () => {
    let completion = 0;
    if (user?.firstName) completion += 20;
    if (user?.lastName) completion += 20;
    if (user?.email) completion += 20;
    if (user?.avatar) completion += 20;
    if (user?.role) completion += 20;
    return completion;
  };

  // Simulate real-time system health updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => {
        const newHealth = {
          cpu: Math.max(75, Math.min(100, prev.cpu + (Math.random() - 0.5) * 5)),
          memory: Math.max(80, Math.min(100, prev.memory + (Math.random() - 0.5) * 3)),
          disk: Math.max(70, Math.min(100, prev.disk + (Math.random() - 0.5) * 2)),
          network: Math.max(95, Math.min(100, prev.network + (Math.random() - 0.5) * 1)),
          database: Math.max(85, Math.min(100, prev.database + (Math.random() - 0.5) * 4)),
          lastUpdated: new Date()
        };
        
        // Calculate overall health as average
        const overall = Math.round(
          (newHealth.cpu + newHealth.memory + newHealth.disk + newHealth.network + newHealth.database) / 5
        );
        
        return { ...newHealth, overall };
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getHealthStatus = (percentage: number) => {
    if (percentage >= 95) return { color: 'green', status: 'Excellent' };
    if (percentage >= 85) return { color: 'yellow', status: 'Good' };
    if (percentage >= 70) return { color: 'orange', status: 'Warning' };
    return { color: 'red', status: 'Critical' };
  };
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const statBg = useColorModeValue('gray.50', 'gray.700');

  if (!user) return null;

  return (
    <Box py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Welcome Header */}
          <Box>
            <Flex align="center" mb={4}>
              <Avatar 
                size="lg" 
                name={`${user.firstName} ${user.lastName}`}
                src={user.avatar}
                mr={4}
              />
              <Box>
                <Heading size="lg">
                  Welcome back, {user.firstName}!
                </Heading>
                <HStack spacing={2} mt={2}>
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
              </Box>
            </Flex>
            <Text color="gray.600">
              Here's what's happening with your account today.
            </Text>
          </Box>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Profile Completion</StatLabel>
                  <StatNumber>{calculateProfileCompletion()}%</StatNumber>
                  <StatHelpText>
                    <StatArrow type={calculateProfileCompletion() >= 80 ? "increase" : "decrease"} />
                    {calculateProfileCompletion() >= 80 ? 'Well done!' : 'Complete your profile'}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <RoleBasedRender roles={[UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]}>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Activities</StatLabel>
                    <StatNumber>23</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      5 new this week
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </RoleBasedRender>

            <RoleBasedRender roles={[UserRole.MODERATOR, UserRole.ADMIN]}>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Moderated Items</StatLabel>
                    <StatNumber>156</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      -3% from yesterday
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </RoleBasedRender>

            <RoleBasedRender roles={[UserRole.ADMIN]}>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>System Health</StatLabel>
                    <StatNumber color={`${getHealthStatus(systemHealth.overall).color}.500`}>
                      {systemHealth.overall}%
                    </StatNumber>
                    <StatHelpText>
                      <StatArrow 
                        type={systemHealth.overall >= 90 ? "increase" : "decrease"} 
                        color={getHealthStatus(systemHealth.overall).color}
                      />
                      {getHealthStatus(systemHealth.overall).status}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </RoleBasedRender>
          </SimpleGrid>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {/* Left Column - User Actions */}
            <VStack spacing={6} align="stretch">
              {/* Profile Card */}
              <Card bg={cardBg}>
                <CardHeader>
                  <HStack>
                    <Icon as={FaUser as any} color="brand.500" />
                    <Heading size="md">Your Profile</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Email
                      </Text>
                      <Text>{user.email}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Member since
                      </Text>
                      <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        Profile Completion
                      </Text>
                      <Progress value={calculateProfileCompletion()} colorScheme="brand" size="sm" />
                    </Box>
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card bg={cardBg}>
                <CardHeader>
                  <HStack>
                    <Icon as={FaTasks as any} color="secondary.500" />
                    <Heading size="md">Quick Actions</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={3} align="stretch">
                    <Button leftIcon={<Icon as={FaCog as any} />} variant="ghost" justifyContent="flex-start"
                      onClick={() => {}}>
                      Account Settings
                    </Button>
                    <Button leftIcon={<Icon as={FaBell as any} />} variant="ghost" justifyContent="flex-start"
                      onClick={() => {}}>
                      Notifications
                    </Button>
                    <RoleBasedRender roles={[UserRole.MODERATOR, UserRole.ADMIN]}>
                      <Button leftIcon={<Icon as={FaShieldAlt as any} />} variant="ghost" justifyContent="flex-start"
                        onClick={() => {}}>
                        Moderation Tools
                      </Button>
                    </RoleBasedRender>
                    <RoleBasedRender roles={[UserRole.ADMIN]}>
                      <Button leftIcon={<Icon as={FaUsers as any} />} variant="ghost" justifyContent="flex-start"
                        onClick={() => {}}>
                        User Management
                      </Button>
                    </RoleBasedRender>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>

            {/* Middle Column - Activity Feed */}
            <Card bg={cardBg}>
              <CardHeader>
                <HStack>
                  <Icon as={FaChartLine as any} color="accent.500" />
                  <Heading size="md">Recent Activity</Heading>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="stretch">
                  <Box p={4} bg={statBg} rounded="lg">
                    <HStack>
                      <Box w={2} h={2} bg="green.500" rounded="full" />
                      <Box flex={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          Profile updated successfully
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          2 hours ago
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  <RoleBasedRender roles={[UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]}>
                    <Box p={4} bg={statBg} rounded="lg">
                      <HStack>
                        <Box w={2} h={2} bg="blue.500" rounded="full" />
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            New activity logged
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            1 day ago
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </RoleBasedRender>

                  <RoleBasedRender roles={[UserRole.MODERATOR, UserRole.ADMIN]}>
                    <Box p={4} bg={statBg} rounded="lg">
                      <HStack>
                        <Box w={2} h={2} bg="yellow.500" rounded="full" />
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            Content moderation completed
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            2 days ago
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </RoleBasedRender>

                  <RoleBasedRender roles={[UserRole.ADMIN]}>
                    <Box p={4} bg={statBg} rounded="lg">
                      <HStack>
                        <Box w={2} h={2} bg="purple.500" rounded="full" />
                        <Box flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            System maintenance completed
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            3 days ago
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </RoleBasedRender>
                </VStack>
              </CardBody>
            </Card>

            {/* Right Column - Permissions & Features */}
            <VStack spacing={6} align="stretch">
              {/* Available Features */}
              <Card bg={cardBg}>
                <CardHeader>
                  <HStack>
                    <Icon as={FaShieldAlt as any} color="success.500" />
                    <Heading size="md">Your Permissions</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm">View Content</Text>
                      <Badge colorScheme={permissions.canView ? 'green' : 'red'}>
                        {permissions.canView ? 'Allowed' : 'Denied'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Edit Content</Text>
                      <Badge colorScheme={permissions.canEdit ? 'green' : 'red'}>
                        {permissions.canEdit ? 'Allowed' : 'Denied'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Create Content</Text>
                      <Badge colorScheme={permissions.canCreate ? 'green' : 'red'}>
                        {permissions.canCreate ? 'Allowed' : 'Denied'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Delete Content</Text>
                      <Badge colorScheme={permissions.canDelete ? 'green' : 'red'}>
                        {permissions.canDelete ? 'Allowed' : 'Denied'}
                      </Badge>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Feature Flags */}
              <Card bg={cardBg}>
                <CardHeader>
                  <HStack>
                    <Icon as={FaCog as any} color="warning.500" />
                    <Heading size="md">Available Features</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm">Analytics</Text>
                      <Badge colorScheme={featureFlags.showAnalytics ? 'green' : 'gray'}>
                        {featureFlags.showAnalytics ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">User Management</Text>
                      <Badge colorScheme={featureFlags.showUserManagement ? 'green' : 'gray'}>
                        {featureFlags.showUserManagement ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Admin Panel</Text>
                      <Badge colorScheme={featureFlags.showAdminPanel ? 'green' : 'gray'}>
                        {featureFlags.showAdminPanel ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Content Moderation</Text>
                      <Badge colorScheme={featureFlags.canModerateContent ? 'green' : 'gray'}>
                        {featureFlags.canModerateContent ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* System Health Details - Admin Only */}
              <RoleBasedRender roles={[UserRole.ADMIN]}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <HStack>
                      <Icon as={FaCog as any} color="green.500" />
                      <Heading size="md">System Health Details</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm">CPU Usage</Text>
                        <HStack>
                          <Progress 
                            value={systemHealth.cpu} 
                            size="sm" 
                            width="60px"
                            colorScheme={getHealthStatus(systemHealth.cpu).color}
                          />
                          <Text fontSize="sm" fontWeight="bold" color={`${getHealthStatus(systemHealth.cpu).color}.500`}>
                            {Math.round(systemHealth.cpu)}%
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Memory</Text>
                        <HStack>
                          <Progress 
                            value={systemHealth.memory} 
                            size="sm" 
                            width="60px"
                            colorScheme={getHealthStatus(systemHealth.memory).color}
                          />
                          <Text fontSize="sm" fontWeight="bold" color={`${getHealthStatus(systemHealth.memory).color}.500`}>
                            {Math.round(systemHealth.memory)}%
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Disk Space</Text>
                        <HStack>
                          <Progress 
                            value={systemHealth.disk} 
                            size="sm" 
                            width="60px"
                            colorScheme={getHealthStatus(systemHealth.disk).color}
                          />
                          <Text fontSize="sm" fontWeight="bold" color={`${getHealthStatus(systemHealth.disk).color}.500`}>
                            {Math.round(systemHealth.disk)}%
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Network</Text>
                        <HStack>
                          <Progress 
                            value={systemHealth.network} 
                            size="sm" 
                            width="60px"
                            colorScheme={getHealthStatus(systemHealth.network).color}
                          />
                          <Text fontSize="sm" fontWeight="bold" color={`${getHealthStatus(systemHealth.network).color}.500`}>
                            {Math.round(systemHealth.network)}%
                          </Text>
                        </HStack>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Database</Text>
                        <HStack>
                          <Progress 
                            value={systemHealth.database} 
                            size="sm" 
                            width="60px"
                            colorScheme={getHealthStatus(systemHealth.database).color}
                          />
                          <Text fontSize="sm" fontWeight="bold" color={`${getHealthStatus(systemHealth.database).color}.500`}>
                            {Math.round(systemHealth.database)}%
                          </Text>
                        </HStack>
                      </HStack>
                      <Text fontSize="xs" color="gray.500" textAlign="center" pt={2}>
                        Last updated: {systemHealth.lastUpdated.toLocaleTimeString()}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </RoleBasedRender>

              {/* Calendar Widget */}
              <Card bg={cardBg}>
                <CardHeader>
                  <HStack>
                    <Icon as={FaCalendarAlt as any} color="error.500" />
                    <Heading size="md">Today</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Text fontSize="sm" color="gray.600">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                </CardBody>
              </Card>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;