import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import locale from 'react-native-locale-detector';
import AsyncStorage from '@react-native-community/async-storage';

import en from './en.json';
import fr from './fr.json';

const STORAGE_KEY = '@APP:languageCode';

const languageDetector = {
    init: Function.prototype,
    type: 'languageDetector',
    async: true,
    detect: async (callback) => {
        const savedDataJSON = await AsyncStorage.getItem(STORAGE_KEY);
        const lng = (savedDataJSON) ? savedDataJSON:null;
        const selectLanguage = lng || locale;
        // console.log('Detected...', selectLanguage);
        callback(selectLanguage);
    },
    cacheUserLanguage: () => {}
}

i18n
    .use(languageDetector)
    .use(reactI18nextModule)
    .init({
        fallbackLng: 'fr',
        resources: {fr, en},

        ns: ['common'],
        defaultNS: 'common',

        debug: true,

        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
