import { portfolio } from "@/data/portfolio";
import { house } from "@/data/house";

export function getNetWorth() {
  return portfolio.netWorth;
}

export function getRetirementTotal() {
  return portfolio.retirement.total;
}

export function getTIEquity() {
  return portfolio.ti.total;
}

export function getCash() {
  return portfolio.cash;
}

export function getHouseEquity() {
  return house.currentValue - house.mortgage;
}

export function getAssetAllocation() {
  return [
    {
      name: "Retirement",
      value: getRetirementTotal(),
    },
    {
      name: "TI Equity",
      value: getTIEquity(),
    },
    {
      name: "Cash",
      value: getCash(),
    },
    {
      name: "Home Equity",
      value: getHouseEquity(),
    },
  ];
}

export function getTIExposure() {
  return (getTIEquity() / getNetWorth()) * 100;
}