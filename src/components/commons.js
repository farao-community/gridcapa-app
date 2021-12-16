/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const crypto = require('crypto');

export const sha256 = (x) =>
    crypto.createHash('sha256').update(x, 'utf8').digest('hex'); // UTF8 text hash

export function formatTimeStamp(timestamp) {
    let date = new Date(timestamp);
    let formattedDate =
        date.getDay() +
        '/' +
        date.getMonth() +
        '/' +
        date.getFullYear() +
        '  ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds();

    return formattedDate;
}
