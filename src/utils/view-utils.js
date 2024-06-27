/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    DATE_REGEX,
    TIME_REGEX,
    getDateString,
    getTimeString,
} from '../utils/date-time-utils';

export const Views = {
    PROCESS_TIMESTAMP_VIEW: 0,
    BUSINESS_DATE_VIEW: 1,
    RUNNING_TASKS_VIEW: 2,
};

export function getInitialViewToSet(dateParam, timeParam, defaultView) {
    if (dateParam?.match(DATE_REGEX)) {
        if (timeParam?.match(TIME_REGEX)) {
            return Views.PROCESS_TIMESTAMP_VIEW;
        }
        return Views.BUSINESS_DATE_VIEW;
    }
    return defaultView;
}

export function getUrlWithTimestampAndView(timestamp, view) {
    switch (view) {
        case Views.BUSINESS_DATE_VIEW:
            // Because the `timestamp` parameter is in UTC timezone and the HMI is in local timezone,
            // we need to set time to noon instead of midnight in order to be sure that the date displayed
            // in the Business Date View is the same as the one given in parameter.
            const noonTimestamp = new Date(timestamp);
            noonTimestamp.setHours(12);
            const date = getDateString(noonTimestamp);
            return `/date/${date}`;
        case Views.PROCESS_TIMESTAMP_VIEW:
            const utcDate = getDateString(timestamp);
            const utcTime = getTimeString(timestamp);
            return `/utcDate/${utcDate}/utcTime/${utcTime}`;
        case Views.RUNNING_TASKS_VIEW:
            return `/global`;
        default:
            return '/';
    }
}
