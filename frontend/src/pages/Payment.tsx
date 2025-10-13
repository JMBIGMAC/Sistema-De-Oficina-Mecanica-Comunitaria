import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  SimpleGrid,
  Badge,
  Icon,
  useColorModeValue,
  useToast,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaLock, FaCheckCircle, FaWrench } from 'react-icons/fa';
import { workshopApi } from '../services/api';
import { Servico, Veiculo, Cliente } from '../types';

const Payment: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  const [servicos, setServicos] = useState<Servico[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    cliente_id: '',
    veiculo_placa: '',
    servico_id: '',
    descricao_problema: '',
    preco_final: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Load services
    const servicosResp = await workshopApi.getServicos();
    if (servicosResp.success && servicosResp.data) {
      setServicos(servicosResp.data);
    }

    // Load clients
    const clientesResp = await workshopApi.getClientes();
    if (clientesResp.success && clientesResp.data) {
      setClientes(clientesResp.data);
    }

    // Load vehicles
    const veiculosResp = await workshopApi.getVeiculos();
    if (veiculosResp.success && veiculosResp.data) {
      setVeiculos(veiculosResp.data);
    }

    setLoading(false);
  };

  const handleServicoChange = (servicoId: string) => {
    setFormData(prev => ({ ...prev, servico_id: servicoId }));
    
    // Auto-fill price from selected service
    const servico = servicos.find(s => s.id === parseInt(servicoId));
    if (servico) {
      const preco = typeof servico.preco_padrao === 'string' 
        ? servico.preco_padrao 
        : servico.preco_padrao.toString();
      setFormData(prev => ({ ...prev, preco_final: preco }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente_id || !formData.veiculo_placa || !formData.servico_id) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);
    
    const ordemData = {
      cliente: parseInt(formData.cliente_id),
      veiculo: formData.veiculo_placa,
      servico: parseInt(formData.servico_id),
      descricao_problema: formData.descricao_problema,
      preco_final: formData.preco_final ? parseFloat(formData.preco_final) : null,
    };

    const response = await workshopApi.createOrdemServico(ordemData);
    
    setIsProcessing(false);
    
    if (response.success) {
      toast({
        title: 'Ordem de Serviço Criada!',
        description: 'Sua solicitação foi registrada com sucesso. Em breve entraremos em contato.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Reset form
      setFormData({
        cliente_id: '',
        veiculo_placa: '',
        servico_id: '',
        descricao_problema: '',
        preco_final: '',
      });
    } else {
      toast({
        title: 'Erro ao criar ordem',
        description: response.error || 'Erro desconhecido',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const selectedServico = servicos.find(s => s.id === parseInt(formData.servico_id));
  const filteredVeiculos = formData.cliente_id 
    ? veiculos.filter(v => v.cliente === parseInt(formData.cliente_id))
    : veiculos;

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <HStack justify="center" mb={4}>
              <Icon as={FaWrench as any} boxSize={8} color="brand.500" />
              <Heading size="xl">Solicitar Serviço</Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Preencha o formulário para solicitar um serviço para seu veículo
            </Text>
          </Box>

          {loading ? (
            <Center py={20}>
              <Spinner size="xl" color="brand.500" />
            </Center>
          ) : (
            <>
              {/* Service Selection */}
              <Box>
                <Heading size="md" mb={6} textAlign="center">
                  Serviços Disponíveis
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {servicos.map((servico) => (
                    <Card
                      key={servico.id}
                      bg={cardBg}
                      borderWidth={formData.servico_id === servico.id.toString() ? 2 : 1}
                      borderColor={formData.servico_id === servico.id.toString() ? 'brand.500' : borderColor}
                      cursor="pointer"
                      onClick={() => handleServicoChange(servico.id.toString())}
                      _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                      transition="all 0.3s"
                    >
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Box textAlign="center">
                            <Text fontSize="lg" fontWeight="bold" color="brand.500">
                              {servico.descricao}
                            </Text>
                            <HStack justify="center" mt={2}>
                              <Text fontSize="2xl" fontWeight="bold">
                                R$ {parseFloat(String(servico.preco_padrao)).toFixed(2)}
                              </Text>
                            </HStack>
                          </Box>
                          {formData.servico_id === servico.id.toString() && (
                            <Badge colorScheme="brand" fontSize="sm" textAlign="center">
                              SELECIONADO
                            </Badge>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>

              {/* Order Form */}
              <Card bg={cardBg} maxW="800px" mx="auto" w="full">
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={6}>
                      <Heading size="md">Informações da Ordem de Serviço</Heading>
                      
                      <FormControl isRequired>
                        <FormLabel>Cliente</FormLabel>
                        <Select
                          placeholder="Selecione o cliente"
                          value={formData.cliente_id}
                          onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value, veiculo_placa: '' })}
                        >
                          {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                              {cliente.nome} - {cliente.cpf_cnpj}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Veículo</FormLabel>
                        <Select
                          placeholder="Selecione o veículo"
                          value={formData.veiculo_placa}
                          onChange={(e) => setFormData({ ...formData, veiculo_placa: e.target.value })}
                          isDisabled={!formData.cliente_id}
                        >
                          {filteredVeiculos.map((veiculo) => (
                            <option key={veiculo.placa} value={veiculo.placa}>
                              {veiculo.placa} - {veiculo.marca} {veiculo.modelo} ({veiculo.ano})
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Serviço</FormLabel>
                        <Select
                          placeholder="Selecione o serviço"
                          value={formData.servico_id}
                          onChange={(e) => handleServicoChange(e.target.value)}
                        >
                          {servicos.map((servico) => (
                            <option key={servico.id} value={servico.id}>
                              {servico.descricao} - R$ {parseFloat(String(servico.preco_padrao)).toFixed(2)}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Descrição do Problema</FormLabel>
                        <Textarea
                          placeholder="Descreva o problema ou necessidade do veículo..."
                          value={formData.descricao_problema}
                          onChange={(e) => setFormData({ ...formData, descricao_problema: e.target.value })}
                          rows={4}
                        />
                      </FormControl>

                      {selectedServico && (
                        <FormControl>
                          <FormLabel>Preço Final (R$)</FormLabel>
                          <NumberInput
                            value={formData.preco_final}
                            onChange={(value) => setFormData({ ...formData, preco_final: value })}
                            precision={2}
                            step={0.01}
                            min={0}
                          >
                            <NumberInputField placeholder="0.00" />
                          </NumberInput>
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            Preço padrão: R$ {parseFloat(String(selectedServico.preco_padrao)).toFixed(2)}
                          </Text>
                        </FormControl>
                      )}

                      <Button
                        type="submit"
                        colorScheme="brand"
                        size="lg"
                        width="full"
                        isLoading={isProcessing}
                        loadingText="Processando..."
                        leftIcon={<Icon as={FaCheckCircle as any} />}
                      >
                        Criar Ordem de Serviço
                      </Button>

                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Ao criar a ordem, você será notificado sobre o andamento do serviço.
                      </Text>
                    </VStack>
                  </form>
                </CardBody>
              </Card>

              {/* Security Info */}
              <Box textAlign="center" py={4}>
                <HStack justify="center" spacing={6} flexWrap="wrap">
                  <HStack>
                    <Icon as={FaLock as any} color="green.500" />
                    <Text fontSize="sm" color="gray.600">Sistema Seguro</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaCheckCircle as any} color="green.500" />
                    <Text fontSize="sm" color="gray.600">Serviço Garantido</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaWrench as any} color="green.500" />
                    <Text fontSize="sm" color="gray.600">Mecânicos Qualificados</Text>
                  </HStack>
                </HStack>
              </Box>
            </>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Payment;
