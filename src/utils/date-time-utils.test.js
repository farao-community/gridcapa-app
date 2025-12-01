/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    getDateString,
    getInitialTimestampToSet,
    getTimeString,
} from './date-time-utils.js';

it('should get initial timestamp to set', async () => {
    const res = new Date(getInitialTimestampToSet('2020-01-01', '11:45', 5));
    expect(res.getDate()).toEqual(1);
    expect(res.getUTCHours()).toEqual(11);
    expect(res.getUTCMinutes()).toEqual(45);

    const res2 = new Date(getInitialTimestampToSet('2020-01-01', null, 5));
    expect(res2.getDate()).toEqual(1);
    expect(res2.getUTCHours()).not.toEqual(11);
    expect(res2.getUTCMinutes()).not.toEqual(45);
});

it('should transform date to date and time string', async () => {
    const timestamp = Date.UTC(2020, 0, 1, 11, 45, 0);
    expect(getTimeString(new Date(timestamp))).toEqual('11:45');
    expect(getDateString(new Date(timestamp))).toEqual('2020-01-01');
});
