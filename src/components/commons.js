/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const crypto = require('crypto');

export const sha256 = (x) =>
    crypto.createHash('sha256').update(x, 'utf8').digest('hex'); // UTF8 text hash

export function getDay(date) {
    return date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
}

export function getMonth(date) {
    return date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1; //January is 0!;
}

function getHours(date) {
    return date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
}

function getMinutes(date) {
    return date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
}

export function formatTimeStamp(timestamp) {
    let date = new Date(timestamp);
    const seconds =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return (
        date.getFullYear() +
        '-' +
        getMonth(date) +
        '-' +
        getDay(date) +
        '  ' +
        getHours(date) +
        ':' +
        getMinutes(date) +
        ':' +
        seconds
    );
}

export function formatTimestampWithoutSecond(timestamp) {
    let date = new Date(timestamp);
    return (
        date.getFullYear() +
        '-' +
        getMonth(date) +
        '-' +
        getDay(date) +
        '  ' +
        getHours(date) +
        ':' +
        getMinutes(date)
    );
}
