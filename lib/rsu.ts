import { rsuGrants } from "@/data/rsu";

export function getRSUTotalValue(currentPrice: number) {
  return rsuGrants.reduce(
    (sum, grant) => sum + grant.shares * currentPrice,
    0
  );
}

export function getNextVest() {
  return [...rsuGrants].sort(
    (a, b) =>
      new Date(a.vestDate).getTime() -
      new Date(b.vestDate).getTime()
  )[0];
}