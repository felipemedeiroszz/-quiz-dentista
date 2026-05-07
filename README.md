# Quiz System

Um sistema completo de quiz com painel administrativo, construído com Next.js, TypeScript, Prisma e PostgreSQL.

## 🚀 Funcionalidades

### Para Usuários
- Quiz interativo com perguntas de escolha única e múltipla
- Barra de progresso
- Formulário opcional de dados (nome, email, WhatsApp)
- Resultados personalizados com score e estatísticas
- Interface responsiva e moderna

### Para Administradores
- Painel administrativo completo
- Login seguro com JWT
- Dashboard com estatísticas
- CRUD de perguntas e opções
- Visualização de respostas dos usuários
- Exportação de dados (CSV)
- Ativação/desativação de perguntas

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT com cookies HTTP-only
- **Validação**: Zod
- **UI**: Lucide React Icons, React Hot Toast

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando
- npm ou yarn

## 🚀 Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd quiz
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas credenciais:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/quiz_db"
   JWT_SECRET="sua-chave-secreta-super-forte"
   ADMIN_EMAIL="admin@quiz.com"
   ADMIN_PASSWORD="admin123"
   ```

4. **Configure o banco de dados**
   ```bash
   # Gere o Prisma Client
   npx prisma generate
   
   # Execute as migrações
   npx prisma migrate dev --name init
   
   # Popule o banco com dados iniciais
   npm run seed
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

6. **Acesse a aplicação**
   - Quiz: http://localhost:3000
   - Painel Admin: http://localhost:3000/admin

## 📁 Estrutura do Projeto

```
quiz/
├── app/                    # App Router do Next.js
│   ├── admin/              # Painel administrativo
│   ├── api/                # API Routes
│   ├── quiz/               # Página do quiz
│   └── layout.tsx          # Layout principal
├── components/             # Componentes React
│   ├── quiz/              # Componentes do quiz
│   └── ui/                # Componentes UI genéricos
├── lib/                   # Bibliotecas e utilitários
├── prisma/                # Schema e migrações
├── scripts/               # Scripts (seed, etc.)
└── public/               # Arquivos estáticos
```

##  API Endpoints

### Perguntas
- `GET /api/questions` - Listar perguntas ativas
- `POST /api/questions` - Criar nova pergunta
- `GET /api/questions/[id]` - Buscar pergunta específica
- `PUT /api/questions/[id]` - Atualizar pergunta
- `DELETE /api/questions/[id]` - Excluir pergunta

### Respostas
- `POST /api/responses` - Salvar resposta do usuário
- `GET /api/responses` - Listar respostas (admin)

### Autenticação
- `POST /api/admin/login` - Login do admin
- `POST /api/admin/logout` - Logout do admin

## 🎯 Como Usar

### Para Usuários
1. Acesse a página inicial
2. Clique em "Iniciar Quiz"
3. Responda às perguntas
4. Opcionalmente, preencha seus dados
5. Veja seus resultados

### Para Administradores
1. Acesse `/admin/login`
2. Faça login com as credenciais
3. No dashboard, visualize estatísticas
4. Gerencie perguntas na aba "Perguntas"
5. Visualize respostas na aba "Respostas"
6. Exporte dados quando necessário

## 🔧 Scripts Disponíveis

- `npm run dev` - Iniciar servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Iniciar servidor de produção
- `npm run lint` - Executar linting
- `npm run seed` - Popular banco com dados iniciais
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Executar migrações
- `npm run db:generate` - Gerar Prisma Client

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. Deploy automático

### Docker
```bash
# Build
docker build -t quiz-app .

# Run
docker run -p 3000:3000 --env-file .env.local quiz-app
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Melhorias Futuras

- [ ] Sistema de categorias para perguntas
- [ ] Timer para cada pergunta
- [ ] Sistema de ranking
- [ ] Integração com redes sociais
- [ ] Analytics avançado
- [ ] Modo dark/light
- [ ] Internacionalização (i18n)
- [ ] Testes automatizados
- [ ] Upload de imagens nas perguntas
- [ ] Sistema de comentários nas respostas

## 📝 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Se encontrar algum problema ou tiver sugestões, por favor abra uma issue no repositório.
