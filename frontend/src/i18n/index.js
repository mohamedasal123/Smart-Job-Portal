import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en'],
    defaultNS: 'translation',
    returnNull: false,
    interpolation: {
      escapeValue: false,
    },
  });

document.documentElement.lang = i18n.language;
document.documentElement.dir = i18n.dir(i18n.language);

export default i18n;
