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
    const timeMatch = timeParam?.match(TIME_REGEX);
    return timeMatch ? timeMatch[0] : null;
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
                    convertMonthFromIsoToJs(dateMatch[2]),
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
    // For ISO 8601 Date format, the date and month should be two-digit values.
    // As JS Date methods return single-digit date and month (for values <10),
    // we need to add a '0' if the value is single digit.
    return ('0' + value).slice(-2);
}

function convertMonthFromJsToIso(jsMonth) {
    // For ISO 8601 Date format, the month should be a two-digit value between 01 (Jan) and 12 (Dec).
    // As JS' Date methods return single-digit months indexed from 0 (Jan) to 11 (Dec),
    // we need to increment the month value and add a '0' if the value is single digit.
    return twoDigits(Number.parseInt(jsMonth) + 1);
}

function convertMonthFromIsoToJs(isoMonth) {
    // For JS' Date, the month value should be an Integer from 0 (Jan) to 11 (Dec).
    // As ISO 8601 Date format represents the month as a two-digit value between 01 (Jan) and 12 (Dec).
    // we need to decrement the month value and make it an Integer.
    return Number.parseInt(isoMonth) - 1;
}

export function getDateString(timestamp) {
    const year = timestamp.getUTCFullYear();
    const month = convertMonthFromJsToIso(timestamp.getUTCMonth());
    const date = twoDigits(timestamp.getUTCDate());
    return `${year}-${month}-${date}`;
}

export function getTimeString(timestamp) {
    const hours = twoDigits(timestamp.getUTCHours());
    const minutes = twoDigits(timestamp.getUTCMinutes());
    return `${hours}:${minutes}`;
}
