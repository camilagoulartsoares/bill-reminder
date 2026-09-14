import { brl, dateFor, reference } from "../lib/format";
export type ReminderBill = { id: string; name: string; amount: number; dueDay: number; paid: boolean };
export type ReminderKind = "before_due" | "due_today" | "overdue";
export function remindersToSend(bills: ReminderBill[], today = new Date(), settings = { beforeDays: 3, overdueDays: 1 }) {
  const { month, year } = reference(today); const target = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  const result: { type: ReminderKind; dueDay: number; bills: ReminderBill[]; message: string }[] = [];
  for (const type of ["before_due", "due_today", "overdue"] as ReminderKind[]) {
    const offset = type === "before_due" ? settings.beforeDays : type === "overdue" ? -settings.overdueDays : 0;
    const selected = bills.filter((b) => !b.paid && dateFor(year, month, b.dueDay).getTime() - offset * 86400000 === target.getTime());
    if (!selected.length) continue;
    const total = selected.reduce((sum, bill) => sum + bill.amount, 0); const days = type === "before_due" ? settings.beforeDays : settings.overdueDays;
    const heading = type === "before_due" ? `⏰ Você possui contas que vencem em ${days} dia(s).` : type === "due_today" ? "💰 Hoje é dia de pagar suas contas." : `⚠️ Você ainda possui contas pendentes que venceram há ${days} dia(s).`;
    result.push({ type, dueDay: selected[0].dueDay, bills: selected, message: [heading, "", ...selected.map((b) => `• ${b.name} — ${brl(b.amount)}`), "", `Total: ${brl(total)}`, "Não esqueça de realizar os pagamentos."].join("\n") });
  }
  return result;
}
