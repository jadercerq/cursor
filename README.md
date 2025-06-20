# Sistema de Gerenciamento de Chaves de API

Uma aplicação Next.js completa para gerenciamento de chaves de API com interface CRUD moderna e responsiva.

## 🚀 Funcionalidades

### ✅ CRUD Completo
- **Create**: Criar novas chaves de API com permissões personalizadas
- **Read**: Visualizar todas as chaves em uma tabela organizada
- **Update**: Editar chaves existentes
- **Delete**: Excluir chaves com confirmação

### 🔍 Recursos Avançados
- **Busca em tempo real** por nome, descrição ou chave
- **Filtros por status** (Ativo/Inativo)
- **Paginação** para melhor performance
- **Estatísticas** em tempo real
- **Sistema de permissões** granular
- **Geração automática** de chaves seguras
- **Copiar chave** para área de transferência
- **Toggle de status** com um clique
- **Notificações** elegantes
- **Design responsivo** para mobile

### 🎨 Interface Moderna
- Design com gradientes e sombras
- Animações suaves
- Cores diferenciadas por permissão
- Modal de confirmação para exclusão
- Estado vazio informativo

## 📁 Estrutura do Projeto

```
myfirstpromptapp/
├── src/
│   └── app/
│       ├── page.js                 # Página principal com botão do dashboard
│       ├── page.module.css         # Estilos da página principal
│       ├── dashboard/
│       │   ├── page.js            # Dashboard CRUD completo
│       │   └── dashboard.module.css # Estilos do dashboard
│       └── layout.js              # Layout da aplicação
├── public/
│   └── dashboard-icon.svg         # Ícone do dashboard
└── package.json
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 15.3.3** - Framework React
- **React 19** - Biblioteca de UI
- **CSS Modules** - Estilização modular
- **JavaScript ES6+** - Funcionalidades modernas

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento:**
```bash
npm run dev
   ```

3. **Acessar a aplicação:**
   - Página principal: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard

## 📋 Funcionalidades Detalhadas

### Dashboard Principal
- **Estatísticas**: Total de chaves, chaves ativas, total de requisições
- **Busca**: Filtro em tempo real por nome, descrição ou chave
- **Filtros**: Por status (Todos, Ativo, Inativo)
- **Tabela responsiva** com todas as informações

### Gerenciamento de Chaves
- **Nome e Descrição**: Identificação clara da chave
- **Chave API**: Geração automática com prefixo "sk-"
- **Permissões**: Leitura, Escrita, Exclusão, Administrador
- **Status**: Ativo/Inativo com toggle
- **Métricas**: Data de criação, último uso, número de requisições

### Segurança
- **Geração segura**: Chaves de 32 caracteres aleatórios
- **Confirmação**: Modal para exclusão com aviso
- **Mascaramento**: Chaves mostram apenas os primeiros 12 caracteres
- **Cópia segura**: Botão para copiar chave completa

### Experiência do Usuário
- **Notificações**: Feedback visual para ações
- **Animações**: Transições suaves
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Acessibilidade**: Tooltips e labels apropriados

## 🎯 Próximos Passos

Para tornar o sistema ainda mais robusto, considere implementar:

1. **Backend Integration**: Conectar com API real
2. **Autenticação**: Sistema de login/registro
3. **Auditoria**: Log de todas as ações
4. **Rate Limiting**: Limites de uso por chave
5. **Webhooks**: Notificações de eventos
6. **Export/Import**: Backup de chaves
7. **Analytics**: Gráficos de uso
8. **Multi-tenancy**: Suporte a múltiplos usuários

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout adaptado com filtros empilhados
- **Mobile**: Layout otimizado com ações em coluna

## 🔧 Personalização

### Cores e Temas
As cores podem ser facilmente personalizadas editando as variáveis CSS no arquivo `dashboard.module.css`.

### Permissões
O sistema de permissões é flexível e pode ser expandido adicionando novas permissões no array `permissions`.

### Validações
Adicione validações customizadas no formulário de criação/edição conforme necessário.

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.
