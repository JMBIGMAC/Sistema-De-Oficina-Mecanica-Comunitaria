import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  Button,
  Input,
  Select,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const AnalyticsUsers: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const userStats = [
    { label: 'Total Users', value: '1,284', change: '+23%', trend: 'increase' },
    { label: 'Active Users', value: '892', change: '+18%', trend: 'increase' },
    { label: 'New Users (30d)', value: '142', change: '+8%', trend: 'increase' },
    { label: 'Avg Session Time', value: '8m 32s', change: '+2m', trend: 'increase' },
  ];

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', sessions: 142, lastActive: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Moderator', status: 'active', sessions: 98, lastActive: '1 day ago' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'active', sessions: 56, lastActive: '3 hours ago' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'active', sessions: 34, lastActive: '5 hours ago' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'inactive', sessions: 12, lastActive: '7 days ago' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'Moderator', status: 'active', sessions: 87, lastActive: '30 min ago' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'purple';
      case 'moderator': return 'blue';
      default: return 'green';
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Box>
                <Heading size="xl" mb={2}>
                  User Analytics
                </Heading>
                <Text color="gray.600">
                  Comprehensive user behavior and activity analysis
                </Text>
              </Box>
              <Button as={RouterLink} to="/analytics" variant="outline" size="sm">
                Back to Analytics
              </Button>
            </HStack>
          </Box>

          {/* User Statistics */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {userStats.map((stat, index) => (
              <Card key={index} bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>{stat.label}</StatLabel>
                    <StatNumber>{stat.value}</StatNumber>
                    <StatHelpText>
                      <StatArrow type={stat.trend as 'increase' | 'decrease'} />
                      {stat.change}
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* User Demographics */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Heading size="sm" mb={4}>User Distribution</Heading>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <HStack>
                      <Badge colorScheme="purple">Admin</Badge>
                      <Text fontSize="sm">5%</Text>
                    </HStack>
                    <Text fontWeight="bold">64</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <HStack>
                      <Badge colorScheme="blue">Moderator</Badge>
                      <Text fontSize="sm">15%</Text>
                    </HStack>
                    <Text fontWeight="bold">193</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <HStack>
                      <Badge colorScheme="green">User</Badge>
                      <Text fontSize="sm">80%</Text>
                    </HStack>
                    <Text fontWeight="bold">1,027</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Heading size="sm" mb={4}>Activity Status</Heading>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <HStack>
                      <Badge colorScheme="green">Active</Badge>
                      <Text fontSize="sm">Online now</Text>
                    </HStack>
                    <Text fontWeight="bold">234</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <HStack>
                      <Badge colorScheme="yellow">Recently Active</Badge>
                      <Text fontSize="sm">Last 24h</Text>
                    </HStack>
                    <Text fontWeight="bold">658</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <HStack>
                      <Badge colorScheme="gray">Inactive</Badge>
                      <Text fontSize="sm">&gt; 7 days</Text>
                    </HStack>
                    <Text fontWeight="bold">392</Text>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Heading size="sm" mb={4}>Growth Metrics</Heading>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">This Week</Text>
                    <HStack>
                      <Text fontWeight="bold" color="green.500">+45</Text>
                      <Badge colorScheme="green">+3.5%</Badge>
                    </HStack>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">This Month</Text>
                    <HStack>
                      <Text fontWeight="bold" color="green.500">+142</Text>
                      <Badge colorScheme="green">+11%</Badge>
                    </HStack>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">This Year</Text>
                    <HStack>
                      <Text fontWeight="bold" color="green.500">+734</Text>
                      <Badge colorScheme="green">+133%</Badge>
                    </HStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* User List */}
          <Card bg={cardBg}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" flexWrap="wrap">
                  <Heading size="md">User Directory</Heading>
                  <HStack>
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      maxW="300px"
                      size="sm"
                    />
                    <Select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      maxW="150px"
                      size="sm"
                    >
                      <option value="all">All Roles</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="user">User</option>
                    </Select>
                  </HStack>
                </HStack>

                <Box overflowX="auto">
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>User</Th>
                        <Th>Role</Th>
                        <Th>Status</Th>
                        <Th isNumeric>Sessions</Th>
                        <Th>Last Active</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredUsers.map((user) => (
                        <Tr key={user.id}>
                          <Td>
                            <HStack>
                              <Avatar size="sm" name={user.name} />
                              <Box>
                                <Text fontWeight="medium" fontSize="sm">{user.name}</Text>
                                <Text fontSize="xs" color="gray.500">{user.email}</Text>
                              </Box>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge colorScheme={getRoleBadgeColor(user.role)}>
                              {user.role}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={user.status === 'active' ? 'green' : 'gray'}>
                              {user.status}
                            </Badge>
                          </Td>
                          <Td isNumeric fontWeight="medium">{user.sessions}</Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">{user.lastActive}</Text>
                          </Td>
                          <Td>
                            <Button size="xs" variant="ghost">View</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Showing {filteredUsers.length} of {users.length} users
                </Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Navigation Links */}
          <Box textAlign="center">
            <HStack justify="center" spacing={4} flexWrap="wrap">
              <Button as={RouterLink} to="/analytics/graphics" colorScheme="purple">
                Charts & Graphics
              </Button>
              <Button as={RouterLink} to="/analytics/all-time" colorScheme="blue">
                All Time View
              </Button>
              <Button as={RouterLink} to="/analytics/trends" colorScheme="green">
                Trends Analysis
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AnalyticsUsers;
