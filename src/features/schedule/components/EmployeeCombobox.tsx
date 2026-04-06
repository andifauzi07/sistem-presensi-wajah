import { Combobox, ComboboxInput, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem, ComboboxValue } from '@/components/ui/combobox';
import { Employee } from '@/shared/types';

type Props = {
	items?: Employee[];
	selectedEmployee: Employee | null;
	setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>;
};

export function EmployeeCombobox({ items = [], selectedEmployee, setSelectedEmployee }: Props) {
	return (
		<Combobox
			items={items}
			value={selectedEmployee?.nama ?? ''} // ✅ selalu controlled
			onValueChange={(v) => {
				const found = items.find((emp) => emp.id === v);
				setSelectedEmployee(found || null);
			}}>
			<ComboboxValue>{selectedEmployee?.nama ?? 'Pilih pegawai'}</ComboboxValue>
			<ComboboxInput
				placeholder="Pilih pegawai"
				// value={selectedEmployee?.nama ?? ''}
				showClear
			/>

			<ComboboxContent>
				<ComboboxEmpty>Pegawai tidak ditemukan.</ComboboxEmpty>

				<ComboboxList>
					{(item) => (
						<ComboboxItem
							key={item.id}
							value={item.id}>
							{item.nama}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}
