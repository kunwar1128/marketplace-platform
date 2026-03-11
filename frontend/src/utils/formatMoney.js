export function formatMoney(priceCents, currency = "CAD") {
  const amount = (priceCents ?? 0) / 100;
  // Language sensitive number formating
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
