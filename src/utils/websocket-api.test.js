/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    connectTaskNotificationWebSocket,
    connectUiConfigNotificationWebsocket,
    disconnectTaskNotificationWebSocket,
} from './websocket-api.js';

it('should init websockets', async () => {
    let res;
    expect(() => (res = connectUiConfigNotificationWebsocket())).not.toThrow();
    console.info = jest.fn();
    res.onopen();
    expect(console.info).toHaveBeenCalled();
});

it('should connect to topic', async () => {
    let res;
    expect(
        () => (res = connectTaskNotificationWebSocket(['a', 'b'], jest.fn()))
    ).not.toThrow();

    console.info = jest.fn();
    res.subscribe = jest.fn();

    res.onConnect();
    expect(console.info).toHaveBeenCalled();
    expect(res.subscribe).toHaveBeenCalled();

    console.error = jest.fn();

    res.onStompError('a');
    res.onWebSocketError('b');
    expect(console.error).toHaveBeenCalledTimes(2);
});

it('should disconnect client', async () => {
    const client = { deactivate: jest.fn() };
    disconnectTaskNotificationWebSocket(client);
    expect(client.deactivate).toHaveBeenCalled();
});
