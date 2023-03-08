/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { blue, green, grey, orange, red } from '@mui/material/colors';
import dateFormat from 'dateformat';
import CryptoJS from 'crypto-js';

export const sha256 = (x) => CryptoJS.SHA256(x).toString(CryptoJS.enc.Hex);

export function getBackgroundColor(taskStatus) {
    switch (taskStatus) {
        case 'SUCCESS':
            return green[500];
        case 'ERROR':
            return red[500];
        case 'READY':
            return green[300];
        case 'RUNNING':
            return blue[300];
        case 'CREATED':
            return orange[300];
        default:
            return grey[500];
    }
}

const dateMask = 'yyyy-mm-dd HH:MM:ss';

export function gridcapaFormatDate(date) {
    if (date) {
        return dateFormat(date, dateMask);
    }
    return null;
}
