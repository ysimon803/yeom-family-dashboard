import type { Investment } from "@/types/investment";

export function groupByCategory(
  investments: Investment[]
) {

  return investments.reduce(
    (groups, item) => {

      if (!groups[item.category]) {
        groups[item.category] = [];
      }

      groups[item.category].push(item);

      return groups;

    },
    {} as Record<string, Investment[]>
  );

}