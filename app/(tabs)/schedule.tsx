import ClassCard from '@/components/ClassCard';
import Dropdown from '@/components/Dropdown';
import FilterChip from '@/components/FilterChip';
import ReservationCard from '@/components/ReservationCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const classes = [
	{
		time: '12:00 PM',
		title: 'Zumba',
		instructor: 'Con Laura Torres',
		branch: 'Sucursal Sur',
		imageUrl: require('@/assets/images/yoga.png'),
	},
	{
		time: '11:00 AM',
		title: 'Spinning',
		instructor: 'Con Carlos Mendoza',
		branch: 'Sucursal Norte',
		imageUrl: require('@/assets/images/espini.png'),
	},
	{
		time: '10:00 AM',
		title: 'Yoga Flow',
		instructor: 'Con Sofia Ramirez',
		branch: 'Sucursal Centro',
		imageUrl: require('@/assets/images/yoga.png'),
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
		imageUrl: require('@/assets/images/yoga.png'),
		status: 'assisted',
	},
	{
		time: '11:00 AM',
		title: 'Spinning',
		instructor: 'Con Carlos Mendoza',
		branch: 'Sucursal Norte',
		imageUrl: require('@/assets/images/espini.png'),
		status: 'cancelled',
	},
	{
		time: '12:00 PM',
		title: 'Zumba',
		instructor: 'Con Laura Torres',
		branch: 'Sucursal Sur',
		imageUrl: require('@/assets/images/yoga.png'),
		status: 'absent',
	},
];

const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export default function HorariosScreen() {
	const router = useRouter();
	const [selectedDays, setSelectedDays] = useState<string[]>([]);
	const [showFilters, setShowFilters] = useState(false);
	const [activeTab, setActiveTab] = useState<'classes' | 'reservas'>('classes'); // State to manage active tab

	const toggleDay = (day: string) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
		);
	};

	return (
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950 p-4'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<ThemedText className='text-3xl font-bold mb-6'>Horarios</ThemedText>

				<View className='flex-row mb-6'>
					<TouchableOpacity
						onPress={() => setActiveTab('classes')}
						className={`flex-1 items-center py-3 border-b-2 ${
							activeTab === 'classes'
								? 'border-orange-500'
								: 'border-neutral-200 dark:border-neutral-700'
						}`}>
						<ThemedText
							className={`text-lg font-bold ${
								activeTab === 'classes'
									? 'text-orange-500'
									: 'text-neutral-500 dark:text-neutral-400'
							}`}>
							Clases
						</ThemedText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setActiveTab('reservas')}
						className={`flex-1 items-center py-3 border-b-2 ${
							activeTab === 'reservas'
								? 'border-orange-500'
								: 'border-neutral-200 dark:border-neutral-700'
						}`}>
						<ThemedText
							className={`text-lg font-semibold ${
								activeTab === 'reservas'
									? 'text-orange-500'
									: 'text-neutral-500 dark:text-neutral-400'
							}`}>
							Mis Reservas
						</ThemedText>
					</TouchableOpacity>
				</View>

				<View className='mb-6'>
					<View className='flex-row flex-wrap mb-2'>
						{days.map((day) => (
							<FilterChip
								key={day}
								label={day}
								isSelected={selectedDays.includes(day)}
								onPress={() => toggleDay(day)}
							/>
						))}
					</View>
					<View className='flex-row justify-between mb-4'>
						<Dropdown label='Tipo de clase' onPress={() => {}} />
						<Dropdown label='Instructor' onPress={() => {}} />
					</View>
					<TouchableOpacity
						onPress={() => setShowFilters(!showFilters)}
						className='flex-row items-center justify-center'>
						<ThemedText className='font-semibold text-orange-500'>
							{showFilters ? 'Ocultar filtros' : 'Mostrar más filtros'}
						</ThemedText>
					</TouchableOpacity>
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
						<ThemedText className='text-xl font-bold mb-4'>
							Tu Historial de Clases
						</ThemedText>
						{reservations.map((reservation, index) => (
							<ReservationCard
								key={index}
								time={reservation.time}
								title={reservation.title}
								instructor={reservation.instructor}
								branch={reservation.branch}
								imageUrl={reservation.imageUrl}
								status={reservation.status}
							/>
						))}
						{reservations.length === 0 && (
							<ThemedText className='text-neutral-500'>
								Aún no tienes reservas.
							</ThemedText>
						)}
					</View>
				)}
			</ScrollView>
		</ThemedView>
	);
}
