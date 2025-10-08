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
	{ id: 'female', label: 'Mujer' },
	{ id: 'male', label: 'Hombre' },
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
		<View className='w-full gap-y-3'>
			{options.map((option) => (
				<TouchableOpacity
					key={option.id}
					onPress={() => handlePress(option.id)}
					className={`
            h-16 w-full flex-row items-center justify-between rounded-lg border px-4
            ${
				internalSelected === option.id
					? 'border-orange-500 bg-gray-800'
					: 'border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600'
			}
          `}>
					<Text
						className={`text-lg ${
							internalSelected === option.id
								? 'text-white'
								: 'text-black dark:text-white'
						}`}>
						{option.label ?? option.id}
					</Text>
					{option.image && (
						<Image
							source={option.image}
							style={{ width: 50, height: 50, resizeMode: 'contain' }}
						/>
					)}
				</TouchableOpacity>
			))}
		</View>
	);
}
