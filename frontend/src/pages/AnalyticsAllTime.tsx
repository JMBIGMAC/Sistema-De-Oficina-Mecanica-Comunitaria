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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Button,
  Select,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const AnalyticsAllTime: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const itemBg = useColorModeValue('gray.50', 'gray.700');
  const milestoneBg = useColorModeValue('gray.50', 'gray.700');
  const [timeRange, setTimeRange] = useState('all');

  const allTimeStats = [
    { label: 'Total Users', value: '12,547', change: '+145%', trend: 'increase', color: 'blue' },
    { label: 'Total Revenue', value: '$89,432', change: '+234%', trend: 'increase', color: 'green' },
    { label: 'Total Sessions', value: '456,789', change: '+189%', trend: 'increase', color: 'purple' },
    { label: 'Avg Session Duration', value: '8m 32s', change: '+45%', trend: 'increase', color: 'orange' },
    { label: 'Total Page Views', value: '1.2M', change: '+156%', trend: 'increase', color: 'teal' },
    { label: 'Bounce Rate', value: '32.4%', change: '-12%', trend: 'decrease', color: 'pink' },
  ];

  const yearlyStats = [
    { year: '2024', users: '5,234', revenue: '$34,567', sessions: '189,234' },
    { year: '2023', users: '4,123', revenue: '$28,901', sessions: '145,678' },
    { year: '2022', users: '2,890', revenue: '$18,764', sessions: '98,543' },
    { year: '2021', users: '1,567', revenue: '$8,200', sessions: '45,678' },
  ];

  const topPerformers = [
    { metric: 'Most Popular Page', value: '/home', visits: '234,567' },
    { metric: 'Highest Converting Page', value: '/signup', conversion: '12.3%' },
    { metric: 'Most Active User', value: 'user@example.com', sessions: '1,234' },
    { metric: 'Peak Traffic Hour', value: '3:00 PM - 4:00 PM', users: '890' },
  ];

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack justify="space-between" flexWrap="wrap" mb={4}>
              <Box>
                <Heading size="xl" mb={2}>
                  All Time Analytics
                </Heading>
                <Text color="gray.600">
                  Complete historical analytics data since launch
                </Text>
              </Box>
              <HStack>
                <Button as={RouterLink} to="/analytics" variant="outline" size="sm">
                  Back to Analytics
                </Button>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  width="200px"
                  size="sm"
                >
                  <option value="all">All Time</option>
                  <option value="year">This Year</option>
                  <option value="quarter">This Quarter</option>
                </Select>
              </HStack>
            </HStack>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
              Data updated: {new Date().toLocaleString()}
            </Badge>
          </Box>

          {/* Key Metrics */}
          <Box>
            <Heading size="md" mb={4}>
              Key Performance Indicators (All Time)
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {allTimeStats.map((stat, index) => (
                <Card key={index} bg={cardBg}>
                  <CardBody>
                    <Stat>
                      <StatLabel color="gray.600">{stat.label}</StatLabel>
                      <StatNumber fontSize="3xl" color={`${stat.color}.500`}>
                        {stat.value}
                      </StatNumber>
                      <StatHelpText>
                        <StatArrow type={stat.trend as 'increase' | 'decrease'} />
                        {stat.change} since launch
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Yearly Breakdown */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>
                Year-over-Year Growth
              </Heading>
              <VStack spacing={4} align="stretch">
                {yearlyStats.map((year, index) => (
                  <Box key={index}>
                    <HStack justify="space-between" mb={2}>
                      <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                        {year.year}
                      </Badge>
                      <HStack spacing={8}>
                        <Box textAlign="right">
                          <Text fontSize="xs" color="gray.500">Users</Text>
                          <Text fontWeight="bold">{year.users}</Text>
                        </Box>
                        <Box textAlign="right">
                          <Text fontSize="xs" color="gray.500">Revenue</Text>
                          <Text fontWeight="bold" color="green.500">{year.revenue}</Text>
                        </Box>
                        <Box textAlign="right">
                          <Text fontSize="xs" color="gray.500">Sessions</Text>
                          <Text fontWeight="bold">{year.sessions}</Text>
                        </Box>
                      </HStack>
                    </HStack>
                    {index < yearlyStats.length - 1 && <Divider />}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Top Performers */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>
                All-Time Records
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {topPerformers.map((item, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={itemBg}
                    rounded="lg"
                  >
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color="gray.500" fontWeight="medium">
                        {item.metric}
                      </Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {item.value}
                      </Text>
                      {item.visits && (
                        <Badge colorScheme="purple">{item.visits} visits</Badge>
                      )}
                      {item.conversion && (
                        <Badge colorScheme="green">{item.conversion} conversion</Badge>
                      )}
                      {item.sessions && (
                        <Badge colorScheme="blue">{item.sessions} sessions</Badge>
                      )}
                      {item.users && (
                        <Badge colorScheme="orange">{item.users} concurrent users</Badge>
                      )}
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Milestones */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>
                Major Milestones
              </Heading>
              <VStack align="stretch" spacing={4}>
                {[
                  { date: 'Jan 2024', event: 'Reached 10,000 users', icon: '🎉' },
                  { date: 'Oct 2023', event: 'First $50,000 revenue month', icon: '💰' },
                  { date: 'Jul 2023', event: 'Launched mobile app', icon: '📱' },
                  { date: 'Mar 2023', event: 'Reached 5,000 users', icon: '🚀' },
                  { date: 'Dec 2022', event: '1 million page views', icon: '📈' },
                  { date: 'Jun 2022', event: 'Official launch', icon: '🎊' },
                ].map((milestone, index) => (
                  <HStack
                    key={index}
                    p={4}
                    bg={milestoneBg}
                    rounded="lg"
                    spacing={4}
                  >
                    <Text fontSize="2xl">{milestone.icon}</Text>
                    <Box>
                      <Text fontWeight="bold">{milestone.event}</Text>
                      <Text fontSize="sm" color="gray.500">{milestone.date}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Navigation Links */}
          <Box textAlign="center">
            <HStack justify="center" spacing={4} flexWrap="wrap">
              <Button as={RouterLink} to="/analytics/users" colorScheme="blue">
                User Analytics
              </Button>
              <Button as={RouterLink} to="/analytics/graphics" colorScheme="purple">
                Charts & Graphics
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

export default AnalyticsAllTime;
