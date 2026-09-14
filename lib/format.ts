export const brl = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
export function reference(date = new Date()) { return { month: date.getMonth() + 1, year: date.getFullYear() }; }
export function dateFor(year: number, month: number, day: number) { return new Date(year, month - 1, day, 12); }
