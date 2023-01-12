import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';

export type Language = {
  code: string;
  label: string;
  nativeLabel: string;
};

export const english: Language = {
  code: 'en',
  label: 'English',
  nativeLabel: 'English',
};

export const hebrew: Language = {
  code: 'he',
  label: 'Hebrew',
  nativeLabel: 'עברית',
};

export const languages = { [english.code]: english, [hebrew.code]: hebrew };

i18next
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .use(I18NextHttpBackend)
  .init({
    ns: ['translation', 'common', 'error'],
    fallbackLng: english.code,
  });

// console.log(i18next.t('item', { ns: 'common', count: 2 }));
// console.log(i18next.t('day', { count: 2 }));
