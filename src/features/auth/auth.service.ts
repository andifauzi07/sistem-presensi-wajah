import { supabase } from '@/lib/supabase';

export const login = async (email: string, password: string) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) throw error;

	return data.session;
};

export const logout = async () => {
	const { error } = await supabase.auth.signOut();
};

export const getSession = async () => {
	const { data } = await supabase.auth.getSession();
	return data.session;
};
