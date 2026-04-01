import { supabase } from '@/lib/supabase';
import { Employee } from '@/shared/types';

export const getEmployees = async () => {
	const { data, error } = await supabase.from('employee').select('*');

	if (error) throw error;
	return data;
};

export const createEmployee = async (payload: Employee) => {
	const { data, error } = await supabase.from('employee').insert(payload).select().single();

	if (error) throw error;
	return data;
};

export const updateEmployee = async (id: string, payload: Partial<{ name: string; email: string }>) => {
	const { data, error } = await supabase.from('employee').update(payload).eq('id', id).select().single();

	if (error) throw error;
	return data;
};

export const deleteEmployee = async (id: string) => {
	const { error } = await supabase.from('employee').delete().eq('id', id);

	if (error) throw error;
};
