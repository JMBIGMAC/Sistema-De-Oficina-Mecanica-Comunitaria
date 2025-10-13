from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Cliente, Veiculo, Servico


class ClienteModelTest(TestCase):
    """Test Cliente model"""
    
    def setUp(self):
        self.cliente = Cliente.objects.create(
            nome="João Silva",
            cpf_cnpj="12345678901",
            telefone="11999999999",
            email="joao@example.com",
            endereco="Rua Teste, 123"
        )
    
    def test_cliente_creation(self):
        """Test cliente is created correctly"""
        self.assertEqual(self.cliente.nome, "João Silva")
        self.assertEqual(self.cliente.cpf_cnpj, "12345678901")
    
    def test_cliente_str(self):
        """Test cliente string representation"""
        self.assertEqual(str(self.cliente), "João Silva - 12345678901")


class VeiculoModelTest(TestCase):
    """Test Veiculo model"""
    
    def setUp(self):
        self.cliente = Cliente.objects.create(
            nome="Maria Santos",
            cpf_cnpj="98765432100",
            telefone="11888888888",
            email="maria@example.com",
            endereco="Av. Teste, 456"
        )
        self.veiculo = Veiculo.objects.create(
            placa="ABC1234",
            cliente=self.cliente,
            marca="Fiat",
            modelo="Uno",
            ano=2020,
            cor="Branco",
            quilometragem=50000,
            chassi="12345678901234567",
            tipo_combustivel="flex"
        )
    
    def test_veiculo_creation(self):
        """Test veiculo is created correctly"""
        self.assertEqual(self.veiculo.placa, "ABC1234")
        self.assertEqual(self.veiculo.marca, "Fiat")
        self.assertEqual(self.veiculo.cliente, self.cliente)
    
    def test_veiculo_str(self):
        """Test veiculo string representation"""
        self.assertEqual(str(self.veiculo), "ABC1234 - Fiat Uno")
    
    def test_veiculo_protect_cliente(self):
        """Test that deleting cliente with veiculo is protected"""
        with self.assertRaises(Exception):
            self.cliente.delete()


class ServicoModelTest(TestCase):
    """Test Servico model"""
    
    def setUp(self):
        self.servico = Servico.objects.create(
            descricao="Troca de óleo",
            preco_padrao=150.00
        )
    
    def test_servico_creation(self):
        """Test servico is created correctly"""
        self.assertEqual(self.servico.descricao, "Troca de óleo")
        self.assertEqual(self.servico.preco_padrao, 150.00)
    
    def test_servico_str(self):
        """Test servico string representation"""
        expected = f"Troca de óleo - R$ {self.servico.preco_padrao}"
        self.assertEqual(str(self.servico), expected)


class ClienteAPITest(TestCase):
    """Test Cliente API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.cliente_data = {
            'nome': 'Pedro Oliveira',
            'cpf_cnpj': '11122233344',
            'telefone': '11777777777',
            'email': 'pedro@example.com',
            'endereco': 'Rua Nova, 789'
        }
    
    def test_create_cliente(self):
        """Test creating a new cliente"""
        response = self.client.post('/api/clientes/', self.cliente_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Cliente.objects.count(), 1)
        self.assertEqual(Cliente.objects.get().nome, 'Pedro Oliveira')
    
    def test_list_clientes(self):
        """Test listing clientes"""
        Cliente.objects.create(**self.cliente_data)
        response = self.client.get('/api/clientes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['clientes']), 1)
    
    def test_update_cliente(self):
        """Test updating a cliente"""
        cliente = Cliente.objects.create(**self.cliente_data)
        updated_data = self.cliente_data.copy()
        updated_data['telefone'] = '11666666666'
        response = self.client.put(f'/api/clientes/{cliente.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cliente.refresh_from_db()
        self.assertEqual(cliente.telefone, '11666666666')
    
    def test_delete_cliente_without_veiculos(self):
        """Test deleting a cliente without veiculos"""
        cliente = Cliente.objects.create(**self.cliente_data)
        response = self.client.delete(f'/api/clientes/{cliente.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Cliente.objects.count(), 0)
    
    def test_delete_cliente_with_veiculos(self):
        """Test that deleting a cliente with veiculos fails"""
        cliente = Cliente.objects.create(**self.cliente_data)
        Veiculo.objects.create(
            placa="XYZ9876",
            cliente=cliente,
            marca="VW",
            modelo="Gol",
            ano=2019,
            cor="Prata",
            quilometragem=30000,
            chassi="98765432109876543",
            tipo_combustivel="flex"
        )
        response = self.client.delete(f'/api/clientes/{cliente.id}/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Cliente.objects.count(), 1)


class VeiculoAPITest(TestCase):
    """Test Veiculo API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.cliente = Cliente.objects.create(
            nome="Ana Costa",
            cpf_cnpj="55566677788",
            telefone="11555555555",
            email="ana@example.com",
            endereco="Rua Central, 321"
        )
        
        self.veiculo_data = {
            'placa': 'DEF5678',
            'cliente': self.cliente.id,
            'marca': 'Chevrolet',
            'modelo': 'Onix',
            'ano': 2021,
            'cor': 'Azul',
            'quilometragem': 15000,
            'chassi': '11223344556677889',
            'tipo_combustivel': 'flex'
        }
    
    def test_create_veiculo(self):
        """Test creating a new veiculo"""
        response = self.client.post('/api/veiculos/', self.veiculo_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Veiculo.objects.count(), 1)
    
    def test_list_veiculos(self):
        """Test listing veiculos"""
        Veiculo.objects.create(**{**self.veiculo_data, 'cliente': self.cliente})
        response = self.client.get('/api/veiculos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['veiculos']), 1)
    
    def test_filter_veiculos_by_cliente(self):
        """Test filtering veiculos by cliente"""
        Veiculo.objects.create(**{**self.veiculo_data, 'cliente': self.cliente})
        response = self.client.get(f'/api/veiculos/?cliente_id={self.cliente.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['veiculos']), 1)


class ServicoAPITest(TestCase):
    """Test Servico API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.servico_data = {
            'descricao': 'Alinhamento e Balanceamento',
            'preco_padrao': 120.00
        }
    
    def test_create_servico(self):
        """Test creating a new servico"""
        response = self.client.post('/api/servicos/', self.servico_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Servico.objects.count(), 1)
    
    def test_list_servicos(self):
        """Test listing servicos"""
        Servico.objects.create(**self.servico_data)
        response = self.client.get('/api/servicos/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['servicos']), 1)
    
    def test_update_servico(self):
        """Test updating a servico"""
        servico = Servico.objects.create(**self.servico_data)
        updated_data = self.servico_data.copy()
        updated_data['preco_padrao'] = 140.00
        response = self.client.put(f'/api/servicos/{servico.id}/', updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        servico.refresh_from_db()
        self.assertEqual(servico.preco_padrao, 140.00)
