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
import { connectTaskNotificationWebSocket } from '../utils/websocket-api.js';
import ProcessTimestampView from './process-timestamp-view.jsx';
import { fetchTimestampData } from '../utils/rest-api.js';

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
    connectTaskNotificationWebSocket.mockImplementation((a, b) =>
        mockWebSocketClient()
    );

    const refTimestamp = new Date();
    refTimestamp.setHours(0, 30, 0, 0);

    fetchTimestampData.mockImplementation((a, b, c) =>
        Promise.resolve([[{ timestamp: refTimestamp, processEvents: ['abc'] }]])
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
    expect(container.innerHTML).not.toContain('Error message');
});
