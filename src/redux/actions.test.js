import {
    selectComputedLanguage,
    selectLanguage,
} from './actions.js';

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
