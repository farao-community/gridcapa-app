/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ReconnectingWebSocket from 'reconnecting-websocket';
import { APP_NAME } from './config-params';
import { getBaseUrl } from './rest-api';
import { store } from '../redux/store';
import { Client } from '@stomp/stompjs';

const PREFIX_CONFIG_NOTIFICATION_WS = '/config-notification';
const PREFIX_TASK_NOTIFICATION_WS = '/task-notification/ws/tasks/notify';

function getToken() {
    const state = store.getState();
    return state.user?.id_token;
}

function getWebSocketBaseUrl() {
    return getBaseUrl()
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
}

export function connectUiConfigNotificationWebsocket() {
    const wsOptions = {
        minReconnectionDelay: 1000,
        connectionTimeout: 500,
        maxRetries: 10,
    };

    const webSocketUrl =
        getWebSocketBaseUrl() +
        PREFIX_CONFIG_NOTIFICATION_WS +
        '/notify?appName=' +
        APP_NAME;

    const webSocketUrlWithToken = webSocketUrl + '&access_token=' + getToken();

    const reconnectingWebSocket = new ReconnectingWebSocket(
        webSocketUrlWithToken,
        null,
        wsOptions
    );
    reconnectingWebSocket.onopen = function () {
        console.info(
            'Connected UI config notification Websocket with URL: ' +
                webSocketUrl
        );
    };
    return reconnectingWebSocket;
}

export function connectTaskNotificationWebSocket(topics, onMessage) {
    const handleMessage = (message) => {
        if (message?.body) {
            return onMessage(JSON.parse(message?.body));
        }
    };

    const webSocketUrl = getWebSocketBaseUrl() + PREFIX_TASK_NOTIFICATION_WS;
    const webSocketUrlWithToken = webSocketUrl + '?access_token=' + getToken();

    const client = new Client({
        brokerURL: webSocketUrlWithToken,
        connectionTimeout: 3000,
        onConnect: () => {
            console.info(
                'Connected task-notification Websocket with URL: ' +
                    webSocketUrl
            );
            topics.forEach((topic) => {
                client.subscribe(topic, handleMessage);
            });
        },
        onStompError: (error) =>
            console.error(
                'Error occurred in task-notification Stomp with URL: ' +
                    webSocketUrl +
                    ' and topics: ' +
                    topics,
                error
            ),
        onWebSocketError: (error) =>
            console.error(
                'Error occurred in task-notification Websocket with URL: ' +
                    webSocketUrl +
                    ' and topics: ' +
                    topics,
                error
            ),
    });

    client.activate();

    return client;
}

export function addWebSocket(websockets, events, eventHandler) {
    const eventNotificationClient = connectTaskNotificationWebSocket(events, eventHandler);
    websockets.current.push(eventNotificationClient);
}

export function disconnect(websockets){
    websockets.current.forEach(disconnectTaskNotificationWebSocket);
    websockets.current = [];
}

export function disconnectTaskNotificationWebSocket(client) {
    client.deactivate();
}
