/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    cleanUpOnExit,
    renderComponent,
    setupTestContainer,
} from '../utils/test-utils.js';
import EventsTable from './events-table.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));
jest.mock('./filter-menu');

it('renders events table without filtering data', async () => {
    const evtData = [
        { level: 'INFO', message: 'Hi' },
        { level: 'ERROR', message: 'Bye' },
    ];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    eventLevelPredefinedFilter: [
                        { defaultChecked: false, filterValue: 'a' },
                    ],
                    eventLogPredefinedFilter: [
                        { defaultChecked: false, filterValue: 'b' },
                    ],
                }),
            text: () => Promise.resolve('hello'),
        })
    );

    await renderComponent(<EventsTable eventsData={evtData} />, root);

    expect(container.innerHTML).toContain('<p>Hi</p>');
    expect(container.innerHTML).toContain('<p>Bye</p>');
    expect(container.innerHTML).not.toContain('Error message');
});

it('renders events table, filtered', async () => {
    const evtData = [
        { level: 'INFO', message: 'Hi' },
        { level: 'ERROR', message: 'Bye' },
    ];

    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    eventLevelPredefinedFilter: [
                        { defaultChecked: false, filterValue: 'INFO' },
                    ],
                    eventLogPredefinedFilter: [
                        { defaultChecked: true, filterValue: 'b' },
                    ],
                }),
            text: () => Promise.resolve('hello'),
        })
    );

    await renderComponent(<EventsTable eventsData={evtData} />, root);

    expect(container.innerHTML).not.toContain('<p>Hi</p>');
    expect(container.innerHTML).toContain('<p>Bye</p>');
    expect(container.innerHTML).not.toContain('Error message');
});
