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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Center,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { workshopApi } from '../services/api';
import { Servico } from '../types';

const ServicosManagement: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    descricao: '',
    preco_padrao: '0.00',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    setLoading(true);
    const response = await workshopApi.getServicos();
    if (response.success && response.data) {
      setServicos(response.data);
    } else {
      toast({
        title: 'Erro ao carregar serviços',
        description: response.error || 'Erro desconhecido',
        status: 'error',
        duration: 3000,
      });
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchServicos();
      return;
    }
    setLoading(true);
    const response = await workshopApi.getServicos(searchTerm);
    if (response.success && response.data) {
      setServicos(response.data);
    }
    setLoading(false);
  };

  const handleOpenCreate = () => {
    setSelectedServico(null);
    setFormData({
      descricao: '',
      preco_padrao: '0.00',
    });
    onOpen();
  };

  const handleOpenEdit = (servico: Servico) => {
    setSelectedServico(servico);
    setFormData({
      descricao: servico.descricao,
      preco_padrao: servico.preco_padrao.toString(),
    });
    onOpen();
  };

  const handleOpenDelete = (servico: Servico) => {
    setSelectedServico(servico);
    onDeleteOpen();
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.descricao.trim() || parseFloat(formData.preco_padrao) <= 0) {
      toast({
        title: 'Dados inválidos',
        description: 'Descrição é obrigatória e preço deve ser maior que zero',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    const data = {
      descricao: formData.descricao,
      preco_padrao: parseFloat(formData.preco_padrao),
    };

    const response = selectedServico
      ? await workshopApi.updateServico(selectedServico.id, data)
      : await workshopApi.createServico(data);

    if (response.success) {
      toast({
        title: selectedServico ? 'Serviço atualizado' : 'Serviço cadastrado',
        description: `Serviço ${selectedServico ? 'atualizado' : 'cadastrado'} com sucesso`,
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchServicos();
    } else {
      const errorMessage = typeof response.error === 'object' 
        ? Object.values(response.error).flat().join(', ')
        : response.error;
      toast({
        title: 'Erro',
        description: errorMessage || 'Erro ao salvar serviço',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedServico) return;

    const response = await workshopApi.deleteServico(selectedServico.id);
    if (response.success) {
      toast({
        title: 'Serviço excluído',
        description: 'Serviço excluído com sucesso',
        status: 'success',
        duration: 3000,
      });
      onDeleteClose();
      fetchServicos();
    } else {
      toast({
        title: 'Erro ao excluir',
        description: response.error || 'Não foi possível excluir o serviço',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Catálogo de Serviços</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleOpenCreate}>
            Novo Serviço
          </Button>
        </HStack>

        <HStack>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </InputGroup>
          <Button onClick={handleSearch}>Buscar</Button>
          <Button onClick={() => { setSearchTerm(''); fetchServicos(); }}>Limpar</Button>
        </HStack>

        {loading ? (
          <Center py={10}>
            <Spinner size="xl" />
          </Center>
        ) : servicos.length === 0 ? (
          <Center py={10}>
            <Text color="gray.500">Nenhum serviço encontrado</Text>
          </Center>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Descrição</Th>
                  <Th isNumeric>Preço Padrão</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {servicos.map((servico) => (
                  <Tr key={servico.id}>
                    <Td>{servico.descricao}</Td>
                    <Td isNumeric fontWeight="bold" color="green.600">
                      {formatCurrency(servico.preco_padrao)}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Editar"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleOpenEdit(servico)}
                        />
                        <IconButton
                          aria-label="Excluir"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleOpenDelete(servico)}
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
          <ModalHeader>{selectedServico ? 'Editar Serviço' : 'Novo Serviço'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Descrição do Serviço</FormLabel>
                <Input
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Troca de óleo, Alinhamento, Balanceamento..."
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Preço Padrão (R$)</FormLabel>
                <NumberInput
                  min={0}
                  precision={2}
                  step={10}
                  value={formData.preco_padrao}
                  onChange={(valueString) => setFormData({ ...formData, preco_padrao: valueString })}
                >
                  <NumberInputField placeholder="0.00" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {selectedServico ? 'Atualizar' : 'Cadastrar'}
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
              Excluir Serviço
            </AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja excluir o serviço <strong>{selectedServico?.descricao}</strong>?
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

export default ServicosManagement;
