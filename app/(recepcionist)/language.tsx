import { PrimaryButton } from '@/components/PrimaryButton';
import { Stack, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
];

export default function RecepcionistLanguageScreen() {
  const router = useRouter();

  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleSaveLanguage = () => {
    i18n.changeLanguage(selectedLanguage);
    router.replace('/(recepcionist)/dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: t('languageLabel'),
          headerBackTitle: t('nav.back'),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F2F2F7' },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.optionsContainer}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.option}
                onPress={() => setSelectedLanguage(lang.code)}>
                <Text className='font-body' style={styles.optionText}>{lang.name}</Text>

                {selectedLanguage === lang.code && (
                  <Check color='#F27F2A' size={24} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <PrimaryButton title={t('save')} onPress={handleSaveLanguage} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
  },
});
