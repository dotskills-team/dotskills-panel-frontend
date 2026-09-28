import type { QueryClient } from "@tanstack/react-query";

export const FINANCIAL_ACCOUNT_ROOT_KEY = ["financial-accounts"] as const;

// refetchType: "all" মানে inactive query-ও এখনই refetch হবে,
// তাই refetchOnMount বা staleTime config যা-ই হোক, ফল একই
export function syncFinancialAccounts(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: FINANCIAL_ACCOUNT_ROOT_KEY,
    refetchType: "all",
  });
}