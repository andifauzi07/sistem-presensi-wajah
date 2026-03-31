import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/shared/services/api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiService.dashboard.getStats(),
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};
