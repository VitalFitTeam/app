import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native';

interface PromotionalBannersProps {
	onOfferPress?: () => void;
	onChallengePress?: (challengeId: string) => void;
}

const OfferBanner = ({ onPress }: { onPress?: () => void }) => (
	<TouchableOpacity
		className='h-24 w-full rounded-2xl overflow-hidden'
		onPress={onPress}
		activeOpacity={0.8}>
		<Image
			source={require('../../../assets/images/ofert.png')}
			style={{ width: '100%', height: '100%' }}
			resizeMode='cover'
		/>
	</TouchableOpacity>
);

const ChallengeBanner = ({
	imageSource,
	title,
	subtitle,
	onPress,
}: {
	imageSource: ImageSourcePropType;
	title: string;
	subtitle?: string;
	onPress?: () => void;
}) => (
	<View className='h-48 w-full rounded-2xl overflow-hidden flex-row bg-neutral-800'>
		{/* Contenedor de Texto (Mitad Izquierda) */}
		<View className='w-1/2 justify-center px-5'>
			{subtitle && (
				<Text className='text-orange-500 font-bold text-3xl leading-9 mb-0'>
					{subtitle}
				</Text>
			)}
			<Text className='text-white font-semibold text-lg mb-0'>{title}</Text>
			<TouchableOpacity
				className='bg-orange-500 rounded-lg px-5 py-2.5 self-start'
				onPress={onPress}
				activeOpacity={0.8}>
				<Text className='text-white font-bold text-sm'>Ver más</Text>
			</TouchableOpacity>
		</View>

		{/* Contenedor de Imagen (Mitad Derecha) */}
		<View className='w-1/2 flex-1 justify-center items-center'>
			{/* MODIFICACIÓN CLAVE: Ancho cambiado a 'w-56' y redondeo a 'rounded-2xl' */}
			<View className='h-full w-56 rounded-2xl overflow-hidden'>
				<Image
					source={imageSource}
					style={{ width: '100%', height: '100%' }}
					resizeMode='cover'
				/>
			</View>
		</View>
	</View>
);

const CrossFitBanner = ({
	imageSource,
	title,
	onPress,
}: {
	imageSource: ImageSourcePropType;
	title: string;
	onPress?: () => void;
}) => (
	<View className='h-48 w-full rounded-2xl overflow-hidden'>
		<Image
			source={imageSource}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: '100%',
				height: '100%',
			}}
			resizeMode='cover'
		/>
		<View className='absolute inset-0 bg-black/40' />
		<View className='flex-1 justify-end p-5'>
			<Text className='text-white font-bold text-3xl mb-4'>{title}</Text>
			<TouchableOpacity
				className='bg-orange-500 rounded-lg px-5 py-2.5 self-start'
				onPress={onPress}
				activeOpacity={0.8}>
				<Text className='text-white font-bold text-sm'>Ver más</Text>
			</TouchableOpacity>
		</View>
	</View>
);

export const PromotionalBanners = ({ onOfferPress, onChallengePress }: PromotionalBannersProps) => {
	return (
		<View className='gap-3'>
			<OfferBanner onPress={onOfferPress} />

			<ChallengeBanner
				imageSource={require('../../../assets/images/woman4.png')}
				title='Plank With Hip Twist'
				subtitle='Weekly Challenge'
				onPress={() => onChallengePress?.('plank-challenge')}
			/>

			<OfferBanner onPress={onOfferPress} />

			<CrossFitBanner
				imageSource={require('../../../assets/images/crossfit.png')}
				title='CrossFit'
				onPress={() => onChallengePress?.('crossfit')}
			/>
		</View>
	);
};
