import { Skeleton } from './skeleton';
import { TableCell, TableRow } from './table';

type TableSkeletonProps = {
	rows?: number;
	columns?: number;
	showAvatar?: boolean;
};

export function TableSkeleton({ rows = 5, columns = 4, showAvatar = false }: TableSkeletonProps) {
	return (
		<>
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<TableRow key={rowIndex}>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<TableCell key={colIndex}>{showAvatar && colIndex === 0 ? <Skeleton className="h-10 w-10 rounded-full" /> : <Skeleton className="h-4 w-full" />}</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}
