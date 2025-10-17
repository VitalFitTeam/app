// components/auth/ProgressIndicator.tsx
import { Text, View } from 'react-native';

interface Props {
	currentStep: number;
}

const steps = ['Correo', 'Código', 'Cambio'];

export function ProgressIndicator({ currentStep }: Props) {
	return (
		<View className='w-full px-6 py-4 rounded-2xl bg-white '>
			<View className='flex-row justify-between items-center relative'>
				{/* Línea base gris */}
				<View className='absolute top-1/3 left-0 right-0 h-0.5 bg-gray-200' />

				{/* Línea de progreso activa */}
				<View
					className='absolute  top-1/1 left-0 h-0 bg-orange-500'
					style={{
						width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
					}}
				/>

				{steps.map((label, index) => {
					const stepNumber = index + 1;
					const isActive = stepNumber <= currentStep;

					return (
						<View key={label} className='items-center z-10'>
							<View
								className={`w-9 h-9 rounded-full items-center justify-center border-2 ${
									isActive
										? 'bg-orange-500 border-orange-500'
										: 'bg-white border-gray-300'
								}`}>
								<Text
									className={`font-semibold ${
										isActive ? 'text-white' : 'text-gray-400'
									}`}>
									{stepNumber}
								</Text>
							</View>
							<Text
								className={`mt-2 text-sm font-medium ${
									isActive ? 'text-orange-500' : 'text-gray-400'
								}`}>
								{label}
							</Text>
						</View>
					);
				})}
			</View>
		</View>
	);
}
