/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import dateFormat from 'dateformat';
import CryptoJS from 'crypto-js';

export const sha256 = (x) => CryptoJS.SHA256(x).toString(CryptoJS.enc.Hex);

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
