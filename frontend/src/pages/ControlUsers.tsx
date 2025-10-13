import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const ControlUsers: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              User Monitoring
            </Heading>
            <Text color="gray.600">
              Monitor user activity and behavior (Developer access required)
            </Text>
          </Box>
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              This page is under construction. User monitoring tools will be available soon.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default ControlUsers;
