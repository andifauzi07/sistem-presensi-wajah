import { Attendance, Employee } from '../types';

const BASE_URL = import.meta.env.VITE_SUPABASE_URL + '/rest/v1';
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export const api = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
	const res = await fetch(`${BASE_URL}/${endpoint}`, {
		...options,
		headers: {
			apikey: API_KEY,
			Authorization: `Bearer ${API_KEY}`,
			'Content-Type': 'application/json',
			...options?.headers,
		},
	});

	if (!res.ok) {
		throw new Error('API Error');
	}

	return res.json();
};

export const apiService = {
	employees: {
		getAll: () => api<Employee[]>('employee'),
	},
};
