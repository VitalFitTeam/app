import { MembershipCard } from "@/components/auth/dashboard/membershipcard";
import { UserHeader } from "@/components/auth/dashboard/userheader";
import { WeekCalendar } from "@/components/auth/dashboard/weekcalendar";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { ScrollView } from "react-native";

export default function DashboardScreen() {
  return (
    <ThemedView className="flex-1 bg-white dark:bg-neutral-950 px-4 pt-10">
      <ScrollView showsVerticalScrollIndicator={false}>
        <UserHeader
          name="Albani"
          message="Es hora de desafiar tus límites"
          avatarUrl="https://randomuser.me/api/portraits/women/45.jpg"
        />
        <WeekCalendar />
        <MembershipCard
          daysRemaining={15}
          qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=gym-access"
        />
      </ScrollView>
    </ThemedView>
  );
}
