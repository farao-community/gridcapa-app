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
import GlobalViewCore from './global-view-core.jsx';
import {
    fetchBusinessDateData,
    fetchTimestampData,
} from '../utils/rest-api.js';
import { Client } from '@stomp/stompjs';
import { connectTaskNotificationWebSocket } from '../utils/websocket-api.js';

let container = null;
let root = null;
jest.mock('../utils/rest-api', () => ({
    fetchBusinessDateData: jest.fn(),
    fetchTimestampData: jest.fn(),
}));
jest.mock('../utils/websocket-api', () => ({
    connectTaskNotificationWebSocket: jest.fn(),
    disconnectTaskNotificationWebSocket: jest.fn(),
}));
jest.mock('./dialogs/event-dialog');
jest.mock('./dialogs/file-dialog');
jest.mock('./global-view-core-row');
jest.mock('./filter-menu');

beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders global view content', async () => {
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

    fetchBusinessDateData.mockImplementation((a, b, c) =>
        Promise.resolve([[{ timestamp: refTimestamp }]])
    );
    fetchTimestampData.mockImplementation((a, b, c) =>
        Promise.resolve([[{ timestamp: refTimestamp }]])
    );

    await renderComponent(
        <GlobalViewCore
            timestampMin={refTimestamp.getTime()}
            timestampMax={refTimestamp.getTime() + 24 * 60 * 60 * 1000}
            timestampStep={'01:00'}
        />,
        root
    );

    expect(container.innerHTML).toContain('globalViewCoreAction');
});
