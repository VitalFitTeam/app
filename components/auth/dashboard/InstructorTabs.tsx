import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type TabType = 'clientes' | 'clases' | 'mensajes';

type Props = {
	activeTab: TabType;
	onChange: (tab: TabType) => void;
};

export function InstructorTabs({ activeTab, onChange }: Props) {
	const getTextStyle = (tab: TabType) => {
		const base = 'text-[12px] font-bold text-center';
		return activeTab === tab ? `${base} text-[#1F2024]` : `${base} text-[#71727A]`;
	};

	return (
		<View className='flex-row justify-between items-center bg-[#F8F9FB] dark:bg-neutral-900 rounded-2xl px-2 py-2 mt-6'>
			<TouchableOpacity
				onPress={() => onChange('clientes')}
				className={`flex-1 py-2 rounded-xl ${
					activeTab === 'clientes' ? 'bg-white dark:bg-neutral-800' : ''
				}`}>
				<Text className={getTextStyle('clientes')}>Clientes</Text>
			</TouchableOpacity>

			<View className='w-[1px] h-[20px] bg-[#E5E5E5]' />

			<TouchableOpacity
				onPress={() => onChange('clases')}
				className={`flex-1 py-2 rounded-xl ${
					activeTab === 'clases' ? 'bg-white dark:bg-neutral-800' : ''
				}`}>
				<Text className={getTextStyle('clases')}>Clases</Text>
			</TouchableOpacity>

			<View className='w-[1px] h-[20px] bg-[#E5E5E5]' />

			<TouchableOpacity
				onPress={() => onChange('mensajes')}
				className={`flex-1 py-2 rounded-xl ${
					activeTab === 'mensajes' ? 'bg-white dark:bg-neutral-800' : ''
				}`}>
				<Text className={getTextStyle('mensajes')}>Mensajes</Text>
			</TouchableOpacity>
		</View>
	);
}
