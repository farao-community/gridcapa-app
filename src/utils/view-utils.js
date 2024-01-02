/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DATE_REGEX, TIME_REGEX } from '../utils/date-time-utils';

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
