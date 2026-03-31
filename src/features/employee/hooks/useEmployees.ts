import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api';
import { toast } from 'sonner';
import { Employee } from '@/shared/types';

export const useEmployees = () => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ['employees'],
		queryFn: () => apiService.employees.getAll(),
	});

	const createMutation = useMutation({
		mutationFn: (data: Omit<Employee, 'id' | 'createdAt'>) => apiService.employees.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			toast.success('Karyawan berhasil dibuat');
		},
		onError: (error: any) => {
			toast.error(error.message || 'Gagal membuat karyawan');
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => apiService.employees.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			toast.success('Berhasil Menghapus Pegawai');
		},
		onError: (error: any) => {
			toast.error(error.message || 'Gagal Menghapus Pegawai');
		},
	});

	return {
		...query,
		create: createMutation,
		delete: deleteMutation,
	};
};
