import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Code,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface ErrorDetailsProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

const TechnicalError: React.FC<ErrorDetailsProps> = ({ error, errorInfo }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('red.200', 'red.600');

  // Mock error for demonstration
  const mockError = error || new Error('Example error message');
  const mockStack = errorInfo?.componentStack || `
    at Component (example.tsx:10:15)
    at div
    at App (App.tsx:20:10)
  `;

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6} align="stretch">
        <Box>
          <HStack spacing={3} mb={2}>
            <Heading size="xl" color="red.500">
              Technical Error
            </Heading>
            <Badge colorScheme="red" fontSize="md">
              Dev Only
            </Badge>
          </HStack>
          <Text color="gray.500">
            This page is only visible to developers and contains technical error details.
          </Text>
        </Box>

        <Box
          bg={bgColor}
          p={6}
          borderRadius="md"
          borderWidth="2px"
          borderColor={borderColor}
        >
          <VStack spacing={4} align="stretch">
            <Box>
              <Heading size="md" mb={2} color="red.500">
                Error Message
              </Heading>
              <Code
                p={4}
                borderRadius="md"
                width="full"
                display="block"
                colorScheme="red"
              >
                {mockError.message}
              </Code>
            </Box>

            <Divider />

            <Box>
              <Heading size="md" mb={2}>
                Stack Trace
              </Heading>
              <Code
                p={4}
                borderRadius="md"
                width="full"
                display="block"
                whiteSpace="pre-wrap"
                fontSize="sm"
              >
                {mockError.stack || mockStack}
              </Code>
            </Box>

            {errorInfo && (
              <>
                <Divider />
                <Box>
                  <Heading size="md" mb={2}>
                    Component Stack
                  </Heading>
                  <Code
                    p={4}
                    borderRadius="md"
                    width="full"
                    display="block"
                    whiteSpace="pre-wrap"
                    fontSize="sm"
                  >
                    {errorInfo.componentStack}
                  </Code>
                </Box>
              </>
            )}

            <Divider />

            <Box>
              <Heading size="md" mb={2}>
                Environment Info
              </Heading>
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Text fontWeight="bold">User Agent:</Text>
                  <Text fontSize="sm" color="gray.500">
                    {navigator.userAgent}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">URL:</Text>
                  <Text fontSize="sm" color="gray.500">
                    {window.location.href}
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Timestamp:</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date().toISOString()}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Box>

        <HStack spacing={3}>
          <Button colorScheme="blue" onClick={() => navigate('/')}>
            Go to Home
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default TechnicalError;
