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
    startOf2020IsoStr,
} from '../utils/test-utils.js';
import { connectTaskNotificationWebSocket } from '../utils/websocket-api.js';
import ProcessTimestampView from './process-timestamp-view.jsx';
import { fetchTimestampData } from '../utils/rest-api.js';
import { Client } from '@stomp/stompjs';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));
jest.mock('./table-core');
jest.mock('./table-header');
jest.mock('../utils/websocket-api', () => ({
    connectTaskNotificationWebSocket: jest.fn(),
    disconnectTaskNotificationWebSocket: jest.fn(),
}));
jest.mock('../utils/rest-api', () => ({
    fetchTimestampData: jest.fn(),
}));

it('renders process timestamp view', async () => {
    const client = new Client({
        brokerURL: 'aaaa',
        connectionTimeout: 3000,
        onConnect: () => {
            console.info('Connected task-notification Websocket with URL: ');
        },
        onStompError: (error) =>
            console.error(
                'Error occurred in task-notification Stomp with URL: '
            ),
        onWebSocketError: (error) =>
            console.error(
                'Error occurred in task-notification Websocket with URL: '
            ),
    });

    connectTaskNotificationWebSocket.mockImplementation((a, b) => client);

    const refTimestamp = new Date();
    refTimestamp.setHours(0, 30, 0, 0);

    fetchTimestampData.mockImplementation((a, b, c) =>
        Promise.resolve([[{ timestamp: refTimestamp, processEvents: 'abc' }]])
    );

    await renderComponent(
        <ProcessTimestampView
            processName="VALID"
            timestamp={refTimestamp}
            onTimestampChange={jest.fn()}
        />,
        root
    );

    expect(container.innerHTML).toContain('MuiGrid');
});
