import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
	title: string;
}

export function PrimaryButton({ title, style, ...props }: Props) {
	return (
		<TouchableOpacity
			className='h-12 w-full items-center justify-center rounded-full'
			style={[{ backgroundColor: '#f97316' }, style]}
			{...props}>
			<Text className='text-white text-base font-bold'>{title}</Text>
		</TouchableOpacity>
	);
}
