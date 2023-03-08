/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { blue, green, grey, orange, red } from '@mui/material/colors';
import { LIGHT_THEME } from '@gridsuite/commons-ui';

const lightTaskStatusStyle = {
    SUCCESS: {
        backgroundColor: green[500],
        color: 'black',
    },
    ERROR: {
        backgroundColor: red[500],
        color: 'black',
    },
    READY: {
        backgroundColor: green[300],
        color: 'black',
    },
    RUNNING: {
        backgroundColor: blue[300],
        color: 'black',
    },
    PENDING: {
        backgroundColor: '#d6fcff',
        color: 'black',
    },
    CREATED: {
        backgroundColor: orange[300],
        color: 'black',
    },
    NOT_CREATED: {
        backgroundColor: grey[300],
        color: 'black',
    },
    DEFAULT: {
        backgroundColor: grey[300],
        color: 'black',
    },
};

const darkTaskStatusStyle = {
    SUCCESS: {
        backgroundColor: '#087f23',
        color: 'white',
    },
    ERROR: {
        backgroundColor: '#870000',
        color: 'white',
    },
    READY: {
        backgroundColor: '#4b830d',
        color: 'white',
    },
    RUNNING: {
        backgroundColor: '#0077c2',
        color: 'white',
    },
    PENDING: {
        backgroundColor: '#576e70',
        color: 'white',
    },
    CREATED: {
        backgroundColor: '#7d7642',
        color: 'white',
    },
    NOT_CREATED: {
        backgroundColor: '#707070',
        color: 'white',
    },
    DEFAULT: {
        backgroundColor: '#707070',
        color: 'white',
    },
};

export function getTaskStatusStyle(taskStatus, theme) {
    const themeStyle =
        theme === LIGHT_THEME ? lightTaskStatusStyle : darkTaskStatusStyle;
    if (taskStatus === null || themeStyle[taskStatus] === null) {
        return themeStyle['DEFAULT'];
    }
    return themeStyle[taskStatus];
}
