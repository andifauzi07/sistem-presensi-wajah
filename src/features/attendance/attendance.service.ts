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

// import { Attendance, type AttendanceSubmitResult, type Employee } from '@/shared/types';
// import { euclideanDistance, fromPgVector } from '@/lib/utils';

// const FACE_MATCH_THRESHOLD = 0.6;

// const getTodayDate = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// export const findBestEmployeeByDescriptor = (
// 	inputDescriptor: number[],
// 	employees: EmployeeForRecognition[]
// ): { employee: EmployeeForRecognition; distance: number } | null => {
// 	let best: { employee: EmployeeForRecognition; distance: number } | null = null;

// 	for (const employee of employees) {
// 		const storedDescriptor = fromPgVector(employee.descriptor);
// 		const distance = euclideanDistance(inputDescriptor, storedDescriptor);

// 		if (!best || distance < best.distance) {
// 			best = { employee, distance };
// 		}
// 	}

// 	if (!best) return null;
// 	if (best.distance >= FACE_MATCH_THRESHOLD) return null;

// 	return best;
// };

// export const getAttendanceByEmployeeAndDate = async (
// 	employeeId: string,
// 	date: string
// ): Promise<Attendance | null> => {
// 	const { data, error } = await supabase
// 		.from('attendance')
// 		.select('*')
// 		.eq('employee_id', employeeId)
// 		.eq('date', date)
// 		.maybeSingle();

// 	if (error) throw error;
// 	return (data ?? null) as Attendance | null;
// };

// export const createCheckIn = async (employeeId: string, date: string, nowIso: string) => {
// 	const { data, error } = await supabase
// 		.from('attendance')
// 		.insert({
// 			employee_id: employeeId,
// 			date,
// 			check_in: nowIso,
// 		})
// 		.select()
// 		.single();

// 	if (error) throw error;
// 	return data as Attendance;
// };

// export const updateCheckOut = async (attendanceId: string, nowIso: string) => {
// 	const { data, error } = await supabase
// 		.from('attendance')
// 		.update({
// 			check_out: nowIso,
// 		})
// 		.eq('id', attendanceId)
// 		.select()
// 		.single();

// 	if (error) throw error;
// 	return data as Attendance;
// };

// export const submitAttendanceByDescriptor = async (
// 	descriptor: number[],
// 	employeesOverride?: EmployeeForRecognition[]
// ): Promise<AttendanceSubmitResult> => {
// 	const employees = employeesOverride?.length ? employeesOverride : await getEmployeesForRecognition();

// 	const bestMatch = findBestEmployeeByDescriptor(descriptor, employees);
// 	if (!bestMatch) return { type: 'unknown' };

// 	const date = getTodayDate();
// 	const nowIso = new Date().toISOString();

// 	const existing = await getAttendanceByEmployeeAndDate(bestMatch.employee.id, date);
// 	if (!existing) {
// 		await createCheckIn(bestMatch.employee.id, date, nowIso);
// 		return { type: 'check-in', employee: bestMatch.employee };
// 	}

// 	// DB bisa menyimpan nilai kosong/null untuk check_out yang belum terisi.
// 	if (!existing.check_out) {
// 		await updateCheckOut(existing.id, nowIso);
// 		return { type: 'check-out', employee: bestMatch.employee };
// 	}

// 	return { type: 'already-completed', employee: bestMatch.employee };
// };
