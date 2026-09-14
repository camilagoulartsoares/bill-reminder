import { describe, expect, it } from "vitest";
import { remindersToSend } from "../services/reminders";
const date = new Date(2026, 8, 7, 12);
const pending = { id: "1", name: "Academia", amount: 8990, dueDay: 10, paid: false };
describe("regras de lembrete", () => {
  it("não envia para conta já paga", () => expect(remindersToSend([{ ...pending, paid: true }], date)).toEqual([]));
  it("envia aviso antes do vencimento configurado", () => expect(remindersToSend([pending], date)[0].type).toBe("before_due"));
  it("calcula o total da mensagem corretamente", () => expect(remindersToSend([pending, { ...pending, id: "2", name: "Faculdade", amount: 50000 }], date)[0].message).toContain("R$ 589,90"));
  it("encontra recorrente no mês seguinte pela mesma regra de competência", () => expect(remindersToSend([{ ...pending, dueDay: 10 }], new Date(2026, 9, 7, 12)).length).toBe(1));
  it("não inclui vencimentos fora da data de alerta", () => expect(remindersToSend([pending], new Date(2026, 8, 8, 12))).toEqual([]));
});
