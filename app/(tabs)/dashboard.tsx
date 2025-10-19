import { MembershipCard } from '@/components/auth/dashboard/membershipcard';
import { ProgressCard } from '@/components/auth/dashboard/progresscard';
import { ReservedClassesCard } from '@/components/auth/dashboard/reservedclasses';
import { TodayRoutineCard } from '@/components/auth/dashboard/todayroutinecard';
import { UserHeader } from '@/components/auth/dashboard/userheader';
import { WeekCalendar } from '@/components/auth/dashboard/weekcalendar';
import { ThemedView } from '@/components/themed-view';
import { ScrollView } from 'react-native';

export default function DashboardScreen() {
	return (
		<ThemedView className='flex-1 bg-white dark:bg-neutral-950 px-4 pt-10'>
			<ScrollView showsVerticalScrollIndicator={false}>
				<UserHeader
					name='Albani'
					message='Es hora de desafiar tus límites'
					avatarUrl='https://randomuser.me/api/portraits/women/45.jpg'
				/>
				<WeekCalendar />
				<MembershipCard daysRemaining={15} />
				<ProgressCard weekProgress={0.8} calories={1200} completed='4/5' />
				<ReservedClassesCard reserved={0} />
				<TodayRoutineCard
					title='Day 05 - Warm Up'
					time='07:00 - 08:00 AM'
					date='Mon 26 Apr'
				/>
			</ScrollView>
		</ThemedView>
	);
}
