// components/auth/StyledTextInput.tsx

import { Colors } from '@/constants/theme';
import { forwardRef } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

interface Props extends TextInputProps {
	label?: string;
	error?: string;
	helperText?: string;
}

export const StyledTextInput = forwardRef<TextInput, Props>(
	({ label, error, helperText, ...props }, ref) => {
		const isError = Boolean(error);

		return (
			<View className="w-full">
				{label && (
					<Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-semibold">
						{label}
					</Text>
				)}
				<TextInput
					ref={ref}
					className={`
            border h-14 px-4 rounded-lg text-base
            text-black dark:text-white
            bg-white dark:bg-gray-800
            ${isError ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
          `}
					placeholderTextColor={Colors.light.icon}
					{...props}
				/>
                {/* 👇 LÍNEA CORREGIDA AQUÍ 👇 */}
				{(helperText || error) && (
					<Text className={`mt-1 text-xs ${isError ? 'text-red-500' : 'text-gray-500'}`}>
						{isError ? error : helperText}
					</Text>
				)}
			</View>
		);
	},
);

StyledTextInput.displayName = 'StyledTextInput';