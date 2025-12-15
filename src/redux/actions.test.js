import {
    selectComputedLanguage,
    selectLanguage,
    selectTheme,
} from './actions.js';
import { DARK_THEME } from '@gridsuite/commons-ui';

it('should select languages and theme', () => {
    expect(selectLanguage('en')).toEqual({
        type: 'SELECT_LANGUAGE',
        language: 'en',
    });
    expect(selectTheme(DARK_THEME)).toEqual({
        type: 'SELECT_THEME',
        theme: DARK_THEME,
    });
    expect(selectComputedLanguage('en')).toEqual({
        type: 'SELECT_COMPUTED_LANGUAGE',
        computedLanguage: 'en',
    });
});
