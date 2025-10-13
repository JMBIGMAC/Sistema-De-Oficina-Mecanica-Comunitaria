# Diagrama Entidade-Relacionamento (DER)
## Sistema de Oficina Mecânica Comunitária

### Visão Geral
Este documento descreve o modelo de dados do Sistema de Oficina Mecânica Comunitária, implementado seguindo os requisitos da Fase 1 do projeto.

---

## Entidades e Atributos

### 1. Cliente
**Descrição**: Representa os clientes/proprietários de veículos da oficina.

**Atributos**:
- `id` (PK) - Inteiro, auto-incremento, chave primária
- `nome` - VARCHAR(200), obrigatório - Nome completo do cliente
- `cpf_cnpj` - VARCHAR(18), único, obrigatório - CPF ou CNPJ do cliente
- `telefone` - VARCHAR(20), obrigatório - Telefone de contato
- `email` - VARCHAR(254), obrigatório - E-mail do cliente
- `endereco` - TEXT, obrigatório - Endereço completo
- `created_at` - DATETIME - Data/hora de criação do registro
- `updated_at` - DATETIME - Data/hora da última atualização

**Regras de Negócio**:
- CPF/CNPJ deve ser único no sistema
- Não é permitido excluir um cliente que possui veículos cadastrados
- Todos os campos são obrigatórios exceto timestamps

---

### 2. Veiculo
**Descrição**: Representa os veículos dos clientes cadastrados na oficina.

**Atributos**:
- `placa` (PK) - VARCHAR(10), chave primária - Placa do veículo
- `cliente` (FK) - Inteiro, chave estrangeira - Referência ao Cliente proprietário
- `marca` - VARCHAR(50), obrigatório - Marca do veículo
- `modelo` - VARCHAR(100), obrigatório - Modelo do veículo
- `ano` - INTEGER, obrigatório - Ano de fabricação/modelo
- `cor` - VARCHAR(30), obrigatório - Cor do veículo
- `quilometragem` - INTEGER, obrigatório - Quilometragem atual
- `chassi` - VARCHAR(17), único, obrigatório - Número do chassi (17 caracteres)
- `tipo_combustivel` - VARCHAR(10), obrigatório - Tipo de combustível
  - Opções: 'gasolina', 'alcool', 'flex', 'diesel', 'eletrico', 'hibrido'
- `created_at` - DATETIME - Data/hora de criação do registro
- `updated_at` - DATETIME - Data/hora da última atualização

**Regras de Negócio**:
- A placa deve ser única no sistema
- O chassi deve ser único e conter exatamente 17 caracteres
- Um veículo deve estar sempre associado a um cliente existente
- Ao tentar excluir um cliente, se ele possuir veículos, a operação será bloqueada
- Não é permitido excluir um veículo que possua ordens de serviço (a ser implementado)

---

### 3. Servico
**Descrição**: Catálogo de serviços oferecidos pela oficina.

**Atributos**:
- `id` (PK) - Inteiro, auto-incremento, chave primária
- `descricao` - VARCHAR(200), obrigatório - Descrição do serviço
- `preco_padrao` - DECIMAL(10,2), obrigatório - Preço padrão sugerido (R$)
- `created_at` - DATETIME - Data/hora de criação do registro
- `updated_at` - DATETIME - Data/hora da última atualização

**Regras de Negócio**:
- A descrição deve ser única e não vazia
- O preço padrão deve ser maior que zero
- Não é permitido excluir um serviço que esteja em uso em ordens de serviço (a ser implementado)

---

## Relacionamentos

### Cliente ↔ Veiculo
**Nome do Relacionamento**: POSSUI
**Cardinalidade**: 1:N (Um para Muitos)

**Descrição**: Um Cliente POSSUI zero ou muitos Veículos. Cada Veículo pertence a exatamente um Cliente.

**Implementação**:
- Chave estrangeira `cliente` na tabela `Veiculo`
- Referência: `Veiculo.cliente` → `Cliente.id`
- Restrição: ON DELETE PROTECT (não permite deletar cliente com veículos)

**Diagrama**:
```
Cliente (1) ──────POSSUI──────▶ (N) Veiculo
  │id                              │placa
  │nome                            │cliente (FK) ───┘
  │cpf_cnpj                        │marca
  │telefone                        │modelo
  │email                           │ano
  │endereco                        │cor
                                   │quilometragem
                                   │chassi
                                   │tipo_combustivel
```

---

## Diagrama ER Completo

```
┌─────────────────────────────┐
│        Cliente              │
├─────────────────────────────┤
│ PK  id                      │
│     nome                    │
│ UK  cpf_cnpj                │
│     telefone                │
│     email                   │
│     endereco                │
│     created_at              │
│     updated_at              │
└─────────────┬───────────────┘
              │
              │ POSSUI (1:N)
              │
              ▼
┌─────────────────────────────┐
│        Veiculo              │
├─────────────────────────────┤
│ PK  placa                   │
│ FK  cliente ────────────────┤
│     marca                   │
│     modelo                  │
│     ano                     │
│     cor                     │
│     quilometragem           │
│ UK  chassi                  │
│     tipo_combustivel        │
│     created_at              │
│     updated_at              │
└─────────────────────────────┘


┌─────────────────────────────┐
│        Servico              │
├─────────────────────────────┤
│ PK  id                      │
│     descricao               │
│     preco_padrao            │
│     created_at              │
│     updated_at              │
└─────────────────────────────┘
```

**Legenda**:
- PK = Primary Key (Chave Primária)
- FK = Foreign Key (Chave Estrangeira)
- UK = Unique Key (Chave Única)

---

## Operações CRUD Implementadas

### Cliente
- ✅ **Inserir (CREATE)**: POST `/api/clientes/` - Cadastrar novo cliente
- ✅ **Consultar (READ)**: GET `/api/clientes/` - Listar todos os clientes
- ✅ **Consultar (READ)**: GET `/api/clientes/{id}/` - Obter detalhes de um cliente
- ✅ **Alterar (UPDATE)**: PUT `/api/clientes/{id}/` - Atualizar dados do cliente
- ✅ **Excluir (DELETE)**: DELETE `/api/clientes/{id}/` - Remover cliente (apenas se não tiver veículos)

**Filtros e Busca**:
- Busca por nome: `?search=nome`
- Busca por CPF/CNPJ: `?search=cpf`

### Veiculo
- ✅ **Inserir (CREATE)**: POST `/api/veiculos/` - Cadastrar novo veículo
- ✅ **Consultar (READ)**: GET `/api/veiculos/` - Listar todos os veículos
- ✅ **Consultar (READ)**: GET `/api/veiculos/{placa}/` - Obter detalhes de um veículo
- ✅ **Alterar (UPDATE)**: PUT `/api/veiculos/{placa}/` - Atualizar dados do veículo
- ✅ **Excluir (DELETE)**: DELETE `/api/veiculos/{placa}/` - Remover veículo

**Filtros e Busca**:
- Busca por placa: `?search=placa`
- Busca por modelo: `?search=modelo`
- Busca por marca: `?search=marca`
- Busca por proprietário: `?search=nome_cliente`
- Filtrar por cliente: `?cliente_id=123`

### Servico
- ✅ **Inserir (CREATE)**: POST `/api/servicos/` - Cadastrar novo serviço
- ✅ **Consultar (READ)**: GET `/api/servicos/` - Listar todos os serviços
- ✅ **Consultar (READ)**: GET `/api/servicos/{id}/` - Obter detalhes de um serviço
- ✅ **Alterar (UPDATE)**: PUT `/api/servicos/{id}/` - Atualizar dados do serviço
- ✅ **Excluir (DELETE)**: DELETE `/api/servicos/{id}/` - Remover serviço

**Filtros e Busca**:
- Busca por descrição: `?search=descricao`

---

## Validações Implementadas

### Cliente
- ✅ Nome: obrigatório, não vazio
- ✅ CPF/CNPJ: obrigatório, único, não vazio
- ✅ Telefone: obrigatório
- ✅ Email: obrigatório, formato válido
- ✅ Endereço: obrigatório

### Veiculo
- ✅ Placa: obrigatória, única, convertida para maiúsculas
- ✅ Cliente: obrigatório, deve existir no banco
- ✅ Marca: obrigatória
- ✅ Modelo: obrigatório
- ✅ Ano: obrigatório, inteiro
- ✅ Cor: obrigatória
- ✅ Quilometragem: obrigatória, inteiro positivo
- ✅ Chassi: obrigatório, único, exatamente 17 caracteres
- ✅ Tipo de combustível: obrigatório, deve ser uma das opções válidas

### Servico
- ✅ Descrição: obrigatória, não vazia
- ✅ Preço padrão: obrigatório, deve ser maior que zero

---

## Tecnologias Utilizadas

### Backend
- **Django 5.2.7** - Framework web
- **Django REST Framework 3.16.1** - API REST
- **SQLite** - Banco de dados (desenvolvimento)

### Modelo de Dados
- **ORM Django** - Mapeamento objeto-relacional
- **Migrations** - Controle de versão do schema do banco

---

## Próximas Fases

### Fase 2 - Desenvolvimento da Aplicação (Em Progresso)
- ✅ Backend API completo com CRUD
- ⏳ Frontend - Interfaces de gerenciamento
- ⏳ Validações de formulário no frontend
- ⏳ Tela de login e autenticação

### Fase 3 - Funcionalidades Avançadas (Futuro)
- ⏳ Ordens de Serviço (relacionamento com Veiculo e Servico)
- ⏳ Histórico de serviços por veículo
- ⏳ Relatórios e estatísticas
- ⏳ Sistema de agendamento

---

## Notas de Implementação

1. **Integridade Referencial**: Implementada através de foreign keys com restrições apropriadas
2. **Auditoria**: Todos os modelos possuem campos `created_at` e `updated_at`
3. **Performance**: Queries otimizadas com `select_related` para reduzir consultas ao banco
4. **Testes**: Suite completa de testes unitários e de integração
5. **API RESTful**: Segue padrões REST com respostas JSON padronizadas

---

**Última Atualização**: 2025-10-13
**Versão do Sistema**: 1.0.0
