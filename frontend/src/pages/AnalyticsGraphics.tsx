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
  CardHeader,
  Button,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const AnalyticsGraphics: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const chartData = [
    { label: 'Jan', value: 65, color: 'blue' },
    { label: 'Feb', value: 78, color: 'blue' },
    { label: 'Mar', value: 85, color: 'blue' },
    { label: 'Apr', value: 72, color: 'blue' },
    { label: 'May', value: 90, color: 'blue' },
    { label: 'Jun', value: 95, color: 'blue' },
  ];

  const deviceBreakdown = [
    { name: 'Desktop', percentage: 45, color: 'blue' },
    { name: 'Mobile', percentage: 38, color: 'green' },
    { name: 'Tablet', percentage: 12, color: 'purple' },
    { name: 'Other', percentage: 5, color: 'gray' },
  ];

  const trafficSources = [
    { source: 'Direct', visits: 12543, percentage: 42, color: 'blue' },
    { source: 'Organic Search', visits: 8932, percentage: 30, color: 'green' },
    { source: 'Social Media', visits: 5123, percentage: 17, color: 'purple' },
    { source: 'Referral', visits: 3201, percentage: 11, color: 'orange' },
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
                  Graphics & Charts
                </Heading>
                <Text color="gray.600">
                  Visual representation of analytics data
                </Text>
              </Box>
              <Button as={RouterLink} to="/analytics" variant="outline" size="sm">
                Back to Analytics
              </Button>
            </HStack>
          </Box>

          {/* Monthly Performance Chart */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Monthly Performance</Heading>
              <Text fontSize="sm" color="gray.500">User engagement over the last 6 months</Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {chartData.map((item, index) => (
                  <Box key={index}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium">{item.label}</Text>
                      <Text fontWeight="bold" color={`${item.color}.500`}>{item.value}%</Text>
                    </HStack>
                    <Progress
                      value={item.value}
                      colorScheme={item.color}
                      size="lg"
                      hasStripe
                      isAnimated
                    />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Device Breakdown */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Device Distribution</Heading>
              <Text fontSize="sm" color="gray.500">Traffic breakdown by device type</Text>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack align="stretch" spacing={4}>
                  {deviceBreakdown.map((device, index) => (
                    <Box key={index}>
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="medium">{device.name}</Text>
                        <Text fontWeight="bold" color={`${device.color}.500`}>{device.percentage}%</Text>
                      </HStack>
                      <Progress
                        value={device.percentage}
                        colorScheme={device.color}
                        size="md"
                      />
                    </Box>
                  ))}
                </VStack>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  minH="200px"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  rounded="lg"
                  p={6}
                >
                  <Text fontSize="6xl" mb={2}>📊</Text>
                  <Text fontSize="lg" fontWeight="bold" textAlign="center">
                    Device Analytics
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                    Most users access via desktop devices
                  </Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Traffic Sources */}
          <Card bg={cardBg}>
            <CardHeader>
              <Heading size="md">Traffic Sources</Heading>
              <Text fontSize="sm" color="gray.500">Where your visitors come from</Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {trafficSources.map((source, index) => (
                  <Box key={index}>
                    <HStack justify="space-between" mb={2}>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{source.source}</Text>
                        <Text fontSize="sm" color="gray.500">{source.visits.toLocaleString()} visits</Text>
                      </VStack>
                      <Text fontWeight="bold" fontSize="xl" color={`${source.color}.500`}>
                        {source.percentage}%
                      </Text>
                    </HStack>
                    <Progress
                      value={source.percentage}
                      colorScheme={source.color}
                      size="lg"
                      hasStripe
                    />
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Page Performance */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg}>
              <CardBody textAlign="center">
                <Text fontSize="4xl" mb={2}>📈</Text>
                <Heading size="md" mb={2}>Page Views</Heading>
                <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                  45,210
                </Text>
                <Progress value={85} colorScheme="blue" size="sm" mt={4} />
                <Text fontSize="sm" color="gray.500" mt={2}>
                  +12.5% from last month
                </Text>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody textAlign="center">
                <Text fontSize="4xl" mb={2}>⏱️</Text>
                <Heading size="md" mb={2}>Avg Session</Heading>
                <Text fontSize="3xl" fontWeight="bold" color="green.500">
                  8m 32s
                </Text>
                <Progress value={72} colorScheme="green" size="sm" mt={4} />
                <Text fontSize="sm" color="gray.500" mt={2}>
                  +1m 15s from last month
                </Text>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody textAlign="center">
                <Text fontSize="4xl" mb={2}>🎯</Text>
                <Heading size="md" mb={2}>Bounce Rate</Heading>
                <Text fontSize="3xl" fontWeight="bold" color="orange.500">
                  32.4%
                </Text>
                <Progress value={32} colorScheme="orange" size="sm" mt={4} />
                <Text fontSize="sm" color="gray.500" mt={2}>
                  -5.2% from last month
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Navigation Links */}
          <Box textAlign="center">
            <HStack justify="center" spacing={4} flexWrap="wrap">
              <Button as={RouterLink} to="/analytics/users" colorScheme="blue">
                User Analytics
              </Button>
              <Button as={RouterLink} to="/analytics/all-time" colorScheme="purple">
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

export default AnalyticsGraphics;
