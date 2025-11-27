/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    getLocalStorageLanguage,
    getLocalStorageTheme,
    saveLocalStorageLanguage,
    saveLocalStorageTheme,
} from './local-storage.js';
import { DARK_THEME, LANG_SYSTEM } from '@gridsuite/commons-ui';

it('should save and get theme', () => {
    expect(getLocalStorageTheme()).toBe(DARK_THEME); //default
    saveLocalStorageTheme('HALLOWEEN');
    expect(getLocalStorageTheme()).toBe('HALLOWEEN');
});

it('should save and get language', () => {
    expect(getLocalStorageLanguage()).toBe(LANG_SYSTEM); //default
    saveLocalStorageLanguage('Urdu');
    expect(getLocalStorageLanguage()).toBe('Urdu');
});
