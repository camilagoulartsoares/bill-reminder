import { db } from "@/lib/db";
import { reference } from "@/lib/format";
import { billsForMonth } from "@/services/bills";
import { remindersToSend } from "@/services/reminders";
import { sendWhatsApp } from "@/services/whatsapp";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const now = new Date(); const { month, year } = reference(now); const settings = { beforeDays: Number(process.env.REMINDER_BEFORE_DAYS ?? 3), overdueDays: Number(process.env.REMINDER_OVERDUE_DAYS ?? 1) };
  const reminders = remindersToSend(await billsForMonth(now), now, settings); let sent = 0;
  for (const reminder of reminders) {
    const existing = await db.notificationLog.findUnique({ where: { type_referenceMonth_referenceYear_dueDay: { type: reminder.type, referenceMonth: month, referenceYear: year, dueDay: reminder.dueDay } } });
    if (existing) continue;
    await sendWhatsApp(reminder.message);
    await db.notificationLog.create({ data: { type: reminder.type, referenceMonth: month, referenceYear: year, dueDay: reminder.dueDay, message: reminder.message } }); sent++;
  }
  return NextResponse.json({ sent, skipped: reminders.length - sent });
}
