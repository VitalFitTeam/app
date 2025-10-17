// components/auth/StyledTextInput.tsx

import { Eye, EyeOff } from 'lucide-react-native';
import { forwardRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, type TextInputProps } from 'react-native';

interface Props extends TextInputProps {
	label?: string;
	error?: string;
	helperText?: string;
	isPasswordInput?: boolean;
}

export const StyledTextInput = forwardRef<TextInput, Props>(
	({ label, error, helperText, isPasswordInput, ...props }, ref) => {
		const isError = Boolean(error);
		const [isPasswordVisible, setIsPasswordVisible] = useState(false);

		const togglePasswordVisibility = () => {
			setIsPasswordVisible(!isPasswordVisible);
		};

		return (
			<View className='w-full'>
				{label && <Text className='text-sm text-gray-500 mb-1 font-semibold'>{label}</Text>}

				<View className='relative flex-row items-center'>
					<TextInput
						ref={ref}
						className={`
							flex-1 border h-14 px-4 rounded-lg text-base
							text-black bg-white
							${isError ? 'border-red-500' : 'border-gray-300'}
							${isPasswordInput ? 'pr-10' : ''}
						`}
						placeholderTextColor='#9CA3AF'
						secureTextEntry={isPasswordInput ? !isPasswordVisible : false}
						{...props}
					/>
					{isPasswordInput && (
						<TouchableOpacity
							onPress={togglePasswordVisibility}
							className='absolute right-3 p-2'
							activeOpacity={0.7}>
							{isPasswordVisible ? (
								<Eye size={20} color='#9CA3AF' />
							) : (
								<EyeOff size={20} color='#9CA3AF' />
							)}
						</TouchableOpacity>
					)}
				</View>

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
