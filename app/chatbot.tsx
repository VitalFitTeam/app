import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
	id: string;
	text: string;
	isBot: boolean;
	timestamp: Date;
};

export default function ChatbotScreen() {
	const { t } = useTranslation();
	const router = useRouter();
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			text: t('chatbot.welcomeMessage'),
			isBot: true,
			timestamp: new Date(),
		},
	]);
	const [inputText, setInputText] = useState('');

	const handleSend = () => {
		if (!inputText.trim()) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			text: inputText.trim(),
			isBot: false,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputText('');

		// Static bot response for now
		setTimeout(() => {
			const botResponse: Message = {
				id: (Date.now() + 1).toString(),
				text: t('chatbot.staticResponse'),
				isBot: true,
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, botResponse]);
		}, 1000);
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<ThemedView lightColor='#FFFFFF' darkColor='#050816' style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={0}>
					{/* Header */}
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingHorizontal: 16,
							paddingVertical: 16,
							backgroundColor: '#1f2937',
						}}>
						<TouchableOpacity
							onPress={() => router.back()}
							style={{
								width: 44,
								height: 44,
								borderRadius: 22,
								backgroundColor: 'rgba(255,255,255,0.1)',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Ionicons name='chevron-back' size={24} color='#ffffff' />
						</TouchableOpacity>

						<View
							style={{
								width: 48,
								height: 48,
								borderRadius: 24,
								backgroundColor: '#f97316',
								alignItems: 'center',
								justifyContent: 'center',
								marginLeft: 12,
							}}>
							<Ionicons name='fitness' size={26} color='#ffffff' />
						</View>

						<View style={{ flex: 1, marginLeft: 12 }}>
							<ThemedText
								style={{
									color: '#ffffff',
									fontFamily: 'BebasNeue-Regular',
									fontSize: 22,
									letterSpacing: 0.5,
								}}>
								{t('chatbot.title')}
							</ThemedText>
							<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
								<View
									style={{
										width: 8,
										height: 8,
										borderRadius: 4,
										backgroundColor: '#22c55e',
										marginRight: 6,
									}}
								/>
								<ThemedText
									style={{
										color: '#9ca3af',
										fontSize: 13,
									}}>
									{t('chatbot.online')}
								</ThemedText>
							</View>
						</View>

						<Image
							source={require('@/assets/images/Frame.png')}
							style={{ width: 44, height: 44, resizeMode: 'contain' }}
						/>
					</View>

					{/* Messages */}
					<ScrollView
						style={{ flex: 1 }}
						contentContainerStyle={{
							paddingHorizontal: 16,
							paddingVertical: 16,
						}}
						showsVerticalScrollIndicator={false}>
						{messages.map((message) => (
							<View
								key={message.id}
								style={{
									flexDirection: 'row',
									justifyContent: message.isBot ? 'flex-start' : 'flex-end',
									marginBottom: 12,
								}}>
								{message.isBot && (
									<View
										style={{
											width: 32,
											height: 32,
											borderRadius: 16,
											backgroundColor: '#f97316',
											alignItems: 'center',
											justifyContent: 'center',
											marginRight: 8,
										}}>
										<Ionicons name='fitness' size={18} color='#ffffff' />
									</View>
								)}
								<View
									style={{
										maxWidth: '75%',
										backgroundColor: message.isBot ? '#f97316' : '#1f2937',
										borderRadius: 16,
										borderTopLeftRadius: message.isBot ? 4 : 16,
										borderTopRightRadius: message.isBot ? 16 : 4,
										paddingHorizontal: 14,
										paddingVertical: 10,
									}}>
									<ThemedText
										style={{
											color: '#ffffff',
											fontSize: 14,
											lineHeight: 20,
										}}>
										{message.text}
									</ThemedText>
									<ThemedText
										style={{
											color: message.isBot ? 'rgba(255,255,255,0.7)' : '#9ca3af',
											fontSize: 10,
											marginTop: 4,
											textAlign: message.isBot ? 'left' : 'right',
										}}>
										{formatTime(message.timestamp)}
									</ThemedText>
								</View>
							</View>
						))}
					</ScrollView>

					{/* Quick Actions */}
					<View
						style={{
							paddingHorizontal: 16,
							paddingVertical: 8,
						}}>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{ gap: 8 }}>
							{[
								{ key: 'classSchedules', label: t('chatbot.quickActions.classSchedules') },
								{ key: 'myMembership', label: t('chatbot.quickActions.myMembership') },
								{ key: 'bookClass', label: t('chatbot.quickActions.bookClass') },
								{ key: 'contactSupport', label: t('chatbot.quickActions.contactSupport') },
							].map((action) => (
								<TouchableOpacity
									key={action.key}
									onPress={() => setInputText(action.label)}
									style={{
										backgroundColor: '#f97316',
										borderRadius: 20,
										paddingHorizontal: 14,
										paddingVertical: 8,
									}}>
									<ThemedText
										style={{
											color: '#ffffff',
											fontSize: 13,
											fontWeight: '500',
										}}>
										{action.label}
									</ThemedText>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Input */}
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingHorizontal: 16,
							paddingVertical: 12,
							paddingBottom: Platform.OS === 'ios' ? 12 : 16,
							borderTopWidth: 1,
							borderTopColor: '#27272a',
							gap: 12,
						}}>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								backgroundColor: '#1f2937',
								borderRadius: 24,
								paddingHorizontal: 16,
							}}>
							<TextInput
								value={inputText}
								onChangeText={setInputText}
								placeholder={t('chatbot.inputPlaceholder')}
								placeholderTextColor='#71717a'
								style={{
									flex: 1,
									color: '#ffffff',
									fontSize: 14,
									paddingVertical: 12,
								}}
								multiline
								maxLength={500}
								onSubmitEditing={handleSend}
							/>
						</View>
						<TouchableOpacity
							onPress={handleSend}
							disabled={!inputText.trim()}
							style={{
								width: 48,
								height: 48,
								borderRadius: 24,
								backgroundColor: '#1f2937',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<Ionicons
								name='send'
								size={20}
								color={inputText.trim() ? '#f97316' : '#71717a'}
							/>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</ThemedView>
	);
}
