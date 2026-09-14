# Bill Reminder

Aplicativo para cadastrar contas, controlar pagamentos por competência mensal e enviar alertas pessoais pelo WhatsApp. O cadastro da conta recorrente é permanente, enquanto o pagamento é registrado separadamente para cada mês.

## Stack e arquitetura

- Next.js + TypeScript para interface e API
- Prisma + SQLite para desenvolvimento
- `services/bills.ts` concentra competência mensal/pagamentos
- `services/reminders.ts` contém regras puras de alertas e composição de mensagem
- `services/whatsapp.ts` usa a Evolution API somente no servidor
- `POST /api/reminders/run` é o ponto de entrada diário do scheduler; `NotificationLog` impede duplicação

O projeto reutiliza a abordagem do Purchase Planner: Evolution API conectada ao WhatsApp Web. Nenhuma credencial vai para o navegador.

## Instalação

```bash
copy .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

Abra `http://localhost:3000`. Para checar regras: `npm test`. Para validação de produção: `npm run build`.

## WhatsApp (Evolution API)

Hospede a Evolution API separadamente, crie/conecte uma instância pelo QR Code no painel dela e complete no `.env`:

```env
EVOLUTION_API_URL=https://evolution.seu-dominio.com
EVOLUTION_API_KEY=sua_chave
EVOLUTION_INSTANCE_NAME=bill-reminder
EVOLUTION_RECIPIENT=5535999999999
CRON_SECRET=uma_chave_longa_e_aleatoria
WHATSAPP_ENABLED=true
```

O destinatário pode ser um número com DDI + DDD, somente dígitos, ou o ID de um grupo terminado em `@g.us`. Use o botão **Testar WhatsApp** na interface, ou:

```bash
curl -X POST http://localhost:3000/api/whatsapp/test
```

## Scheduler e alertas

Programe seu cron externo (Vercel Cron, Render Cron Job, GitHub Actions ou servidor) para executar diariamente, por exemplo às 09:00:

```bash
curl -X POST http://localhost:3000/api/reminders/run -H "Authorization: Bearer $CRON_SECRET"
```

Os dias são configuráveis por `REMINDER_BEFORE_DAYS` (3 por padrão) e `REMINDER_OVERDUE_DAYS` (1 por padrão). A rotina ignora pagamentos do mês, cria uma mensagem agrupada por dia de vencimento e só grava o histórico depois de a Evolution API confirmar o envio. A restrição única em `NotificationLog` evita o mesmo alerta duas vezes no mesmo dia/competência.

## Uso

Cadastre uma conta no formulário. Marque o círculo da lista quando pagar; no mês seguinte, uma conta recorrente volta automaticamente como pendente. A tela mostra totais e permite filtrar por pagas ou pendentes, além de editar e excluir cadastros.
