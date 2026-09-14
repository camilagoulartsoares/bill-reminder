import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({ name: z.string().trim().min(1).max(100), amount: z.number().positive().max(10_000_000), dueDay: z.number().int().min(1).max(31), category: z.string().trim().min(1).max(60), recurring: z.boolean(), notes: z.string().trim().max(500).optional().nullable() });
export async function GET() { return NextResponse.json(await db.bill.findMany({ orderBy: [{ dueDay: "asc" }, { name: "asc" }] })); }
export async function POST(request: Request) { const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 }); const bill = await db.bill.create({ data: { ...parsed.data, amount: Math.round(parsed.data.amount * 100) } }); return NextResponse.json(bill, { status: 201 }); }
