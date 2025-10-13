from rest_framework import serializers
from .models import Cliente, Veiculo, Servico, OrdemServico


class ClienteSerializer(serializers.ModelSerializer):
    """Serializer for Cliente model"""
    veiculos_count = serializers.SerializerMethodField()

    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'cpf_cnpj', 'telefone', 'email', 'endereco', 
                  'created_at', 'updated_at', 'veiculos_count']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_veiculos_count(self, obj):
        return obj.veiculos.count()

    def validate_cpf_cnpj(self, value):
        """Validate CPF/CNPJ is not empty and has valid format"""
        if not value or not value.strip():
            raise serializers.ValidationError("CPF/CNPJ é obrigatório")
        return value.strip()


class VeiculoSerializer(serializers.ModelSerializer):
    """Serializer for Veiculo model"""
    cliente_nome = serializers.CharField(source='cliente.nome', read_only=True)
    cliente_id = serializers.IntegerField(source='cliente.id', read_only=True)

    class Meta:
        model = Veiculo
        fields = ['placa', 'cliente', 'cliente_id', 'cliente_nome', 'marca', 'modelo', 
                  'ano', 'cor', 'quilometragem', 'chassi', 'tipo_combustivel', 
                  'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate_placa(self, value):
        """Validate placa is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Placa é obrigatória")
        return value.strip().upper()

    def validate_chassi(self, value):
        """Validate chassi format (17 characters)"""
        if not value or not value.strip():
            raise serializers.ValidationError("Chassi é obrigatório")
        value = value.strip().upper()
        if len(value) != 17:
            raise serializers.ValidationError("Chassi deve ter 17 caracteres")
        return value


class ServicoSerializer(serializers.ModelSerializer):
    """Serializer for Servico model"""
    
    class Meta:
        model = Servico
        fields = ['id', 'descricao', 'preco_padrao', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_descricao(self, value):
        """Validate descricao is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Descrição é obrigatória")
        return value.strip()

    def validate_preco_padrao(self, value):
        """Validate preco_padrao is positive"""
        if value <= 0:
            raise serializers.ValidationError("Preço deve ser maior que zero")
        return value


class OrdemServicoSerializer(serializers.ModelSerializer):
    """Serializer for OrdemServico model"""
    cliente_nome = serializers.CharField(source='cliente.nome', read_only=True)
    veiculo_info = serializers.SerializerMethodField()
    servico_descricao = serializers.CharField(source='servico.descricao', read_only=True)
    mecanico_nome = serializers.SerializerMethodField()
    
    class Meta:
        model = OrdemServico
        fields = [
            'id', 'cliente', 'cliente_nome', 'veiculo', 'veiculo_info', 
            'servico', 'servico_descricao', 'descricao_problema', 'observacoes',
            'preco_final', 'status', 'status_pagamento',
            'data_solicitacao', 'data_aprovacao', 'data_conclusao',
            'mecanico_responsavel', 'mecanico_nome',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'data_solicitacao', 'created_at', 'updated_at']
    
    def get_veiculo_info(self, obj):
        return f"{obj.veiculo.placa} - {obj.veiculo.marca} {obj.veiculo.modelo}"
    
    def get_mecanico_nome(self, obj):
        if obj.mecanico_responsavel:
            return f"{obj.mecanico_responsavel.first_name} {obj.mecanico_responsavel.last_name}"
        return None
    
    def validate(self, data):
        """Validate that cliente owns the veiculo"""
        if 'cliente' in data and 'veiculo' in data:
            if data['veiculo'].cliente != data['cliente']:
                raise serializers.ValidationError({
                    'veiculo': 'O veículo não pertence ao cliente selecionado'
                })
        return data

