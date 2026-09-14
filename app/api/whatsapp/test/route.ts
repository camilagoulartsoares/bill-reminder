import { sendWhatsApp } from "@/services/whatsapp";
import { NextResponse } from "next/server";
export async function POST() { try { await sendWhatsApp("✅ Bill Reminder conectado. Este é um teste pessoal de notificações."); return NextResponse.json({ ok: true }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao enviar" }, { status: 502 }); } }
