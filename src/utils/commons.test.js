/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    gridcapaFormatDate,
    latestRunFromTaskRunHistory,
    setTimestampWithDaysIncrement,
} from './commons.js';
import { startOf2020IsoStr } from './test-utils.js';

it('should format date and add days', () => {
    expect(
        gridcapaFormatDate(
            setTimestampWithDaysIncrement(startOf2020IsoStr(), 1)
        )
    ).toContain('2020-01-02');
});

it('should not get latest run if data is invalid', () => {
    expect(latestRunFromTaskRunHistory(null)).toBeNull();
    expect(latestRunFromTaskRunHistory('hello')).toBeNull();
    expect(latestRunFromTaskRunHistory([])).toBeNull();
});

it('should get latest run if data is valid', () => {
    expect(
        latestRunFromTaskRunHistory([
            { id: 'a', executionDate: 12 },
            { id: 'b', executionDate: 112 },
            { id: 'c', executionDate: 5 },
            { id: 'd', executionDate: 5 },
        ])
    ).toBe('b');

    expect(latestRunFromTaskRunHistory([{ id: 'a', executionDate: 12 }])).toBe(
        'a'
    );
});
