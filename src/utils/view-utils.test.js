/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    getInitialViewToSet,
    getUrlWithTimestampAndView,
} from './view-utils.js';

it('should get initial view', () => {
    expect(getInitialViewToSet('2020-01-01', '11:30', 2)).toEqual(0);
    expect(getInitialViewToSet('2020-01-01', 'aaaaa', 2)).toEqual(1);
    expect(getInitialViewToSet('zzzzzz', 'aaaaa', 2)).toEqual(2);
});

it('should get url from timestamp and view', () => {
    const timestamp = new Date(Date.UTC(2020, 0, 1));
    expect(getUrlWithTimestampAndView(timestamp, 99)).toEqual('/');
    expect(getUrlWithTimestampAndView(timestamp, 2)).toEqual('/global');
    expect(getUrlWithTimestampAndView(timestamp, 1)).toEqual(
        '/date/2020-01-01'
    );
    expect(getUrlWithTimestampAndView(timestamp, 0)).toEqual(
        '/utcDate/2020-01-01/utcTime/00:00'
    );
});
