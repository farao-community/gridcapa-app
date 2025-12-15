/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getTaskStatusStyle } from './task-status-style.js';
import { DARK_THEME, LIGHT_THEME } from '@gridsuite/commons-ui';
import { grey } from '@mui/material/colors';

it('should select light style', () => {
    expect(getTaskStatusStyle(null, LIGHT_THEME)).toEqual({
        backgroundColor: grey[300],
        color: 'black',
    });
    [
        'SUCCESS',
        'ERROR',
        'READY',
        'RUNNING',
        'PENDING',
        'CREATED',
        'NOT_CREATED',
    ].forEach((status) => {
        expect(getTaskStatusStyle(status, LIGHT_THEME).color).toBe('black');
    });
});

it('should select dark style', () => {
    expect(getTaskStatusStyle(null, DARK_THEME)).toEqual({
        backgroundColor: '#707070',
        color: 'white',
    });
    [
        'SUCCESS',
        'ERROR',
        'READY',
        'RUNNING',
        'PENDING',
        'CREATED',
        'NOT_CREATED',
    ].forEach((status) => {
        expect(getTaskStatusStyle(status, DARK_THEME).color).toBe('white');
    });
});
