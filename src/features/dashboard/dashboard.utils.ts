import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Employee, Attendance } from '@/shared/types';

export const generateAttendanceReport = (employees: Employee[], logs: any[], month: Date) => {
	const doc = new jsPDF();
	const monthName = format(month, 'MMMM yyyy');

	// Title
	doc.setFontSize(20);
	doc.text('Monthly Attendance Report', 14, 22);

	doc.setFontSize(12);
	doc.setTextColor(100);
	doc.text(`Period: ${monthName}`, 14, 30);
	doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 38);

	// Process data
	const tableData = employees.map((emp) => {
		const empLogs = logs.filter((log) => log.employeeId === emp.id && format(new Date(log.timestamp), 'MMMM yyyy') === monthName);

		return [emp.nama, emp.email, empLogs.filter((l) => l.type === 'check-in').length, empLogs.filter((l) => l.type === 'check-out').length, empLogs.length];
	});

	// Table
	autoTable(doc, {
		startY: 45,
		head: [['Employee Name', 'Email', 'Check-ins', 'Check-outs', 'Total Logs']],
		body: tableData,
		theme: 'striped',
		headStyles: { fillColor: [15, 23, 42] }, // slate-900
	});

	doc.save(`Attendance_Report_${format(month, 'yyyy_MM')}.pdf`);
};

export const getStatus = (item: Attendance): string => {
	if (item.check_in && item.check_out) return 'pulang';
	if (item.check_in && !item.check_out) return 'masuk';
	return 'alpa';
};
