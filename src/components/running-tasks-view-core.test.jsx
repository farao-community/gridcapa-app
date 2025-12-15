/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    cleanUpOnExit,
    mockWebSocketClient,
    renderComponent,
    setupTestContainer,
} from '../utils/test-utils.js';
import RunningTasksViewCore from './running-tasks-view-core.jsx';
import { connectTaskNotificationWebSocket } from '../utils/websocket-api.js';
import {
    fetchRunningTasksData,
    fetchTimestampData,
} from '../utils/rest-api.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

jest.mock('../utils/rest-api', () => ({
    fetchRunningTasksData: jest.fn(),
    fetchTimestampData: jest.fn(),
}));
jest.mock('../utils/websocket-api', () => ({
    connectTaskNotificationWebSocket: jest.fn(),
    disconnectTaskNotificationWebSocket: jest.fn(),
}));

jest.mock('./filter-menu');
jest.mock('./running-tasks-view-core-row');
jest.mock('./dialogs/event-dialog');
jest.mock('./dialogs/file-dialog');

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () =>
            Promise.resolve({
                globalViewTimestampFilter: [
                    { defaultChecked: false, filterValue: 'a' },
                ],
            }),
        text: () => Promise.resolve('hello'),
    })
);

it('renders running tasks view core without new tasks and ws', async () => {
    const refTimestamp = new Date();
    refTimestamp.setHours(0, 30, 0, 0);
    fetchTimestampData.mockImplementation((a, b, c) =>
        Promise.resolve([[{ timestamp: refTimestamp, processEvents: ['abc'] }]])
    );

    fetchRunningTasksData.mockImplementation((a, b) => Promise.resolve([]));
    connectTaskNotificationWebSocket.mockImplementation((a, b) => null);

    await renderComponent(<RunningTasksViewCore />, root);

    expect(container.innerHTML).toContain('ArrowDropDownIcon');
    expect(container.innerHTML).not.toContain('Error message');
});

it('renders running tasks view core with new tasks and ws', async () => {
    const refTimestamp = new Date();
    refTimestamp.setHours(0, 30, 0, 0);
    fetchTimestampData.mockImplementation((a, b, c) =>
        Promise.resolve([[{ timestamp: refTimestamp, processEvents: ['abc'] }]])
    );
    const taskData = {
        inputs: [],
        outputs: [],
        status: 'RUNNING',
        timestamp: new Date(),
        runHistory: [
            { id: 'a', executionDate: 12 },
            { id: 'b', executionDate: 112 },
            { id: 'c', executionDate: 5 },
        ],
    };
    fetchRunningTasksData.mockImplementation((a, b) =>
        Promise.resolve([taskData])
    );

    connectTaskNotificationWebSocket.mockImplementation((a, b) =>
        mockWebSocketClient()
    );

    await renderComponent(<RunningTasksViewCore />, root);

    expect(container.innerHTML).toContain('ArrowDropDownIcon');
    expect(container.innerHTML).not.toContain('Error message');
});
