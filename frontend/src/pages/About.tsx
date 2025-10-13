import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FaCar, 
  FaWrench, 
  FaUsers, 
  FaShieldAlt, 
  FaClock, 
  FaHandshake 
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import RoleBasedRender from '../components/RoleBasedRender';
import { UserRole } from '../types';

const About: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const gradientBg = useColorModeValue(
    'linear(to-r, brand.500, secondary.500)',
    'linear(to-r, brand.600, secondary.600)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const features = [
    {
      icon: FaWrench,
      title: 'Serviços Especializados',
      description: 'Equipe qualificada de mecânicos prontos para cuidar do seu veículo com excelência.',
      color: 'brand.500',
    },
    {
      icon: FaUsers,
      title: 'Atendimento Comunitário',
      description: 'Oficina focada em servir a comunidade com preços justos e transparência total.',
      color: 'secondary.500',
    },
    {
      icon: FaShieldAlt,
      title: 'Garantia de Qualidade',
      description: 'Todos os serviços com garantia, usando peças originais ou de primeira linha.',
      color: 'success.500',
    },
    {
      icon: FaCar,
      title: 'Gestão de Veículos',
      description: 'Sistema completo para acompanhar o histórico e manutenção de seus veículos.',
      color: 'accent.500',
    },
    {
      icon: FaClock,
      title: 'Agendamento Fácil',
      description: 'Agende serviços online de forma rápida e prática, sem complicações.',
      color: 'warning.500',
    },
    {
      icon: FaHandshake,
      title: 'Confiança e Transparência',
      description: 'Orçamentos claros e detalhados antes de qualquer serviço ser realizado.',
      color: 'error.500',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={gradientBg}
        color="white"
        py={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading
              fontSize={{ base: '3xl', md: '5xl', lg: '6xl' }}
              fontWeight="bold"
              lineHeight="shorter"
            >
              Sistema de Oficina
              <br />
              Mecânica Comunitária
            </Heading>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              maxW="2xl"
              opacity={0.9}
            >
              Manutenção e reparos automotivos de qualidade para a comunidade.
              Atendimento profissional, preços justos e total transparência.
            </Text>

            <HStack spacing={4} flexWrap="wrap" justify="center">
              {!isAuthenticated ? (
                <>
                  <Button
                    as={RouterLink}
                    to="/signup"
                    size="lg"
                    bg="white"
                    color="brand.500"
                    _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                    _active={{ transform: 'translateY(0)' }}
                    boxShadow="lg"
                  >
                    Cadastre-se
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/login"
                    size="lg"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    Entrar
                  </Button>
                </>
              ) : (
                <Button
                  as={RouterLink}
                  to="/home"
                  size="lg"
                  bg="white"
                  color="brand.500"
                  _hover={{ bg: 'gray.100', transform: 'translateY(-2px)' }}
                  _active={{ transform: 'translateY(0)' }}
                  boxShadow="lg"
                >
                  Ir para o Sistema
                </Button>
              )}
            </HStack>

            {/* User Welcome */}
            <RoleBasedRender requireAuth>
              <Box
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                px={6}
                py={4}
                rounded="xl"
                border="1px solid"
                borderColor="whiteAlpha.300"
              >
                <Text fontSize="lg">
                  Bem-vindo(a), <strong>{user?.firstName}</strong>!
                </Text>
                <HStack spacing={2} justify="center" mt={2}>
                  <Badge 
                    colorScheme={user?.role === UserRole.ADMIN ? 'purple' : 
                                user?.role === UserRole.MODERATOR ? 'blue' : 'green'} 
                    variant="solid"
                  >
                    {user?.role === UserRole.ADMIN ? 'GERENTE' :
                     user?.role === UserRole.MODERATOR ? 'MECÂNICO' : 'CLIENTE'}
                  </Badge>
                </HStack>
              </Box>
            </RoleBasedRender>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={{ base: 16, md: 20 }}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading size="xl">
                Nossos Serviços
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Oficina comunitária completa com todos os recursos necessários para 
                manutenção automotiva profissional e gestão eficiente.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  shadow="lg"
                  _hover={{ 
                    transform: 'translateY(-4px)', 
                    shadow: 'xl' 
                  }}
                  transition="all 0.3s"
                >
                  <CardBody p={6}>
                    <VStack spacing={4} align="start">
                      <Flex
                        align="center"
                        justify="center"
                        w={12}
                        h={12}
                        bg={`${feature.color.split('.')[0]}.50`}
                        color={feature.color}
                        rounded="lg"
                      >
                        <Icon as={feature.icon as any} boxSize={6} />
                      </Flex>
                      <Heading size="md">
                        {feature.title}
                      </Heading>
                      <Text color={textColor}>
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Role-Based Feature Preview */}
      <RoleBasedRender requireAuth>
        <Box bg={useColorModeValue('gray.50', 'gray.900')} py={{ base: 16, md: 20 }}>
          <Container maxW="container.xl">
            <VStack spacing={8}>
              <Heading size="xl" textAlign="center">
                Your Available Features
              </Heading>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                <RoleBasedRender roles={[UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]}>
                  <Card bg={cardBg} shadow="md">
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaUsers as any} boxSize={8} color="brand.500" />
                        <Heading size="md">User Dashboard</Heading>
                        <Text textAlign="center" color={textColor}>
                          Access your personal dashboard and profile settings.
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </RoleBasedRender>

                <RoleBasedRender roles={[UserRole.MODERATOR, UserRole.ADMIN]}>
                  <Card bg={cardBg} shadow="md">
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaShieldAlt as any} boxSize={8} color="secondary.500" />
                        <Heading size="md">Moderation Tools</Heading>
                        <Text textAlign="center" color={textColor}>
                          Moderate content and manage community interactions.
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </RoleBasedRender>

                <RoleBasedRender roles={[UserRole.ADMIN]}>
                  <Card bg={cardBg} shadow="md">
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaCode as any} boxSize={8} color="accent.500" />
                        <Heading size="md">Admin Panel</Heading>
                        <Text textAlign="center" color={textColor}>
                          Full system administration and user management.
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </RoleBasedRender>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </RoleBasedRender>
    </Box>
  );
};

export default About;