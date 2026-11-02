export const RENT_DUE_DAYS = [
  ...Array.from({ length: 28 }, (_, index) => ({
    label: `${index + 1}${getOrdinalSuffix(index + 1)} of every month`,
    value: index + 1,
  })),
  {
    label: "Last day of every month",
    value: 0,
  },
];

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
