import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalize(str: string | null): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Euclidean Distance untuk matching descriptor wajah.
// Jika panjang array tidak sama atau ada nilai non-finite, kembalikan `Infinity`
// agar tidak pernah dianggap match.
export const euclideanDistance = (a: number[], b: number[]) => {
	if (a.length !== b.length) return Number.POSITIVE_INFINITY;

	let sumSquares = 0;
	for (let i = 0; i < a.length; i++) {
		const diff = a[i] - b[i];
		if (!Number.isFinite(diff)) return Number.POSITIVE_INFINITY;
		sumSquares += diff * diff;
	}

	return Math.sqrt(sumSquares);
};

export const toPgVector = (arr: number[]) => `[${arr.join(',')}]`;
export const fromPgVector = (value: any): number[] => {
	if (Array.isArray(value)) return value;

	return value
		.replace(/[\[\]]/g, '') // handle []
		.split(',')
		.map((v: string) => parseFloat(v));
};
