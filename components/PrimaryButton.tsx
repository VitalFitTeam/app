//Botón principal (naranja)
// components/auth/PrimaryButton.tsx

import { Colors } from '@/constants/theme';
import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
	title: string;
}

export function PrimaryButton({ title, ...props }: Props) {
	return (
		<TouchableOpacity
			className='h-12 w-full items-center justify-center rounded-md'
			style={{ backgroundColor: Colors.light.tint }} // Usamos el color Naranja Vital del tema
			{...props}>
			<Text className='text-white text-base font-bold'>{title}</Text>
		</TouchableOpacity>
	);
}
