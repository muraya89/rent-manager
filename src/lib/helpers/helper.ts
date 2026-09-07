export function formatMoney(
  value: { toString(): string } | number | null | undefined,
) {
  return `KES ${Number(value?.toString() ?? 0).toLocaleString("en-KE")}`;
}

export function serializeData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }

      if (value?.constructor?.name === "Decimal") {
        return Number(value);
      }

      if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value.toISOString();
      }

      return value;
    }),
  );
}