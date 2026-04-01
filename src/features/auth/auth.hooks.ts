import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSession, login, logout } from './auth.service';

export const useLogin = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['session'] });
		},
	});
};

export const useLogout = () => {
	const qc = useQueryClient();

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['session'] });
		},
	});
};

export const useSession = () => {
	return useQuery({
		queryKey: ['session'],
		queryFn: getSession,
	});
};
