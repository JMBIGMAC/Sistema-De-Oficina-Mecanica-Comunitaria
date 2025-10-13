import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  Input,
  VStack,
  HStack,
  useToast,
  Text,
  InputGroup,
  InputLeftElement,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { workshopApi } from '../services/api';
import { Veiculo, Cliente, TipoCombustivel } from '../types';

const VeiculosManagement: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    placa: '',
    cliente: '',
    marca: '',
    modelo: '',
    ano: '',
    cor: '',
    quilometragem: '',
    chassi: '',
    tipo_combustivel: 'flex' as TipoCombustivel,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    fetchVeiculos();
    fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVeiculos = async () => {
    setLoading(true);
    const response = await workshopApi.getVeiculos();
    if (response.success && response.data) {
      setVeiculos(response.data);
    } else {
      toast({
        title: 'Erro ao carregar veículos',
        description: response.error || 'Erro desconhecido',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  const fetchClientes = async () => {
    const response = await workshopApi.getClientes();
    if (response.success && response.data) {
      setClientes(response.data);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchVeiculos();
      return;
    }
    setLoading(true);
    const response = await workshopApi.getVeiculos(searchTerm);
    if (response.success && response.data) {
      setVeiculos(response.data);
    }
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setSelectedVeiculo(null);
    setFormData({
      placa: '',
      cliente: '',
      marca: '',
      modelo: '',
      ano: '',
      cor: '',
      quilometragem: '',
      chassi: '',
      tipo_combustivel: 'flex',
    });
    onOpen();
  };

  const handleOpenEdit = (veiculo: Veiculo) => {
    setSelectedVeiculo(veiculo);
    setFormData({
      placa: veiculo.placa,
      cliente: veiculo.cliente.toString(),
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: veiculo.ano.toString(),
      cor: veiculo.cor,
      quilometragem: veiculo.quilometragem.toString(),
      chassi: veiculo.chassi,
      tipo_combustivel: veiculo.tipo_combustivel,
    });
    onOpen();
  };

  const handleOpenDelete = (veiculo: Veiculo) => {
    setSelectedVeiculo(veiculo);
    onDeleteOpen();
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.placa.trim() || !formData.cliente || !formData.marca.trim() || 
        !formData.modelo.trim() || !formData.ano || !formData.chassi.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Todos os campos são obrigatórios',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const data = {
      ...formData,
      cliente: parseInt(formData.cliente),
      ano: parseInt(formData.ano),
      quilometragem: parseInt(formData.quilometragem || '0'),
    };

    const response = selectedVeiculo
      ? await workshopApi.updateVeiculo(selectedVeiculo.placa, data)
      : await workshopApi.createVeiculo(data);

    if (response.success) {
      toast({
        title: selectedVeiculo ? 'Veículo atualizado' : 'Veículo cadastrado',
        description: `Veículo ${selectedVeiculo ? 'atualizado' : 'cadastrado'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchVeiculos();
    } else {
      const errorMessage = typeof response.error === 'object' 
        ? Object.values(response.error).flat().join(', ')
        : response.error;
      toast({
        title: 'Erro',
        description: errorMessage || 'Erro ao salvar veículo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedVeiculo) return;

    const response = await workshopApi.deleteVeiculo(selectedVeiculo.placa);
    if (response.success) {
      toast({
        title: 'Veículo excluído',
        description: 'Veículo excluído com sucesso',
        status: 'success',
        duration: 3000,
      });
      onDeleteClose();
      fetchVeiculos();
    } else {
      toast({
        title: 'Erro ao excluir',
        description: response.error || 'Não foi possível excluir o veículo',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Gerenciamento de Veículos</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleOpenCreate}>
            Novo Veículo
          </Button>
        </HStack>

        <HStack>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por placa, modelo ou proprietário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </InputGroup>
          <Button onClick={handleSearch}>Buscar</Button>
          <Button onClick={() => { setSearchTerm(''); fetchVeiculos(); }}>Limpar</Button>
        </HStack>

        {loading ? (
          <Center py={10}>
            <Spinner size="xl" />
          </Center>
        ) : veiculos.length === 0 ? (
          <Center py={10}>
            <Text color="gray.500">Nenhum veículo encontrado</Text>
          </Center>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Placa</Th>
                  <Th>Marca/Modelo</Th>
                  <Th>Ano</Th>
                  <Th>Proprietário</Th>
                  <Th>Combustível</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {veiculos.map((veiculo) => (
                  <Tr key={veiculo.placa}>
                    <Td fontWeight="bold">{veiculo.placa}</Td>
                    <Td>{veiculo.marca} {veiculo.modelo}</Td>
                    <Td>{veiculo.ano}</Td>
                    <Td>{veiculo.cliente_nome}</Td>
                    <Td>{veiculo.tipo_combustivel}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Editar"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleOpenEdit(veiculo)}
                        />
                        <IconButton
                          aria-label="Excluir"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleOpenDelete(veiculo)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedVeiculo ? 'Editar Veículo' : 'Novo Veículo'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Placa</FormLabel>
                <Input
                  value={formData.placa}
                  onChange={(e) => setFormData({ ...formData, placa: e.target.value.toUpperCase() })}
                  placeholder="ABC1234"
                  isDisabled={!!selectedVeiculo}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Proprietário</FormLabel>
                <Select
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  placeholder="Selecione o proprietário"
                >
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <HStack width="100%">
                <FormControl isRequired>
                  <FormLabel>Marca</FormLabel>
                  <Input
                    value={formData.marca}
                    onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                    placeholder="Fiat, VW, GM..."
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Modelo</FormLabel>
                  <Input
                    value={formData.modelo}
                    onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                    placeholder="Uno, Gol, Onix..."
                  />
                </FormControl>
              </HStack>
              <HStack width="100%">
                <FormControl isRequired>
                  <FormLabel>Ano</FormLabel>
                  <Input
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
                    placeholder="2020"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Cor</FormLabel>
                  <Input
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    placeholder="Branco, Prata..."
                  />
                </FormControl>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Chassi (17 caracteres)</FormLabel>
                <Input
                  value={formData.chassi}
                  onChange={(e) => setFormData({ ...formData, chassi: e.target.value.toUpperCase() })}
                  placeholder="9BWZZZ377VT004251"
                  maxLength={17}
                />
              </FormControl>
              <HStack width="100%">
                <FormControl>
                  <FormLabel>Quilometragem</FormLabel>
                  <Input
                    type="number"
                    value={formData.quilometragem}
                    onChange={(e) => setFormData({ ...formData, quilometragem: e.target.value })}
                    placeholder="50000"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Combustível</FormLabel>
                  <Select
                    value={formData.tipo_combustivel}
                    onChange={(e) => setFormData({ ...formData, tipo_combustivel: e.target.value as TipoCombustivel })}
                  >
                    <option value="gasolina">Gasolina</option>
                    <option value="alcool">Álcool</option>
                    <option value="flex">Flex</option>
                    <option value="diesel">Diesel</option>
                    <option value="eletrico">Elétrico</option>
                    <option value="hibrido">Híbrido</option>
                  </Select>
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {selectedVeiculo ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Veículo
            </AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja excluir o veículo <strong>{selectedVeiculo?.placa}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default VeiculosManagement;
