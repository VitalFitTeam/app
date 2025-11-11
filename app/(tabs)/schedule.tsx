import { MonthCalendar } from '@/components/auth/dashboard/monthcalendar';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import ClassCard from '@/components/ClassCard';
import Dropdown from '@/components/Dropdown';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const classes = [
	{
		time: '12:00 PM',
		title: 'Zumba',
		instructor: 'Con Laura Torres',
		branch: 'Sucursal Sur',
		imageUrl: require('@/assets/images/zumba-w.jpg'),
	},
	{
		time: '11:00 AM',
		title: 'Spinning',
		instructor: 'Con Carlos Mendoza',
		branch: 'Sucursal Norte',
		imageUrl: require('@/assets/images/spinning-w.jpg'),
	},
	{
		time: '10:00 AM',
		title: 'Yoga Flow',
		instructor: 'Con Sofia Ramirez',
		branch: 'Sucursal Centro',
		imageUrl: require('@/assets/images/yoga-w.jpg'),
	},
];

type Reservation = {
	time: string;
	title: string;
	instructor: string;
	branch: string;
	imageUrl: string;
	status: 'assisted' | 'absent' | 'cancelled';
};

const reservations: Reservation[] = [
	{
		time: '10:00 AM',
		title: 'Yoga Flow',
		instructor: 'Con Sofia Ramirez',
		branch: 'Sucursal Centro',
		imageUrl: require('@/assets/images/yoga-w.jpg'),
		status: 'assisted',
	},
	{
		time: '11:00 AM',
		title: 'Spinning',
		instructor: 'Con Carlos Mendoza',
		branch: 'Sucursal Norte',
		imageUrl: require('@/assets/images/spinning-w.jpg'),
		status: 'cancelled',
	},
	{
		time: '12:00 PM',
		title: 'Zumba',
		instructor: 'Con Laura Torres',
		branch: 'Sucursal Sur',
		imageUrl: require('@/assets/images/zumba-w.jpg'),
		status: 'absent',
	},
];

export default function HorariosScreen() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<'classes' | 'reservas' | 'explorar'>('classes'); // State to manage active tab

	return (
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950 p-4 pt-12'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View className='mb-4'>
					<Image
						source={require('@/assets/images/vitalfit-whatsapp.jpeg')}
						style={{ width: 120, height: 50, borderRadius: 6 }}
						contentFit='cover'
					/>
					<ThemedText className='mt-3 text-xs tracking-widest text-white/80'>
						CALENDARIO
					</ThemedText>
				</View>

				<View className='mb-6'>
					{activeTab === 'reservas' ? <MonthCalendar /> : <WeekCalendar />}
				</View>

				<View className='flex-row mb-6 border rounded-xl border-neutral-200 dark:border-neutral-700 p-1'>
					<Pressable
						onPress={() => setActiveTab('classes')}
						style={({ pressed }) => [{ transform: [{ scale: pressed ? 1.05 : 1 }] }]}
						className={`flex-1 items-center py-3 rounded-lg ${
							activeTab === 'classes' ? 'bg-neutral-100 dark:bg-neutral-800' : ''
						}`}>
						<ThemedText
							className={`text-lg font-semibold ${
								activeTab === 'classes'
									? 'text-orange-500'
									: 'text-neutral-500 dark:text-neutral-400'
							}`}>
							Clases
						</ThemedText>
					</Pressable>
					<Pressable
						onPress={() => setActiveTab('reservas')}
						style={({ pressed }) => [{ transform: [{ scale: pressed ? 1.05 : 1 }] }]}
						className={`flex-1 items-center py-3 rounded-lg ${
							activeTab === 'reservas' ? 'bg-neutral-100 dark:bg-neutral-800' : ''
						}`}>
						<ThemedText
							className={`text-lg font-semibold text-center ${
								activeTab === 'reservas'
									? 'text-orange-500'
									: 'text-neutral-500 dark:text-neutral-400'
							}`}>
							Reservas
						</ThemedText>
					</Pressable>
					<Pressable
						onPress={() => setActiveTab('explorar')}
						style={({ pressed }) => [{ transform: [{ scale: pressed ? 1.05 : 1 }] }]}
						className={`flex-1 items-center py-3 rounded-lg ${
							activeTab === 'explorar' ? 'bg-neutral-100 dark:bg-neutral-800' : ''
						}`}>
						<ThemedText
							className={`text-lg font-semibold ${
								activeTab === 'explorar'
									? 'text-orange-500'
									: 'text-neutral-500 dark:text-neutral-400'
							}`}>
							Explorar
						</ThemedText>
					</Pressable>
				</View>

				<View className='mb-6'>
					<View className='flex-row items-center justify-between mt-2'>
						<ThemedText className='text-2xl font-extrabold'>Proximas clases</ThemedText>
						<View style={{ width: 120 }}>
							<Dropdown label='Filter' onPress={() => {}} />
						</View>
					</View>
				</View>

				{activeTab === 'classes' && (
					<View>
						{classes.map((classItem, index) => (
							<ClassCard
								key={index}
								time={classItem.time}
								title={classItem.title}
								instructor={classItem.instructor}
								branch={classItem.branch}
								imageUrl={classItem.imageUrl}
								variant='overlay'
								category={'categoría'}
								onPress={(classData) => {
									router.push({
										pathname: '/class-details',
										params: classData,
									});
								}}
							/>
						))}
					</View>
				)}

				{activeTab === 'reservas' && (
					<View>
						<ThemedText className='text-xl font-bold mb-4'>Mis reservas</ThemedText>
						{reservations.map((reservation, index) => (
							<ClassCard
								key={index}
								time={reservation.time}
								title={reservation.title}
								instructor={reservation.instructor}
								branch={reservation.branch}
								imageUrl={reservation.imageUrl}
								variant='overlay'
								category={'categoría'}
								onPress={(classData) => {
									router.push({ pathname: '/class-details', params: classData });
								}}
							/>
						))}
						{reservations.length === 0 && (
							<ThemedText className='text-neutral-500'>
								Aún no tienes reservas.
							</ThemedText>
						)}
					</View>
				)}

				{activeTab === 'explorar' && (
					<View>
						<ThemedText className='text-xl font-bold mb-4'>Explorar</ThemedText>
						<ThemedText className='text-neutral-500'>Próximamente</ThemedText>
					</View>
				)}
			</ScrollView>
		</ThemedView>
	);
}
