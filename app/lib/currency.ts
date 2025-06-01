export function formatCurrency(amount: string) {
  amount = amount.replace(/[^0-9.-]+/g, ""); // Remove any non-numeric characters except for '.' and '-'

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parseInt(amount));
}
