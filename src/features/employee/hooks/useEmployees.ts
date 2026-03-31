import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/shared/services/api";
import { toast } from "sonner";
import { Employee } from "@/shared/types";

export const useEmployees = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['employees'],
    queryFn: () => apiService.employees.getAll()
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Employee, 'id' | 'createdAt'>) => apiService.employees.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create employee');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.employees.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete employee');
    }
  });

  return {
    ...query,
    create: createMutation,
    delete: deleteMutation
  };
};
