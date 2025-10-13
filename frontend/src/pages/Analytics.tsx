import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import RoleBasedRender from '../components/RoleBasedRender';
import { UserRole } from '../types';

const Analytics: React.FC = () => {

  const cardBg = useColorModeValue('white', 'gray.800');
  const blueCardBg = useColorModeValue('blue.50', 'blue.900');
  const greenCardBg = useColorModeValue('green.50', 'green.900');
  const orangeCardBg = useColorModeValue('orange.50', 'orange.900');
  const purpleCardBg = useColorModeValue('purple.50', 'purple.900');
  const tealCardBg = useColorModeValue('teal.50', 'teal.900');
  const grayCardBg = useColorModeValue('gray.50', 'gray.600');

  return (
    <Box minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              Analytics Dashboard
            </Heading>
            <Text color="gray.600">
              Monitor your application's performance and user engagement metrics
            </Text>
          </Box>

          {/* Quick Navigation to Sub-Analytics Pages */}
          <RoleBasedRender roles={[UserRole.ADMIN, UserRole.MODERATOR]}>
            <Card bg={cardBg} borderWidth="2px" borderColor="brand.500">
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md" color="brand.500">
                    Detailed Analytics Views
                  </Heading>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Explore comprehensive analytics across different dimensions
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} w="full">
                    <Button
                      as={RouterLink}
                      to="/analytics/users"
                      colorScheme="blue"
                      size="lg"
                      h="auto"
                      py={6}
                      flexDirection="column"
                    >
                      <Text fontSize="3xl" mb={2}>👥</Text>
                      <Text>User Analytics</Text>
                      <Text fontSize="xs" fontWeight="normal" mt={1}>
                        User behavior & activity
                      </Text>
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/analytics/graphics"
                      colorScheme="purple"
                      size="lg"
                      h="auto"
                      py={6}
                      flexDirection="column"
                    >
                      <Text fontSize="3xl" mb={2}>📊</Text>
                      <Text>Charts & Graphics</Text>
                      <Text fontSize="xs" fontWeight="normal" mt={1}>
                        Visual data representations
                      </Text>
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/analytics/all-time"
                      colorScheme="green"
                      size="lg"
                      h="auto"
                      py={6}
                      flexDirection="column"
                    >
                      <Text fontSize="3xl" mb={2}>📈</Text>
                      <Text>All Time View</Text>
                      <Text fontSize="xs" fontWeight="normal" mt={1}>
                        Historical data & records
                      </Text>
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/analytics/trends"
                      colorScheme="orange"
                      size="lg"
                      h="auto"
                      py={6}
                      flexDirection="column"
                    >
                      <Text fontSize="3xl" mb={2}>📉</Text>
                      <Text>Trends Analysis</Text>
                      <Text fontSize="xs" fontWeight="normal" mt={1}>
                        Patterns & predictions
                      </Text>
                    </Button>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </RoleBasedRender>

          {/* Admin Analytics */}
          <RoleBasedRender roles={[UserRole.ADMIN, UserRole.MODERATOR]}>
            <Card bg={cardBg}>
              <CardBody>
                <VStack spacing={6}>
                  <Heading size="lg" color="purple.500">
                    Admin Monitoring Dashboard
                  </Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                    {/* Chart 1: Active Users */}
                    <Card bg={blueCardBg}>
                      <CardBody textAlign="center">
                        <VStack spacing={3}>
                          <Text fontSize="2xl">👥</Text>
                          <Stat>
                            <StatLabel>Active Users</StatLabel>
                            <StatNumber>1,284</StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              23.36% from last month
                            </StatHelpText>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Chart 2: Page Views */}
                    <Card bg={greenCardBg}>
                      <CardBody textAlign="center">
                        <VStack spacing={3}>
                          <Text fontSize="2xl">👁️</Text>
                          <Stat>
                            <StatLabel>Page Views</StatLabel>
                            <StatNumber>45,210</StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              12.5% from last week
                            </StatHelpText>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Chart 3: Click Rate */}
                    <Card bg={orangeCardBg}>
                      <CardBody textAlign="center">
                        <VStack spacing={3}>
                          <Text fontSize="2xl">🖱️</Text>
                          <Stat>
                            <StatLabel>Click Rate</StatLabel>
                            <StatNumber>3.2%</StatNumber>
                            <StatHelpText>
                              <StatArrow type="decrease" />
                              0.8% from last week
                            </StatHelpText>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Chart 4: Session Duration */}
                    <Card bg={purpleCardBg}>
                      <CardBody textAlign="center">
                        <VStack spacing={3}>
                          <Text fontSize="2xl">⏰</Text>
                          <Stat>
                            <StatLabel>Avg. Session</StatLabel>
                            <StatNumber>4:32</StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              15s from last week
                            </StatHelpText>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Chart 5: Daily Logins */}
                    <Card bg={tealCardBg}>
                      <CardBody textAlign="center">
                        <VStack spacing={3}>
                          <Text fontSize="2xl">🔐</Text>
                          <Stat>
                            <StatLabel>Daily Logins</StatLabel>
                            <StatNumber>892</StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              8.2% from yesterday
                            </StatHelpText>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Chart 6: Last Backup */}
                    <Card bg={grayCardBg}>
                      <CardBody textAlign="center">
                        <VStack spacing={3}>
                          <Text fontSize="2xl">💾</Text>
                          <Stat>
                            <StatLabel>Last Backup</StatLabel>
                            <StatNumber>2 hrs ago</StatNumber>
                            <StatHelpText>
                              <Badge colorScheme="green">Successful</Badge>
                            </StatHelpText>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Chart 7: Active Sessions */}
                    <Card bg={blueCardBg}>
                      <CardBody textAlign="center">
                        <VStack spacing={3}>
                          <Text fontSize="2xl">🔗</Text>
                          <Stat>
                            <StatLabel>Active Sessions</StatLabel>
                            <StatNumber>1,284</StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              142 new this hour
                            </StatHelpText>
                          </Stat>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </RoleBasedRender>

          {/* General Analytics for All Authenticated Users */}
          <RoleBasedRender requireAuth>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {/* User Activity Summary */}
              <Card bg={cardBg}>
                <CardBody>
                  <VStack spacing={4}>
                    <Heading size="md">Your Activity</Heading>
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text>Sessions Today</Text>
                        <Text fontWeight="bold">3</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Pages Viewed</Text>
                        <Text fontWeight="bold">24</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Time Spent</Text>
                        <Text fontWeight="bold">1h 42m</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* System Status */}
              <Card bg={cardBg}>
                <CardBody>
                  <VStack spacing={4}>
                    <Heading size="md">System Status</Heading>
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text>System Health</Text>
                        <Badge colorScheme="green">Operational</Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Response Time</Text>
                        <Text fontSize="sm">125ms</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>Uptime</Text>
                        <Text fontSize="sm">99.9%</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Recent Activity */}
              <Card bg={cardBg}>
                <CardBody>
                  <VStack spacing={4}>
                    <Heading size="md">Recent Activity</Heading>
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm">Login</Text>
                        <Text fontSize="xs" color="gray.500">2 hours ago</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Profile Updated</Text>
                        <Text fontSize="xs" color="gray.500">1 day ago</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm">Password Changed</Text>
                        <Text fontSize="xs" color="gray.500">3 days ago</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </RoleBasedRender>
        </VStack>
      </Container>
    </Box>
  );
};

export default Analytics;