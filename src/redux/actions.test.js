import {
    SELECT_LANGUAGE,
    selectComputedLanguage,
    selectLanguage,
} from './actions.js';
import { PARAM_LANGUAGE } from '../utils/config-params.js';

it('should select languages', () => {
    expect(selectLanguage('en')).toEqual({
        type: 'SELECT_LANGUAGE',
        ['language']: 'en',
    });
    expect(selectComputedLanguage('en')).toEqual({
        type: 'SELECT_COMPUTED_LANGUAGE',
        computedLanguage: 'en',
    });
});
