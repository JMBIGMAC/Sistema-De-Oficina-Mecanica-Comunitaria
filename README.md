templateV2/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout.tsx   # Main layout with navigation
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── RoleBasedRender.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx     # Landing page
│   │   │   ├── Login.tsx    # Authentication
│   │   │   ├── SignUp.tsx   # User registration
│   │   │   └── Dashboard.tsx # Role-based dashboard
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useAuth.tsx  # Authentication logic
│   │   ├── utils/           # Utility functions
│   │   │   └── permissions.ts # Role-based permissions
│   │   ├── types/           # TypeScript definitions
│   │   │   └── index.ts     # Common types
│   │   └── theme/           # Chakra UI theme
│   │       └── index.ts     # Custom theme configuration
├── backend/                 # Django backend (basic structure)
│   ├── templatev2_backend/  # Django project
│   └── requirements.txt     # Python dependencies
└── README.md

# Sistema de Oficina Mecânica Comunitária

## Fase 1: Análise e Modelagem de Dados

### Requisitos Funcionais

#### Gestão de Clientes
- **Operações permitidas:** Inserir, Consultar/Listar, Alterar, Excluir.
- **Regras:** Não é permitido excluir um cliente que possua veículos cadastrados.
- **Campos obrigatórios:** nome, cpf_cnpj (único), telefone, email, endereço.

#### Gestão de Veículos
- **Informações necessárias:** placa (única), marca, modelo, ano, cor, quilometragem, chassi (único, 17 caracteres), tipo_combustivel, cliente (associação obrigatória).
- **Associação:** Cada veículo pertence a um cliente. Um cliente pode ter vários veículos.
- **Operações permitidas:** Inserir, Consultar/Listar, Alterar, Excluir.
- **Regras:** Não é permitido excluir um veículo que possua ordens de serviço (a ser implementado).

#### Catálogo de Serviços
- **Informações necessárias:** descrição (única), preco_padrao.
- **Operações permitidas:** Inserir, Consultar/Listar, Alterar, Excluir.
- **Regras:** Não é permitido excluir um serviço vinculado a ordens de serviço (a ser implementado).


### Diagrama Entidade-Relacionamento (DER)

```mermaid
erDiagram
    CLIENTE ||--o{ VEICULO : "possui"
    CLIENTE {
        id
        nome
        cpf_cnpj
        telefone
        email
        endereco
        created_at
        updated_at
    }
    VEICULO {
        placa
        cliente_id
        marca
        modelo
        ano
        cor
        quilometragem
        chassi
        tipo_combustivel
        created_at
        updated_at
    }
    SERVICO {
        id
        descricao
        preco_padrao
        created_at
        updated_at
    }
```

> Para visualizar o diagrama no GitHub, acesse o arquivo diretamente pelo navegador ou utilize extensões de visualização Mermaid.

**Cardinalidade:** Um cliente pode ter vários veículos; cada veículo pertence a um cliente.
**Chaves:** Cliente (id), Veículo (placa), Serviço (id).


## Fase 2: Desenvolvimento da Aplicação

### 1. Interface de Autenticação e Navegação
- Tela de Login simples (usuário/senha fixos no código).
- Tela Principal exibida após login, com menu para acesso às funcionalidades.

### 2. Telas de Gerenciamento (CRUD)
- **Clientes:** Inserir, Editar, Excluir, Listar/Consultar.
- **Veículos:** Inserir, Editar, Excluir, Listar/Consultar.
- **Serviços:** Inserir, Editar, Excluir, Listar/Consultar.

### 3. Validação de Dados
- Todos os campos obrigatórios validados.
- Formatos de dados (ex: email, CPF/CNPJ, chassi) verificados.
- Usuário notificado em caso de erro de preenchimento.


## Critérios de Entrega

- **Documentação:** Este README + DER em mermaid.
- **Aplicação Funcional:** Código-fonte com todas as telas e funcionalidades CRUD implementadas e operacionais.


## Tecnologias Utilizadas

- **Backend:** Django 5.2.7 + Django REST Framework + SQLite
- **Frontend:** React 18 + TypeScript + Chakra UI
- **Banco de Dados:** Modelagem via ORM Django, migrations versionadas


## Referências de Código

- **Modelos:** `backend/api/models.py`
- **CRUD API:** `backend/api/views.py`
- **Validações:** Implementadas nos modelos e serializers
- **Testes:** `backend/api/tests.py`
- **DER detalhado:** `DER_DOCUMENTATION.md`

---

Para exemplos de endpoints, regras de negócio ou detalhes de implementação, consulte os arquivos citados ou solicite detalhamento.
