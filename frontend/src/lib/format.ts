// src/lib/format.ts
const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

// Call like: inr(4999)
export const inr = (n: number) => inrFormatter.format(n);

// (optional alias if you like)  Call the same way: formatINR(4999)
export const formatINR = inr;
