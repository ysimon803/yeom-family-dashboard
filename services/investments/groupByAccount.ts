import type { Investment } from "@/types/investment";

export function groupByAccount(
  investments: Investment[]
) {

  return investments.reduce(
    (groups, item) => {

      if (!groups[item.account]) {
        groups[item.account] = [];
      }

      groups[item.account].push(item);

      return groups;

    },
    {} as Record<string, Investment[]>
  );

}