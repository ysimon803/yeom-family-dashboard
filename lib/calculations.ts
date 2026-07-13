import { house } from "@/data/house";

export function getHouseEquity() {
  return house.currentValue - house.mortgage;
}

export function getDownPaymentGoal() {
  return house.targetPrice * house.targetDownPaymentPercent / 100;
}

export function getHouseProgress() {
  const available =
    house.cashAvailable + getHouseEquity();

  return Math.min(
    (available / getDownPaymentGoal()) * 100,
    100
  );
}

export function getRemainingDownPayment() {
  return Math.max(
    getDownPaymentGoal() -
      (house.cashAvailable + getHouseEquity()),
    0
  );
}