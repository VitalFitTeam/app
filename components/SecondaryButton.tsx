import { Text, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

interface Props extends TouchableOpacityProps {
	title: string;
	textStyle?: TextStyle;
	containerStyle?: ViewStyle;
}

export function SecondaryButton({ title, textStyle, containerStyle, ...props }: Props) {
	return (
		<TouchableOpacity
			className='h-12 w-full items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700'
			style={containerStyle}
			{...props}>
			<Text
				className='text-gray-700 dark:text-gray-200 text-base font-bold'
				style={textStyle}>
				{title}
			</Text>
		</TouchableOpacity>
	);
}
