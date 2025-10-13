import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  useColorModeValue,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FaWrench, FaCalendarAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { messagesApi } from '../services/api';

const ContactUs: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.message) {
      toast({
        title: 'Informações faltando',
        description: 'Por favor, preencha todos os campos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      
      // Call the messages API to send the message
      const response = await messagesApi.createMessage(formData.subject, formData.message);
      
      if (response.success) {
        toast({
          title: 'Mensagem enviada',
          description: 'Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        
        setFormData({ subject: '', message: '' });
      } else {
        toast({
          title: 'Erro ao enviar mensagem',
          description: response.error || 'Falha ao enviar mensagem',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message || 'Falha ao enviar mensagem',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }}>
      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        <Box textAlign="center">
          <Heading size={{ base: 'xl', md: '2xl' }} mb={4}>
            Entre em Contato
          </Heading>
          <Text color="gray.500" fontSize={{ base: 'md', md: 'lg' }}>
            Precisa de ajuda ou quer solicitar um serviço? Envie-nos uma mensagem!
          </Text>
        </Box>

        {/* Quick Actions */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card bg={cardBg} as={RouterLink} to="/home/payment" _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }} transition="all 0.3s">
            <CardBody textAlign="center">
              <Icon as={FaWrench as any} boxSize={10} color="brand.500" mb={3} />
              <Heading size="sm" mb={2}>Solicitar Serviço</Heading>
              <Text fontSize="sm" color="gray.600">
                Agende manutenção para seu veículo
              </Text>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody textAlign="center">
              <Icon as={FaPhone as any} boxSize={10} color="secondary.500" mb={3} />
              <Heading size="sm" mb={2}>Telefone</Heading>
              <Text fontSize="sm" color="gray.600">
                (11) 9999-9999
              </Text>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody textAlign="center">
              <Icon as={FaEnvelope as any} boxSize={10} color="accent.500" mb={3} />
              <Heading size="sm" mb={2}>Email</Heading>
              <Text fontSize="sm" color="gray.600">
                contato@oficina.com.br
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Divider />

        <Card bg={bgColor}>
          <CardBody p={{ base: 4, md: 6 }}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={{ base: 4, md: 6 }}>
                <Heading size="md" mb={2}>Envie uma Mensagem</Heading>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Seu Email</FormLabel>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    isReadOnly
                    bg={useColorModeValue('gray.100', 'gray.700')}
                    size={{ base: 'md', md: 'lg' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Assunto</FormLabel>
                  <Input
                    placeholder="Breve descrição do seu contato"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    size={{ base: 'md', md: 'lg' }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: 'sm', md: 'md' }}>Mensagem</FormLabel>
                  <Textarea
                    placeholder="Conte-nos mais sobre sua dúvida ou necessidade..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    fontSize={{ base: 'sm', md: 'md' }}
                    minHeight={{ base: '120px', md: '160px' }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size={{ base: 'md', md: 'lg' }}
                  width="full"
                  isLoading={loading}
                  mt={{ base: 2, md: 0 }}
                  minHeight={{ base: '48px', md: '56px' }}
                >
                  Enviar Mensagem
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        <Box bg={useColorModeValue('blue.50', 'blue.900')} p={{ base: 4, md: 6 }} borderRadius="md">
          <VStack spacing={2} align="start">
            <Heading size={{ base: 'xs', md: 'sm' }}>Outras formas de contato</Heading>
            <Text fontSize="sm">📧 Email: contato@oficina.com.br</Text>
            <Text fontSize="sm">📞 Telefone: (11) 9999-9999</Text>
            <Text fontSize="sm">🕒 Horário: Segunda a Sexta, 8h às 18h</Text>
            <Text fontSize="sm">Hours: Monday - Friday, 9:00 AM - 5:00 PM</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ContactUs;
