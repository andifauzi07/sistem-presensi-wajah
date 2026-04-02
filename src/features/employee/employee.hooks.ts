import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmployee, deleteEmployee, getEmployees } from './employee.service';
import { Employee, EmployeeInsert } from '@/shared/types';
import { toast } from 'sonner';

export const useEmployees = () => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ['employees'],
		queryFn: getEmployees,
	});

	const createMutation = useMutation({
		mutationFn: (data: Omit<EmployeeInsert, 'id' | 'created_at'>) => createEmployee(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			toast.success('Karyawan berhasil dibuat');
		},
		onError: (error: any) => {
			toast.error(error.message || 'Gagal membuat karyawan');
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteEmployee(id),
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
