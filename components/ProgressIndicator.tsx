// components/auth/ProgressIndicator.tsx
import { ThemedView } from '@/components/themed-view';
import { Text, View } from 'react-native';

interface Props {
	currentStep: number;
}

const steps = ['Correo', 'Código', 'Cambio'];

export function ProgressIndicator({ currentStep }: Props) {
	return (
		<ThemedView className="w-full flex-row justify-between items-center my-6">
			{steps.map((label, index) => {
				const stepNumber = index + 1;
				const isActive = stepNumber <= currentStep;
				return (
					<View key={label} className="items-center">
						<View
							className={`w-8 h-8 rounded-full items-center justify-center border-2 ${
								isActive ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
							}`}>
							<Text className={`${isActive ? 'text-white' : 'text-gray-400'}`}>{stepNumber}</Text>
						</View>
						<Text className={`mt-1 text-sm ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
							{label}
						</Text>
					</View>
				);
			})}
		</ThemedView>
	);
}