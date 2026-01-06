import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import zodEs from 'zod-i18n-map/locales/es/zod.json';

import en from './locales/en.json';
import es from './locales/es.json';

const resources = {
  en: en,
  es: {
    ...es,
    zod: zodEs,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0].languageCode || 'es',
  fallbackLng: 'es',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

// Set the error map explicitly to use the i18n instance we just created
z.setErrorMap((issue, ctx) => {
    return zodI18nMap(issue, ctx);
});

export default i18n;