/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { APP_NAME, COMMON_APP_NAME, getAppName } from './config-params.js';

it('should load correct appName', () => {
    expect(getAppName('theme')).toEqual(COMMON_APP_NAME);
    expect(getAppName('bonjour')).toEqual(APP_NAME);
});
