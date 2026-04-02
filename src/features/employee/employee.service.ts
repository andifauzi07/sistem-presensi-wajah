import { supabase } from '@/lib/supabase';
import { Employee, EmployeeInsert, EmployeeUpdate } from '@/shared/types';

export const getEmployees = async () => {
	const { data, error } = await supabase.from('employee').select('*');

	if (error) throw error;
	return data;
};

export const createEmployee = async (payload: EmployeeInsert) => {
	const { data, error } = await supabase.from('employee').insert(payload).select().single();

	if (error) throw error;
	return data;
};

export const updateEmployee = async (payload: EmployeeUpdate) => {
	const { data, error } = await supabase.from('employee').update(payload).eq('id', payload.id).select().single();

	if (error) throw error;
	return data;
};

export const deleteEmployee = async (id: string) => {
	const { error } = await supabase.from('employee').delete().eq('id', id);

	if (error) throw error;
};
