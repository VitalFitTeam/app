import { useState } from 'react';
// Importa ImageSourcePropType para tipar correctamente las imágenes
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

type Gender = 'Mujer' | 'Hombre' | 'Otro';

interface Props {
	onSelect: (gender: Gender) => void;
}

// 1. Define un tipo para la forma de los objetos
type Option = {
	readonly id: Gender;
	readonly label?: string;
	readonly image?: ImageSourcePropType;
};

// 2. Aplica el tipo al array de opciones
const options: readonly Option[] = [
	{ id: 'Mujer', image: require('@/assets/images/Female.svg') },
	{
		id: 'Hombre',
		image: require('@/assets/images/shirtless-athletic-young-man-with-towel-water-bottle-after 1.svg'),
	},
	{ id: 'Otro', label: 'Prefiero no especificarlo' },
];

export function GenderSelector({ onSelect }: Props) {
	const [selected, setSelected] = useState<Gender | null>(null);

	const handlePress = (gender: Gender) => {
		setSelected(gender);
		onSelect(gender);
	};

	return (
		<View className='w-full gap-y-3'>
			{options.map((option) => (
				<TouchableOpacity
					key={option.id}
					onPress={() => handlePress(option.id)}
					className={`
            h-16 w-full flex-row items-center justify-between rounded-lg border px-4
            ${
				selected === option.id
					? 'border-orange-500 bg-gray-800'
					: 'border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600'
			}
          `}>
					<Text
						className={`text-lg ${selected === option.id ? 'text-white' : 'text-black dark:text-white'}`}>
						{/* ✅ Ahora esto es válido porque TypeScript sabe que 'label' puede existir */}
						{option.label ?? option.id}
					</Text>
					{/* Tu comprobación de la imagen ya era correcta */}
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
