import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Icon,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  useToast,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { workshopApi } from '../services/api';
import { OrdemServico, Cliente, Veiculo, Servico } from '../types';

const OrdensServicoManagement: React.FC = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrdem, setSelectedOrdem] = useState<OrdemServico | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [formData, setFormData] = useState({
    cliente_id: '',
    veiculo_placa: '',
    servico_id: '',
    descricao_problema: '',
    observacoes: '',
    preco_final: '',
    status: 'pendente' as OrdemServico['status'],
    status_pagamento: 'pendente' as OrdemServico['status_pagamento'],
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch ordens
    const ordensResp = await workshopApi.getOrdensServico(statusFilter || undefined);
    if (ordensResp.success && ordensResp.data) {
      setOrdens(ordensResp.data);
    }

    // Fetch clientes
    const clientesResp = await workshopApi.getClientes();
    if (clientesResp.success && clientesResp.data) {
      setClientes(clientesResp.data);
    }

    // Fetch veiculos
    const veiculosResp = await workshopApi.getVeiculos();
    if (veiculosResp.success && veiculosResp.data) {
      setVeiculos(veiculosResp.data);
    }

    // Fetch servicos
    const servicosResp = await workshopApi.getServicos();
    if (servicosResp.success && servicosResp.data) {
      setServicos(servicosResp.data);
    }

    setLoading(false);
  };

  const handleOpenCreate = () => {
    setSelectedOrdem(null);
    setFormData({
      cliente_id: '',
      veiculo_placa: '',
      servico_id: '',
      descricao_problema: '',
      observacoes: '',
      preco_final: '',
      status: 'pendente',
      status_pagamento: 'pendente',
    });
    onOpen();
  };

  const handleOpenEdit = (ordem: OrdemServico) => {
    setSelectedOrdem(ordem);
    setFormData({
      cliente_id: ordem.cliente.toString(),
      veiculo_placa: ordem.veiculo,
      servico_id: ordem.servico.toString(),
      descricao_problema: ordem.descricao_problema,
      observacoes: ordem.observacoes || '',
      preco_final: ordem.preco_final ? ordem.preco_final.toString() : '',
      status: ordem.status,
      status_pagamento: ordem.status_pagamento,
    });
    onOpen();
  };

  const handleOpenDelete = (ordem: OrdemServico) => {
    setSelectedOrdem(ordem);
    onDeleteOpen();
  };

  const handleSubmit = async () => {
    if (!formData.cliente_id || !formData.veiculo_placa || !formData.servico_id) {
      toast({
        title: 'Dados inválidos',
        description: 'Cliente, veículo e serviço são obrigatórios',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const data = {
      cliente: parseInt(formData.cliente_id),
      veiculo: formData.veiculo_placa,
      servico: parseInt(formData.servico_id),
      descricao_problema: formData.descricao_problema,
      observacoes: formData.observacoes,
      preco_final: formData.preco_final ? parseFloat(formData.preco_final) : null,
      status: formData.status,
      status_pagamento: formData.status_pagamento,
    };

    const response = selectedOrdem
      ? await workshopApi.updateOrdemServico(selectedOrdem.id, data)
      : await workshopApi.createOrdemServico(data);

    if (response.success) {
      toast({
        title: selectedOrdem ? 'Ordem atualizada' : 'Ordem criada',
        description: `Ordem de serviço ${selectedOrdem ? 'atualizada' : 'criada'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchData();
    } else {
      toast({
        title: 'Erro',
        description: response.error || 'Erro ao salvar ordem',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedOrdem) return;

    const response = await workshopApi.deleteOrdemServico(selectedOrdem.id);

    if (response.success) {
      toast({
        title: 'Ordem excluída',
        description: 'Ordem de serviço excluída com sucesso',
        status: 'success',
        duration: 3000,
      });
      onDeleteClose();
      fetchData();
    } else {
      toast({
        title: 'Erro',
        description: response.error || 'Erro ao excluir ordem',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getStatusBadge = (status: OrdemServico['status']) => {
    const statusColors = {
      pendente: 'yellow',
      aprovado: 'blue',
      em_andamento: 'purple',
      concluido: 'green',
      cancelado: 'red',
    };

    const statusLabels = {
      pendente: 'Pendente',
      aprovado: 'Aprovado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    };

    return (
      <Badge colorScheme={statusColors[status]}>
        {statusLabels[status]}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: OrdemServico['status_pagamento']) => {
    const statusColors = {
      pendente: 'orange',
      parcial: 'yellow',
      pago: 'green',
    };

    const statusLabels = {
      pendente: 'Pendente',
      parcial: 'Parcial',
      pago: 'Pago',
    };

    return (
      <Badge colorScheme={statusColors[status]}>
        {statusLabels[status]}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const filteredVeiculos = formData.cliente_id
    ? veiculos.filter(v => v.cliente === parseInt(formData.cliente_id))
    : veiculos;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>
            Ordens de Serviço
          </Heading>
          <Text color="gray.500">
            Gerencie as ordens de serviço da oficina
          </Text>
        </Box>

        {/* Filters and Actions */}
        <HStack spacing={4} flexWrap="wrap">
          <Select
            placeholder="Filtrar por status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            maxW="300px"
          >
            <option value="">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </Select>
          <Button
            leftIcon={<Icon as={FaPlus as any} />}
            colorScheme="brand"
            onClick={handleOpenCreate}
          >
            Nova Ordem
          </Button>
          <Button leftIcon={<Icon as={FaSearch as any} />} onClick={fetchData}>
            Atualizar
          </Button>
        </HStack>

        {/* Table */}
        {loading ? (
          <Center py={10}>
            <Spinner size="xl" />
          </Center>
        ) : ordens.length === 0 ? (
          <Center py={10}>
            <Text color="gray.500">Nenhuma ordem encontrada</Text>
          </Center>
        ) : (
          <Box overflowX="auto" bg={bgColor} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Cliente</Th>
                  <Th>Veículo</Th>
                  <Th>Serviço</Th>
                  <Th>Status</Th>
                  <Th>Pagamento</Th>
                  <Th isNumeric>Valor</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ordens.map((ordem) => (
                  <Tr key={ordem.id}>
                    <Td>#{ordem.id}</Td>
                    <Td>{ordem.cliente_nome || `Cliente ${ordem.cliente}`}</Td>
                    <Td>{ordem.veiculo_info || ordem.veiculo}</Td>
                    <Td>{ordem.servico_descricao || `Serviço ${ordem.servico}`}</Td>
                    <Td>{getStatusBadge(ordem.status)}</Td>
                    <Td>{getPaymentStatusBadge(ordem.status_pagamento)}</Td>
                    <Td isNumeric fontWeight="bold" color="green.600">
                      {ordem.preco_final ? formatCurrency(ordem.preco_final) : '-'}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit"
                          icon={<Icon as={FaEdit as any} />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleOpenEdit(ordem)}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<Icon as={FaTrash as any} />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleOpenDelete(ordem)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Create/Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedOrdem ? 'Editar Ordem' : 'Nova Ordem de Serviço'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    placeholder="Selecione o cliente"
                    value={formData.cliente_id}
                    onChange={(e) => {
                      setFormData({ ...formData, cliente_id: e.target.value, veiculo_placa: '' });
                    }}
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
                    onChange={(e) => {
                      const servicoId = e.target.value;
                      setFormData({ ...formData, servico_id: servicoId });
                      // Auto-fill price
                      const servico = servicos.find(s => s.id === parseInt(servicoId));
                      if (servico && !formData.preco_final) {
                        setFormData(prev => ({ ...prev, preco_final: String(servico.preco_padrao) }));
                      }
                    }}
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
                    placeholder="Descreva o problema relatado pelo cliente..."
                    value={formData.descricao_problema}
                    onChange={(e) => setFormData({ ...formData, descricao_problema: e.target.value })}
                    rows={3}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Observações</FormLabel>
                  <Textarea
                    placeholder="Observações internas sobre o serviço..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    rows={3}
                  />
                </FormControl>

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
                </FormControl>

                <FormControl>
                  <FormLabel>Status da Ordem</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as OrdemServico['status'] })}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Status de Pagamento</FormLabel>
                  <Select
                    value={formData.status_pagamento}
                    onChange={(e) => setFormData({ ...formData, status_pagamento: e.target.value as OrdemServico['status_pagamento'] })}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="parcial">Parcial</option>
                    <option value="pago">Pago</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                {selectedOrdem ? 'Atualizar' : 'Criar'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmar Exclusão</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Tem certeza que deseja excluir a ordem de serviço #{selectedOrdem?.id}?
                Esta ação não pode ser desfeita.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete}>
                Excluir
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default OrdensServicoManagement;
