/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { reducer } from './reducer.js';
import {
    getLocalStorageComputedLanguage,
    getLocalStorageLanguage,
    getLocalStorageTheme,
} from './local-storage.js';
import { PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params.js';

it('should return the initial state', () => {
    const initialReducer = reducer(undefined, () => {});

    expect(initialReducer).toEqual({
        computedLanguage: getLocalStorageComputedLanguage(),
        user: null,
        signInCallbackError: null,
        authenticationRouterError: null,
        showAuthenticationRouterLogin: false,
        [PARAM_THEME]: getLocalStorageTheme(),
        [PARAM_LANGUAGE]: getLocalStorageLanguage(),
    });
});
