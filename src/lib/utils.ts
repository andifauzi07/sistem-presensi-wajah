import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toPgVector = (arr: number[]) => `[${arr.join(',')}]`;
export const fromPgVector = (value: string) => value.slice(1, -1).split(',').filter(Boolean).map(Number);
