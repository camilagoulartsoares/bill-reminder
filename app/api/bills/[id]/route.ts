import { db } from "@/lib/db";
import { markPaid } from "@/services/bills";
import { NextResponse } from "next/server";
import { z } from "zod";
const schema = z.object({ name: z.string().trim().min(1).max(100), amount: z.number().positive().max(10_000_000), dueDay: z.number().int().min(1).max(31), category: z.string().trim().min(1).max(60), recurring: z.boolean(), notes: z.string().trim().max(500).optional().nullable(), active: z.boolean().optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; const body = await request.json(); if (typeof body.paid === "boolean") return NextResponse.json(await markPaid(id, body.paid)); const parsed = schema.safeParse(body); if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 }); try { return NextResponse.json(await db.bill.update({ where: { id }, data: { ...parsed.data, amount: Math.round(parsed.data.amount * 100) } })); } catch { return NextResponse.json({ error: "Conta não encontrada" }, { status: 404 }); } }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; await db.bill.delete({ where: { id } }).catch(() => null); return new NextResponse(null, { status: 204 }); }
