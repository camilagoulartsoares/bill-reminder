import { db } from "@/lib/db";
import { reference } from "@/lib/format";

export async function billsForMonth(date = new Date()) {
  const { month, year } = reference(date);
  const bills = await db.bill.findMany({ where: { active: true }, include: { payments: { where: { referenceMonth: month, referenceYear: year } } }, orderBy: [{ dueDay: "asc" }, { name: "asc" }] });
  return bills.filter((bill) => bill.recurring || bill.createdAt.getMonth() + 1 === month && bill.createdAt.getFullYear() === year)
    .map((bill) => ({ ...bill, paid: bill.payments[0]?.paid ?? false, paidAt: bill.payments[0]?.paidAt ?? null }));
}

export async function markPaid(id: string, paid: boolean, date = new Date()) {
  const { month, year } = reference(date);
  return db.billPayment.upsert({ where: { billId_referenceMonth_referenceYear: { billId: id, referenceMonth: month, referenceYear: year } }, create: { billId: id, referenceMonth: month, referenceYear: year, paid, paidAt: paid ? date : null }, update: { paid, paidAt: paid ? date : null } });
}
