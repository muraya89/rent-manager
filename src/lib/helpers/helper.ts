export function formatMoney(
  value: { toString(): string } | number | null | undefined,
) {
  return `KES ${Number(value?.toString() ?? 0).toLocaleString("en-KE")}`;
}

export function serializeData<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === "bigint") {
        return Number(value);
      }

      if (value?.constructor?.name === "Decimal") {
        return Number(value);
      }

      if (value instanceof Date) {
        // Check if the date is valid before converting to ISO string
        const time = value.getTime();
        if (Number.isNaN(time) || !isFinite(time)) {
          console.log("Invalid date found for key:", key, "value:", value);
          return null;
        }
        try {
          return value.toISOString();
        } catch (error) {
          console.log("Error converting date to ISO for key:", key, "error:", error);
          return null;
        }
      }

      return value;
    }),
  );
}