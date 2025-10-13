import React from 'react';
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
  Button,
  Badge,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const AnalyticsTrends: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const forecastBg = useColorModeValue('gray.50', 'gray.700');
  const predictionBg = useColorModeValue('blue.50', 'blue.900');
  const insightBg = useColorModeValue('gray.50', 'gray.700');
  const growthBg = useColorModeValue('green.50', 'green.900');
  const stableBg = useColorModeValue('orange.50', 'orange.900');

  const trends = [
    {
      title: 'User Growth',
      current: '1,284 users',
      change: '+23.6%',
      trend: 'up',
      description: 'Steady growth in user acquisition',
      forecast: 'Expected to reach 1,500 by next month',
      color: 'blue',
    },
    {
      title: 'Revenue Trend',
      current: '$45,230',
      change: '+34.2%',
      trend: 'up',
      description: 'Strong revenue performance',
      forecast: 'Projected $52,000 next month',
      color: 'green',
    },
    {
      title: 'Engagement Rate',
      current: '68.5%',
      change: '+8.3%',
      trend: 'up',
      description: 'Users are more engaged',
      forecast: 'Target: 75% by Q2',
      color: 'purple',
    },
    {
      title: 'Bounce Rate',
      current: '32.4%',
      change: '-5.2%',
      trend: 'down',
      description: 'Improved user retention',
      forecast: 'Target: Below 30% by Q2',
      color: 'orange',
    },
    {
      title: 'Average Session',
      current: '8m 32s',
      change: '+2m 15s',
      trend: 'up',
      description: 'Users spending more time',
      forecast: 'Target: 10 minutes by Q2',
      color: 'teal',
    },
    {
      title: 'Conversion Rate',
      current: '12.3%',
      change: '+3.1%',
      trend: 'up',
      description: 'Better conversion funnel',
      forecast: 'Target: 15% by Q2',
      color: 'pink',
    },
  ];

  const insights = [
    {
      title: 'Peak Usage Hours',
      insight: '2:00 PM - 5:00 PM shows highest activity',
      action: 'Consider scheduling updates during off-peak hours',
      priority: 'medium',
    },
    {
      title: 'User Retention',
      insight: '30-day retention rate improved to 78%',
      action: 'Focus on engaging new users in first week',
      priority: 'high',
    },
    {
      title: 'Feature Adoption',
      insight: 'Payment feature usage increased by 45%',
      action: 'Expand payment options and improve UX',
      priority: 'high',
    },
    {
      title: 'Mobile vs Desktop',
      insight: 'Mobile traffic growing 2x faster than desktop',
      action: 'Prioritize mobile optimization',
      priority: 'high',
    },
  ];

  const predictions = [
    { metric: 'Next Week', users: '+142', revenue: '+$3,450', engagement: '+2.1%' },
    { metric: 'Next Month', users: '+567', revenue: '+$12,890', engagement: '+8.5%' },
    { metric: 'Next Quarter', users: '+1,890', revenue: '+$45,670', engagement: '+18.2%' },
  ];

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Box>
                <Heading size="xl" mb={2}>
                  Trends Analysis
                </Heading>
                <Text color="gray.600">
                  Identify patterns and predict future performance
                </Text>
              </Box>
              <Button as={RouterLink} to="/analytics" variant="outline" size="sm">
                Back to Analytics
              </Button>
            </HStack>
          </Box>

          {/* Trend Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {trends.map((trend, index) => (
              <Card
                key={index}
                bg={cardBg}
                borderTop="4px solid"
                borderTopColor={`${trend.color}.500`}
              >
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Text fontWeight="medium" fontSize="sm" color="gray.600">
                        {trend.title}
                      </Text>
                      <Icon
                        as={trend.trend === 'up' ? (FaArrowUp as any) : (FaArrowDown as any)}
                        color={trend.trend === 'up' ? 'green.500' : 'red.500'}
                        boxSize={5}
                      />
                    </HStack>
                    
                    <Box>
                      <Text fontSize="2xl" fontWeight="bold" color={`${trend.color}.500`}>
                        {trend.current}
                      </Text>
                      <Badge
                        colorScheme={trend.trend === 'up' ? 'green' : 'red'}
                        fontSize="sm"
                        mt={1}
                      >
                        {trend.change}
                      </Badge>
                    </Box>

                    <Text fontSize="sm" color="gray.600">
                      {trend.description}
                    </Text>

                    <Box
                      bg={forecastBg}
                      p={3}
                      rounded="md"
                    >
                      <Text fontSize="xs" color="gray.500" fontWeight="medium">
                        FORECAST
                      </Text>
                      <Text fontSize="sm" mt={1}>
                        {trend.forecast}
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>

          {/* Predictions */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>
                Growth Predictions
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                {predictions.map((prediction, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={predictionBg}
                    rounded="lg"
                    borderLeft="4px solid"
                    borderLeftColor="blue.500"
                  >
                    <VStack align="start" spacing={3}>
                      <Badge colorScheme="blue" fontSize="sm">
                        {prediction.metric}
                      </Badge>
                      <VStack align="start" spacing={1} w="full">
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Users</Text>
                          <Text fontWeight="bold" color="green.500">
                            {prediction.users}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Revenue</Text>
                          <Text fontWeight="bold" color="green.500">
                            {prediction.revenue}
                          </Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm" color="gray.600">Engagement</Text>
                          <Text fontWeight="bold" color="green.500">
                            {prediction.engagement}
                          </Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Insights & Recommendations */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>
                Key Insights & Recommendations
              </Heading>
              <VStack spacing={4} align="stretch">
                {insights.map((insight, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={insightBg}
                    rounded="lg"
                    borderLeft="4px solid"
                    borderLeftColor={
                      insight.priority === 'high' ? 'red.500' :
                      insight.priority === 'medium' ? 'orange.500' : 'blue.500'
                    }
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">{insight.title}</Text>
                      <Badge
                        colorScheme={
                          insight.priority === 'high' ? 'red' :
                          insight.priority === 'medium' ? 'orange' : 'blue'
                        }
                      >
                        {insight.priority.toUpperCase()}
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      💡 {insight.insight}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      📋 <strong>Action:</strong> {insight.action}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Seasonal Trends */}
          <Card bg={cardBg}>
            <CardBody>
              <Heading size="md" mb={6}>
                Seasonal Patterns
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box
                  p={6}
                  bg={growthBg}
                  rounded="lg"
                  textAlign="center"
                >
                  <Text fontSize="4xl" mb={2}>📈</Text>
                  <Heading size="sm" mb={2}>Growth Season</Heading>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Q1 & Q4 show highest user acquisition
                  </Text>
                  <Badge colorScheme="green" fontSize="md">+45% Average Growth</Badge>
                </Box>
                <Box
                  p={6}
                  bg={stableBg}
                  rounded="lg"
                  textAlign="center"
                >
                  <Text fontSize="4xl" mb={2}>📊</Text>
                  <Heading size="sm" mb={2}>Stable Period</Heading>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Q2 & Q3 maintain consistent engagement
                  </Text>
                  <Badge colorScheme="orange" fontSize="md">+12% Average Growth</Badge>
                </Box>
              </SimpleGrid>
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
              <Button as={RouterLink} to="/analytics/all-time" colorScheme="green">
                All Time View
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AnalyticsTrends;
