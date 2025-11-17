import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
	title: string;
}

export function PrimaryButton({ title, ...props }: Props) {
	return (
		<TouchableOpacity
			className='h-14 w-full items-center justify-center rounded-md'
			style={{ backgroundColor: '#f97316' }}
			{...props}>
			<Text className='text-white text-base font-bold'>{title}</Text>
		</TouchableOpacity>
	);
}
