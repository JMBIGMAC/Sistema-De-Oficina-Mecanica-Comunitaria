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
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon, ViewIcon } from '@chakra-ui/icons';
import { workshopApi } from '../services/api';
import { Cliente } from '../types';

const ClientesManagement: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    cpf_cnpj: '',
    telefone: '',
    email: '',
    endereco: '',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    const response = await workshopApi.getClientes();
    if (response.success && response.data) {
      setClientes(response.data);
    } else {
      toast({
        title: 'Erro ao carregar clientes',
        description: response.error || 'Erro desconhecido',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchClientes();
      return;
    }
    setLoading(true);
    const response = await workshopApi.getClientes(searchTerm);
    if (response.success && response.data) {
      setClientes(response.data);
    }
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setSelectedCliente(null);
    setFormData({
      nome: '',
      cpf_cnpj: '',
      telefone: '',
      email: '',
      endereco: '',
    });
    onOpen();
  };

  const handleOpenEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      nome: cliente.nome,
      cpf_cnpj: cliente.cpf_cnpj,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
    });
    onOpen();
  };

  const handleOpenView = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    onViewOpen();
  };

  const handleOpenDelete = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    onDeleteOpen();
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.nome.trim() || !formData.cpf_cnpj.trim() || !formData.telefone.trim() || !formData.email.trim() || !formData.endereco.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Todos os campos são obrigatórios',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const response = selectedCliente
      ? await workshopApi.updateCliente(selectedCliente.id, formData)
      : await workshopApi.createCliente(formData);

    if (response.success) {
      toast({
        title: selectedCliente ? 'Cliente atualizado' : 'Cliente cadastrado',
        description: `Cliente ${selectedCliente ? 'atualizado' : 'cadastrado'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchClientes();
    } else {
      const errorMessage = typeof response.error === 'object' 
        ? Object.values(response.error).flat().join(', ')
        : response.error;
      toast({
        title: 'Erro',
        description: errorMessage || 'Erro ao salvar cliente',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedCliente) return;

    const response = await workshopApi.deleteCliente(selectedCliente.id);
    if (response.success) {
      toast({
        title: 'Cliente excluído',
        description: 'Cliente excluído com sucesso',
        status: 'success',
        duration: 3000,
      });
      onDeleteClose();
      fetchClientes();
    } else {
      toast({
        title: 'Erro ao excluir',
        description: response.error || 'Não foi possível excluir o cliente',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Gerenciamento de Clientes</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleOpenCreate}>
            Novo Cliente
          </Button>
        </HStack>

        <HStack>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por nome ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </InputGroup>
          <Button onClick={handleSearch}>Buscar</Button>
          <Button onClick={() => { setSearchTerm(''); fetchClientes(); }}>Limpar</Button>
        </HStack>

        {loading ? (
          <Center py={10}>
            <Spinner size="xl" />
          </Center>
        ) : clientes.length === 0 ? (
          <Center py={10}>
            <Text color="gray.500">Nenhum cliente encontrado</Text>
          </Center>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>CPF/CNPJ</Th>
                  <Th>Telefone</Th>
                  <Th>Email</Th>
                  <Th>Veículos</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {clientes.map((cliente) => (
                  <Tr key={cliente.id}>
                    <Td>{cliente.nome}</Td>
                    <Td>{cliente.cpf_cnpj}</Td>
                    <Td>{cliente.telefone}</Td>
                    <Td>{cliente.email}</Td>
                    <Td>
                      <Badge colorScheme="blue">{cliente.veiculos_count || 0}</Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Ver"
                          icon={<ViewIcon />}
                          size="sm"
                          onClick={() => handleOpenView(cliente)}
                        />
                        <IconButton
                          aria-label="Editar"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleOpenEdit(cliente)}
                        />
                        <IconButton
                          aria-label="Excluir"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleOpenDelete(cliente)}
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
          <ModalHeader>{selectedCliente ? 'Editar Cliente' : 'Novo Cliente'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>CPF/CNPJ</FormLabel>
                <Input
                  value={formData.cpf_cnpj}
                  onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Telefone</FormLabel>
                <Input
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Endereço</FormLabel>
                <Input
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua, número, bairro, cidade"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {selectedCliente ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes do Cliente</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCliente && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Nome:</Text>
                  <Text>{selectedCliente.nome}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">CPF/CNPJ:</Text>
                  <Text>{selectedCliente.cpf_cnpj}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Telefone:</Text>
                  <Text>{selectedCliente.telefone}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{selectedCliente.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Endereço:</Text>
                  <Text>{selectedCliente.endereco}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Veículos Cadastrados:</Text>
                  <Badge colorScheme="blue" fontSize="md">{selectedCliente.veiculos_count || 0}</Badge>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onViewClose}>Fechar</Button>
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
              Excluir Cliente
            </AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja excluir o cliente <strong>{selectedCliente?.nome}</strong>?
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

export default ClientesManagement;
