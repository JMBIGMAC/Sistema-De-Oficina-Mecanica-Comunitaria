import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.400, purple.500)',
    'linear(to-br, blue.600, purple.800)'
  );

  return (
    <Box
      minH="80vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient={bgGradient}
    >
      <Container maxW="container.md">
        <VStack spacing={8} textAlign="center" color="white">
          <Text fontSize="8rem">⚠️</Text>
          
          <VStack spacing={4}>
            <Heading size="4xl" fontWeight="black">
              404
            </Heading>
            <Heading size="xl">
              Página em Manutenção
            </Heading>
            <Text fontSize="lg" maxW="md">
              Desculpe, a página que você está procurando não existe ou está temporariamente indisponível.
            </Text>
          </VStack>

          <VStack spacing={3} width="full" maxW="sm">
            <Button
              size="lg"
              colorScheme="whiteAlpha"
              width="full"
              onClick={() => navigate('/')}
            >
              Voltar para Início
            </Button>
            <Button
              size="lg"
              variant="ghost"
              colorScheme="whiteAlpha"
              width="full"
              onClick={() => navigate(-1)}
            >
              Voltar para Página Anterior
            </Button>
          </VStack>

          <Box
            bg="whiteAlpha.200"
            p={6}
            borderRadius="md"
            width="full"
            maxW="md"
          >
            <Text fontSize="sm">
              Se você acredita que isso é um erro, entre em contato com nosso suporte através da página de contato.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default NotFound;
