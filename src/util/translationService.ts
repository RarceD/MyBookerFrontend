import { setTranslations, setLocale } from 'react-i18nify';
import en from '../translations/en.json';
import es from '../translations/es.json';

// Translations are bundled with the app (imported, not fetched at runtime) so
// the code and its texts always ship together. This prevents the raw keys from
// ever showing up because of a cache mismatch between the JS and a separate
// translations file.
export const initTranslationModule = () => {
    setTranslations({ en, es });

    // Detect language from the browser (currently forced to Spanish):
    const userLang: string = navigator.language;
    userLang === 'es-ES' ? setLocale('es') : setLocale('en');
    setLocale('es');
};

export const setTranslationLanguage = (locale: 'es' | 'en') => setLocale(locale);
