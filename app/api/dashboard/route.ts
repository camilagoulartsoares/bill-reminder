import { billsForMonth } from "@/services/bills";
import { NextResponse } from "next/server";
export async function GET() { const bills = await billsForMonth(); const total = bills.reduce((n, b) => n + b.amount, 0); const paid = bills.filter((b) => b.paid).reduce((n, b) => n + b.amount, 0); return NextResponse.json({ bills, totals: { total, paid, pending: total - paid } }); }
