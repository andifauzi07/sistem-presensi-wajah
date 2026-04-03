import { supabase } from '@/lib/supabase';
import { Employee } from '@/shared/types';

type EmployeeForRecognition = Pick<Employee, 'id' | 'nama' | 'descriptor' | 'email' | 'jabatan' | 'created_at'>;

export const submitAttendanceByDescriptor = async (faceDescriptor: number[]) => {
	const { data, error } = await supabase.functions.invoke('Create-Attendance', {
		body: {
			descriptor: faceDescriptor,
		},
	});

	if (error) throw error;
	return data;
};

export const getEmployeesForRecognition = async (): Promise<EmployeeForRecognition[]> => {
	const { data, error } = await supabase.from('employee').select('id, nama, descriptor, email, jabatan, created_at');
	if (error) throw error;
	return (data ?? []) as EmployeeForRecognition[];
};
