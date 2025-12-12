/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import App from './app';
import {
    cleanUpOnExit,
    mockWebSocketClient,
    renderComponent,
    setupTestContainer,
} from '../utils/test-utils.js';
import {
    connectTaskNotificationWebSocket,
    connectUiConfigNotificationWebsocket,
} from '../utils/websocket-api.js';
import { fetchConfigParameters } from '../utils/rest-api.js';
import { store } from '../redux/store.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));
jest.mock('../utils/websocket-api', () => ({
    connectTaskNotificationWebSocket: jest.fn(),
    connectUiConfigNotificationWebsocket: jest.fn(),
}));
jest.mock('../utils/rest-api', () => ({
    fetchConfigParameter: jest.fn(),
    fetchConfigParameters: jest.fn(),
    fetchIdpSettings: jest.fn(),
}));
jest.mock('./app-top-bar');
jest.mock('./gridcapa-main');

it('renders GridCapa App', async () => {
    connectTaskNotificationWebSocket.mockImplementation((a, b) =>
        mockWebSocketClient()
    );

    connectUiConfigNotificationWebsocket.mockImplementation(() =>
        mockWebSocketClient()
    );

    fetchConfigParameters.mockImplementation((a) =>
        Promise.resolve([
            { name: 'theme', value: 'light' },
            { name: 'language', value: 'Greek' },
        ])
    );

    store.dispatch({
        type: 'USER',
        user: 'CORESO',
    });

    await renderComponent(<App />, root);
    expect(connectUiConfigNotificationWebsocket).toHaveBeenCalled();
    expect(container.innerHTML).not.toContain('connection');
    expect(container.innerHTML).not.toContain('Error message');
});
