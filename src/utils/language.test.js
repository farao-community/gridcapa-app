/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */ import { getComputedLanguage, getSystemLanguage } from './language.js';
import { LANG_ENGLISH, LANG_SYSTEM } from '@gridsuite/commons-ui';

it('should get language', async () => {
    expect(getComputedLanguage('Dutch')).toBe('Dutch');
    expect(getComputedLanguage(LANG_SYSTEM)).not.toBe('Sumerian');
    expect(getSystemLanguage()).toBe(LANG_ENGLISH);
});
