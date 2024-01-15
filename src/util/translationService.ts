import { setTranslations, setLocale } from 'react-i18nify';

const fetchTranslations = async (locale: string) => {
    try {
        const response = await fetch(`/translations/${locale}.json`);
        const translations = await response.json();
        return translations;
    } catch (error) {
        console.error(`Error loading ${locale} translations:`, error);
    }
};

export const initTranslationModule = async () => {
    setTranslations({
        en: await fetchTranslations('en'),
        es: await fetchTranslations('es')
    });
    setLocale('es');
}

export const setTranslationLanguage = (locale: 'es' | 'en') => setLocale(locale);
