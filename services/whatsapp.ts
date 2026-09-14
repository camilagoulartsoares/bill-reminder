function configured() { return process.env.WHATSAPP_ENABLED === "true" && Boolean(process.env.EVOLUTION_API_URL && process.env.EVOLUTION_API_KEY && process.env.EVOLUTION_INSTANCE_NAME && process.env.EVOLUTION_RECIPIENT); }
export async function sendWhatsApp(text: string) {
  if (!text.trim()) throw new Error("Mensagem vazia bloqueada.");
  if (!configured()) throw new Error("Envio pelo WhatsApp está desativado ou não configurado.");
  const url = process.env.EVOLUTION_API_URL!.replace(/\/$/, "");
  const instance = encodeURIComponent(process.env.EVOLUTION_INSTANCE_NAME!);
  const recipient = process.env.EVOLUTION_RECIPIENT!.trim();
  const number = recipient.endsWith("@g.us") ? recipient : recipient.replace(/\D/g, "");
  if (!recipient.endsWith("@g.us") && (number.length < 10 || number.length > 15)) throw new Error("EVOLUTION_RECIPIENT deve conter DDI e DDD, apenas números, ou o ID de grupo terminado em @g.us.");
  const response = await fetch(`${url}/message/sendText/${instance}`, { method: "POST", headers: { apikey: process.env.EVOLUTION_API_KEY!, "content-type": "application/json" }, body: JSON.stringify({ number, text, linkPreview: false }), signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`Evolution API respondeu ${response.status}.`);
  return response.json().catch(() => ({}));
}
export const whatsappConfigured = configured;
