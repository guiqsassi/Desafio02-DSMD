# 🚀 Desafio02-DSMD - Sistema de Pagamentos

Um sistema de microserviços para processamento de pagamentos usando Node.js, PostgreSQL e RabbitMQ.

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🏗️ Arquitetura

O projeto é composto pelos seguintes serviços:

- **Payment Service** - Serviço principal de pagamentos (Node.js + Express)
- **PostgreSQL** - Banco de dados
- **RabbitMQ** - Message broker para comunicação entre serviços
- **Notification Service** - Serviço de notificações

## 🚀 Como executar

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd Desafio02-DSMD
```

### 2. Suba os serviços
```bash
docker-compose up -d
```

### 3. ⚠️ **IMPORTANTE**: Execute as migrações do banco

Após subir os containers, você precisa executar as migrações do Prisma. Faça isso entrando no container do payment-service:

```bash
# Entre no container
docker exec -it payment-service sh

# Execute as migrações
npx prisma migrate deploy

# (Opcional) Gere o cliente Prisma se necessário
npx prisma generate

# Saia do container
exit
```

### 4. Verifique se está funcionando

- **Payment Service**: http://localhost:8080
- **RabbitMQ Management**: http://localhost:15672 (user: `user`, pass: `123`)
- **PostgreSQL**: localhost:5432 (user: `payments`, pass: `123`, db: `payments`)

## 📊 Comandos úteis

### Verificar status dos containers
```bash
docker-compose ps
```

### Ver logs do payment-service
```bash
docker-compose logs payment-service -f
```

### Executar comandos do Prisma
```bash
# Entre no container
docker exec -it payment-service sh

# Comandos disponíveis:
npx prisma migrate deploy    # Aplica migrações
npx prisma generate         # Gera o cliente
npx prisma studio          # Abre interface web do banco
npx prisma migrate dev      # Cria nova migração (apenas dev)
```

### Reiniciar apenas o payment-service
```bash
docker-compose restart payment-service
```

### Parar todos os serviços
```bash
docker-compose down
```

### Limpar volumes (⚠️ apaga dados do banco)
```bash
docker-compose down -v
```

## 🗄️ Banco de Dados

O schema do banco está definido em `payment-service/prisma/schema.prisma`:

```prisma
model Payment {
  id       Int    @id @default(autoincrement())
  username String
  status   Status
  amount   BigInt
}

enum Status {
  Pending
  Completed
  Blocked
}
```

## 🔧 Desenvolvimento

### Estrutura do projeto
```
├── docker-compose.yaml
├── payment-service/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── controller/
│   ├── model/
│   ├── routes/
│   └── services/
└── notification-service/
    ├── index.js
    └── services/
```

### Adicionando novas migrações

1. Modifique o arquivo `prisma/schema.prisma`
2. Entre no container: `docker exec -it payment-service sh`
3. Execute: `npx prisma migrate dev --name nome_da_migracao`

## 🐛 Troubleshooting

### Container payment-service não inicia
1. Verifique se o banco está saudável: `docker-compose ps`
2. Verifique os logs: `docker-compose logs payment-service`
3. Entre no container e execute as migrações manualmente

### Erro de conexão com o banco
- Certifique-se que o container `db` está rodando e saudável
- Verifique se as migrações foram aplicadas

### RabbitMQ não conecta
- Aguarde alguns segundos para o RabbitMQ inicializar completamente
- Verifique se está saudável: `docker-compose ps`

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

---

📝 **Nota**: Lembre-se sempre de executar as migrações após subir os containers pela primeira vez ou após mudanças no schema do banco!