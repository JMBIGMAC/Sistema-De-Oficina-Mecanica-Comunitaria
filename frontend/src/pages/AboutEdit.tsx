import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const AboutEdit: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={4}>
              Edit About Page
            </Heading>
            <Text color="gray.600">
              Edit the about/institutional page (Developer access required)
            </Text>
          </Box>
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              This page is under construction. About page editor will be available soon.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default AboutEdit;
