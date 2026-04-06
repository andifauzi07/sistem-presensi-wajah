import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllAttendance, getTodayAttendance } from './dashboard.service';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useDashboard = () => {
	const queryClient = useQueryClient();
	const query = useQuery({
		queryKey: ['dashboard'],
		queryFn: () => getTodayAttendance(),
	});

	useEffect(() => {
		const channel = supabase
			.channel('schema-db-changes')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'attendance' }, () => {
				queryClient.invalidateQueries({ queryKey: ['dashboard'] });
			})
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient]);

	return {
		...query,
	};
};

export const useReportAttendance = () => {
	const reportAttendance = useQuery({
		queryKey: ['report'],
		queryFn: () => getAllAttendance(),
	});
	return {
		...reportAttendance,
	};
};
