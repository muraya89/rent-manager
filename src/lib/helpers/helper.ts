export function formatMoney(
  value: { toString(): string } | number | null | undefined,
) {
  return `KES ${Number(value?.toString() ?? 0).toLocaleString("en-KE")}`;
}
