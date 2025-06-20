# 🚀 Configuração do Supabase para CRUD de Chaves de API

## 📋 Pré-requisitos

1. Conta no Supabase (https://supabase.com)
2. Projeto criado no Supabase
3. Node.js e npm instalados

## 🔧 Passo a Passo

### 1. **Instalar Dependências**
```bash
npm install @supabase/supabase-js
```

### 2. **Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. **Obter Credenciais do Supabase**

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings > API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. **Criar Tabela no Supabase**

1. No Dashboard do Supabase, vá em **SQL Editor**
2. Execute o script `supabase-schema.sql`
3. Ou execute manualmente:

```sql
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  key VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  usage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);
```

### 5. **Configurar Índices (Opcional)**

```sql
CREATE INDEX IF NOT EXISTS idx_api_keys_status ON api_keys(status);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_name ON api_keys(name);
```

### 6. **Configurar RLS (Row Level Security)**

Se você quiser controlar o acesso aos dados:

```sql
-- Habilitar RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Criar política (exemplo - ajuste conforme necessário)
CREATE POLICY "Allow full access to api_keys" ON api_keys
  FOR ALL USING (true);
```

### 7. **Testar a Conexão**

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse http://localhost:3000/dashboard
3. Verifique se os dados estão sendo carregados do Supabase

## 🔍 **Estrutura da Tabela**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `name` | VARCHAR(255) | Nome da chave |
| `key` | VARCHAR(255) | Chave de API (única) |
| `description` | TEXT | Descrição da chave |
| `permissions` | TEXT[] | Array de permissões |
| `status` | VARCHAR(20) | 'active' ou 'inactive' |
| `usage` | INTEGER | Número de requisições |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |
| `last_used` | TIMESTAMP | Último uso |

## 🛠️ **Funcionalidades Implementadas**

### ✅ **CRUD Completo**
- **Create**: `createApiKey()`
- **Read**: `fetchApiKeys()`
- **Update**: `updateApiKey()`
- **Delete**: `deleteApiKey()`

### ✅ **Funcionalidades Extras**
- **Toggle Status**: `toggleApiKeyStatus()`
- **Update Usage**: `updateApiKeyUsage()`
- **Geração Segura**: Chaves com prefixo 'sk-' + 32 caracteres

### ✅ **Tratamento de Erros**
- Loading states
- Error handling
- Notificações de sucesso/erro
- Retry mechanism

## 🔒 **Segurança**

### **Variáveis de Ambiente**
- Nunca commite o arquivo `.env.local`
- Use `.env.example` como template
- Configure no seu servidor de produção

### **RLS (Row Level Security)**
- Configure políticas de acesso adequadas
- Limite o acesso baseado em autenticação
- Use funções para validação

### **Validação de Dados**
- Chaves únicas no banco
- Validação de status
- Sanitização de inputs

## 🚀 **Deploy**

### **Vercel**
1. Configure as variáveis de ambiente no Vercel
2. Deploy automático com Git

### **Outros Serviços**
- Configure `NEXT_PUBLIC_SUPABASE_URL`
- Configure `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔧 **Troubleshooting**

### **Erro: "Missing Supabase environment variables"**
- Verifique se `.env.local` existe
- Confirme se as variáveis estão corretas
- Reinicie o servidor após alterações

### **Erro: "relation 'api_keys' does not exist"**
- Execute o script SQL no Supabase
- Verifique se a tabela foi criada

### **Erro de CORS**
- Configure CORS no Supabase se necessário
- Verifique as políticas de RLS

## 📚 **Recursos Adicionais**

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [API Reference](https://supabase.com/docs/reference/javascript)

## 🎯 **Próximos Passos**

1. **Autenticação**: Implementar login/registro
2. **Auditoria**: Log de todas as ações
3. **Rate Limiting**: Limites por chave
4. **Webhooks**: Notificações de eventos
5. **Analytics**: Gráficos de uso 