/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
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

export function setTimestampWithDaysIncrement(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function latestRunFromTaskRunHistory(runHistory) {
    if (runHistory && Array.isArray(runHistory) && runHistory.length > 0) {
        if (runHistory.length > 1) {
            runHistory.sort((a, b) => {
                let x = a.executionDate;
                let y = b.executionDate;
                if (x < y) {
                    return 1;
                }
                if (x > y) {
                    return -1;
                }
                return 0;
            });
        }
        return runHistory.at(0).id;
    }
    return null;
}

export function doFilterTasks(
    objects,
    taskGetter,
    currentStatusFilter,
    currentTimestampFilter
) {
    // gridcapaFormatDate is not accessible inside the filter we have to use an intermediate
    const formatDate = gridcapaFormatDate;
    return objects.filter((item) => {
        const task = taskGetter(item);
        const nbStatusFiltered = currentStatusFilter.length;
        const nbTsFiltered = currentTimestampFilter.length;

        const filterStatus =
            nbStatusFiltered === 0 ||
            (nbStatusFiltered > 0 &&
                currentStatusFilter.some((f) => task.status.includes(f)));
        const filterTimestamp =
            nbTsFiltered === 0 ||
            (nbTsFiltered > 0 &&
                currentTimestampFilter.some((f) =>
                    formatDate(task.timestamp).includes(f)
                ));

        return task && filterStatus && filterTimestamp;
    });
}

export function getNewTimestampFromEvent(existingTimestamp, event) {
    const date = event.target.value;
    const newTimestamp = existingTimestamp;
    newTimestamp.setDate(date.substring(8, 2));
    newTimestamp.setMonth(date.substring(5, 2) - 1);
    newTimestamp.setFullYear(date.substring(0, 4));

    return newTimestamp;
}
