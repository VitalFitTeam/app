import { PrimaryButton } from '@/components/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { View } from 'react-native';
import { CheckIcon } from 'react-native-heroicons/solid';

type MembershipCardProps = {
	title: string;
	price: string;
	features: string[];
	isRecommended?: boolean;
};

export default function MembershipCard({
	title,
	price,
	features,
	isRecommended = false,
}: MembershipCardProps) {
	return (
		<View
			className={`bg-white dark:bg-neutral-900 border ${
				isRecommended ? 'border-orange-500' : 'border-neutral-200 dark:border-neutral-700'
			} rounded-2xl p-6 mb-6`}>
			<ThemedText className='text-2xl font-bold mb-2'>{title}</ThemedText>
			<View className='flex-row items-baseline mb-6'>
				<ThemedText className='text-5xl font-extrabold'>${price}</ThemedText>
				<ThemedText className='text-lg font-semibold text-neutral-500'>/mes</ThemedText>
			</View>

			<View className='mb-6'>
				{features.map((feature, index) => (
					<View key={index} className='flex-row items-center mb-3'>
						<CheckIcon size={20} color='#34d399' />
						<ThemedText className='ml-3 text-base'>{feature}</ThemedText>
					</View>
				))}
			</View>

			<PrimaryButton
				title='Seleccionar'
				onPress={() => console.log(`Plan ${title} seleccionado`)}
			/>
		</View>
	);
}
