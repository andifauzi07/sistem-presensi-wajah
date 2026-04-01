import { useQuery } from '@tanstack/react-query';
import { getEmployees } from './employee.service';

export const useEmployees = () => {
	return useQuery({
		queryKey: ['employees'],
		queryFn: getEmployees,
	});
};
