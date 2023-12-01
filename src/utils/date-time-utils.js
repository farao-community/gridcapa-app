/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { setTimestampWithDaysIncrement } from './commons';

export const DATE_REGEX = /^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]$)/;
export const TIME_REGEX = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;

const TODAY_TIMESTAMP = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0,
    30
);

function getTimeFromTimeParam(timeParam) {
    if (timeParam) {
        const timeMatch = timeParam.match(TIME_REGEX);
        if (timeMatch) {
            return timeMatch[0];
        }
    }
    return null;
}

export function getInitialTimestampToSet(dateParam, timeParam, dayIncrement) {
    if (dateParam) {
        const dateMatch = dateParam.match(DATE_REGEX);
        if (dateMatch) {
            let timeToSet = getTimeFromTimeParam(timeParam);
            if (timeToSet) {
                return new Date(dateMatch[0] + 'T' + timeToSet + 'Z');
            } else {
                let dateToSet = new Date(
                    dateMatch[1],
                    dateMatch[2],
                    dateMatch[3]
                );
                dateToSet.setMinutes(30);
                return dateToSet;
            }
        }
    }

    const daysToIncrement = Number.isInteger(dayIncrement) ? dayIncrement : 0;
    return setTimestampWithDaysIncrement(TODAY_TIMESTAMP, daysToIncrement);
}

function twoDigits(value) {
    return ('0' + value).slice(-2);
}

function twoDigitsMonth(value) {
    return twoDigits(Number.parseInt(value) + 1);
}

export function getDateString(timestamp) {
    return (
        timestamp.getUTCFullYear() +
        '-' +
        twoDigitsMonth(timestamp.getUTCMonth()) +
        '-' +
        twoDigits(timestamp.getUTCDate())
    );
}

export function getTimeString(timestamp) {
    return (
        twoDigits(timestamp.getUTCHours()) +
        ':' +
        twoDigits(timestamp.getUTCMinutes())
    );
}
