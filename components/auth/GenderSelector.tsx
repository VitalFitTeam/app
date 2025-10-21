import { useEffect, useState } from 'react';
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

type Gender = 'female' | 'male' | 'prefer-not-to-say';

interface Props {
	onSelect: (gender: Gender) => void;
	selected?: Gender | null;
}

type Option = {
	readonly id: Gender;
	readonly label?: string;
	readonly image?: ImageSourcePropType;
};

const options: readonly Option[] = [
	{ id: 'female', label: 'Mujer', image: require('@/assets/images/female_black.png') },
	{ id: 'male', label: 'Hombre', image: require('@/assets/images/man_black.png') },
	{ id: 'prefer-not-to-say', label: 'Prefiero no especificarlo' },
];

export function GenderSelector({ onSelect, selected }: Props) {
	const [internalSelected, setInternalSelected] = useState<Gender | null>(selected ?? null);

	const handlePress = (gender: Gender) => {
		setInternalSelected(gender);
		onSelect(gender);
	};

	useEffect(() => {
		setInternalSelected(selected ?? null);
	}, [selected]);

	return (
		<View className='w-full gap-y-4'>
			{options.map((option) => (
				<TouchableOpacity
					key={option.id}
					onPress={() => handlePress(option.id)}
					className={`
            w-full flex-row items-center justify-between rounded-2xl p-4
            ${
				internalSelected === option.id ? 'bg-gray-800' : 'bg-white' // Puedes ajustar el color de fondo para no seleccionados si es necesario
			}
          `}>
					<View className='flex-row items-center'>
						<Text
							className={`text-lg font-bold ${
								internalSelected === option.id ? 'text-white' : 'text-black'
							}`}>
							{option.label ?? option.id}
						</Text>
					</View>
					<View className='flex-row items-center'>
						{option.image && (
							<Image
								source={option.image}
								style={{ width: 60, height: 60, resizeMode: 'contain' }}
							/>
						)}
						<View
							className={`ml-4 h-6 w-6 items-center justify-center rounded-full border-2 ${
								internalSelected === option.id
									? 'border-green-500'
									: 'border-gray-400'
							}`}>
							{internalSelected === option.id && (
								<View className='h-3 w-3 rounded-full bg-green-500' />
							)}
						</View>
					</View>
				</TouchableOpacity>
			))}
		</View>
	);
}
