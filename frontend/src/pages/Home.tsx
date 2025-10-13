import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Button,
  useColorModeValue,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { 
  FaUser, 
  FaCog, 
  FaHome,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaBell,
} from 'react-icons/fa';
import { Link as RouterLink, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RoleBasedRender from '../components/RoleBasedRender';
import { UserRole } from '../types';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const bgGradient = useColorModeValue(
    'linear(to-br, brand.50, secondary.50)',
    'linear(to-br, gray.900, gray.800)'
  );
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) return null;

  const sidebarItems = [
    {
      icon: FaHome,
      label: 'Dashboard',
      path: '/dashboard',
      roles: [UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN]
    },
    {
      icon: FaUser,
      label: 'Profile',
      path: '/profile',
    },
    {
      icon: FaCog,
      label: 'Settings',
      path: '/settings',
    },
  ];

  // Client/User Home Content
  const ClientHomeContent = () => (
    <VStack spacing={8} align="stretch">
      <Box
        bgGradient={bgGradient}
        p={8}
        rounded="2xl"
        textAlign="center"
      >
        <Heading size="2xl" mb={4}>
          Bem-vindo(a), {user.firstName}! 🚗
        </Heading>
        <Text fontSize="lg" mb={6}>
          Agende serviços para seus veículos na nossa oficina comunitária.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card bg={cardBg} as={RouterLink} to="/contactUs" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaBell as any} boxSize={12} color="orange.500" mb={4} />
            <Heading size="md" mb={2}>Solicitar Serviço</Heading>
            <Text fontSize="sm" color="gray.600">Entre em contato para agendar serviços</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/profile" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaUser as any} boxSize={12} color="secondary.500" mb={4} />
            <Heading size="md" mb={2}>Meu Perfil</Heading>
            <Text fontSize="sm" color="gray.600">Gerencie suas informações pessoais</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Informações da Conta</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box textAlign="center" p={4}>
              <Stat>
                <StatLabel>Status da Conta</StatLabel>
                <StatNumber>Ativo</StatNumber>
                <StatHelpText>
                  <Badge colorScheme="green">Em dia</Badge>
                </StatHelpText>
              </Stat>
            </Box>
            <Box textAlign="center" p={4}>
              <Stat>
                <StatLabel>Cliente desde</StatLabel>
                <StatNumber>{new Date(user.createdAt).getFullYear()}</StatNumber>
                <StatHelpText>
                  {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} dias
                </StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );

  // Owner/Moderator Home Content
  const OwnerHomeContent = () => (
    <VStack spacing={8} align="stretch">
      <Box
        bgGradient={bgGradient}
        p={8}
        rounded="2xl"
        textAlign="center"
      >
        <Heading size="2xl" mb={4}>
          Painel do Mecânico 🔧
        </Heading>
        <Text fontSize="lg" mb={6}>
          Bem-vindo(a), {user.firstName}! Gerencie clientes, veículos e serviços.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card bg={cardBg} as={RouterLink} to="/clientes" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaUsers as any} boxSize={12} color="blue.500" mb={4} />
            <Heading size="md" mb={2}>Clientes</Heading>
            <Text fontSize="sm" color="gray.600">Gerenciar cadastro de clientes</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/veiculos" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaHome as any} boxSize={12} color="purple.500" mb={4} />
            <Heading size="md" mb={2}>Veículos</Heading>
            <Text fontSize="sm" color="gray.600">Gerenciar veículos dos clientes</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/servicos" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaCog as any} boxSize={12} color="orange.500" mb={4} />
            <Heading size="md" mb={2}>Serviços</Heading>
            <Text fontSize="sm" color="gray.600">Catálogo de serviços</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Heading size="md" mb={4}>Visão Geral</Heading>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Text>Clientes Ativos</Text>
                <Badge colorScheme="green" fontSize="md">-</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text>Veículos Cadastrados</Text>
                <Badge colorScheme="blue" fontSize="md">-</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text>Serviços Disponíveis</Text>
                <Badge colorScheme="purple" fontSize="md">-</Badge>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Heading size="md" mb={4}>Ações Rápidas</Heading>
            <VStack spacing={3}>
              <Button as={RouterLink} to="/clientes" leftIcon={<Icon as={FaUsers as any} />} w="full" variant="outline">
                Novo Cliente
              </Button>
              <Button as={RouterLink} to="/veiculos" leftIcon={<Icon as={FaHome as any} />} w="full" variant="outline">
                Novo Veículo
              </Button>
              <Button as={RouterLink} to="/servicos" leftIcon={<Icon as={FaCog as any} />} w="full" variant="outline">
                Novo Serviço
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );

  // Admin/Developer Home Content
  const AdminHomeContent = () => (
    <VStack spacing={8} align="stretch">
      <Box
        bgGradient={bgGradient}
        p={8}
        rounded="2xl"
        textAlign="center"
      >
        <Heading size="2xl" mb={4}>
          Painel do Gerente 📊
        </Heading>
        <Text fontSize="lg" mb={6}>
          Bem-vindo(a), {user.firstName}! Monitore toda a operação da oficina.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card bg={cardBg} as={RouterLink} to="/analytics" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaChartLine as any} boxSize={12} color="purple.500" mb={4} />
            <Heading size="md" mb={2}>Análises</Heading>
            <Text fontSize="sm" color="gray.600">Monitorar performance do sistema</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/control/users" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaUsers as any} boxSize={12} color="blue.500" mb={4} />
            <Heading size="md" mb={2}>Usuários</Heading>
            <Text fontSize="sm" color="gray.600">Monitorar todos os usuários</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/usersProblems" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaShieldAlt as any} boxSize={12} color="orange.500" mb={4} />
            <Heading size="md" mb={2}>Problemas</Heading>
            <Text fontSize="sm" color="gray.600">Gerenciar tickets de suporte</Text>
          </CardBody>
        </Card>

        <Card bg={cardBg} as={RouterLink} to="/organization/roles" _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
          <CardBody textAlign="center">
            <Icon as={FaCog as any} boxSize={12} color="green.500" mb={4} />
            <Heading size="md" mb={2}>Configurações</Heading>
            <Text fontSize="sm" color="gray.600">Gerenciar permissões e roles</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>Total de Usuários</StatLabel>
              <StatNumber>-</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                Sistema ativo
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>Saúde do Sistema</StatLabel>
              <StatNumber color="green.500">98%</StatNumber>
              <StatHelpText>
                <Badge colorScheme="green">Excelente</Badge>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg}>
          <CardBody textAlign="center">
            <Stat>
              <StatLabel>Sessões Ativas</StatLabel>
              <StatNumber>-</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                Em tempo real
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card bg={cardBg}>
        <CardBody>
          <Heading size="md" mb={4}>Acesso Completo à Oficina</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Button as={RouterLink} to="/clientes" variant="outline" size="lg">
              Clientes
            </Button>
            <Button as={RouterLink} to="/veiculos" variant="outline" size="lg">
              Veículos
            </Button>
            <Button as={RouterLink} to="/servicos" variant="solid" colorScheme="purple" size="lg">
              Serviços
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );

  return (
    <Box minH="100vh" bg={bgGradient} py={8}>
      <Container maxW="container.xl">
        {/* Role-Specific Content */}
        <RoleBasedRender roles={[UserRole.ADMIN]}>
          <AdminHomeContent />
        </RoleBasedRender>

        <RoleBasedRender roles={[UserRole.MODERATOR]} fallback={null}>
          <OwnerHomeContent />
        </RoleBasedRender>

        <RoleBasedRender roles={[UserRole.USER]} fallback={null}>
          <ClientHomeContent />
        </RoleBasedRender>
      </Container>
    </Box>
  );
};

export default Home;