import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const ProfileAll: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              All Profiles
            </Heading>
            <Text color="gray.600">
              Manage all user profiles in the system (Owner access required)
            </Text>
          </Box>
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              This page is under construction. Profile management features will be available soon.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default ProfileAll;
