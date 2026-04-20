import { useQuery } from "@tanstack/react-query";
import { type StaysQueryParams, staysService } from "../services/api";

export const useStays = (params: StaysQueryParams = {}) => {
  return useQuery({
    queryKey: ["stays", params],
    queryFn: () => staysService.getAll(params),
    staleTime: 5 * 60 * 1000,
    // v5 pattern for smooth pagination transitions
    placeholderData: (previousData) => previousData,
  });
};
