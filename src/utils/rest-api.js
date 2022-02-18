/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { APP_NAME, getAppName } from './config-params';
import { store } from '../redux/store';
import ReconnectingWebSocket from 'reconnecting-websocket';

const PREFIX_CONFIG_QUERIES = '/config';
const PREFIX_CONFIG_NOTIFICATION_WS = '/config-notification';
const PREFIX_TASK_QUERIES = '/task-manager/tasks';
const PREFIX_TASK_NOTIFICATION_WS = '/task-notification';
const PREFIX_JOB_LAUNCHER_QUERIES = '/gridcapa-job-launcher/start/';

function getToken() {
    const state = store.getState();
    return state.user.id_token;
}

export function connectNotificationsWsUpdateConfig() {
    const webSocketBaseUrl = getBaseUrl()
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
    const webSocketUrl =
        webSocketBaseUrl +
        PREFIX_CONFIG_NOTIFICATION_WS +
        '/notify?appName=' +
        APP_NAME;

    let webSocketUrlWithToken;
    webSocketUrlWithToken = webSocketUrl + '&access_token=' + getToken();

    const reconnectingWebSocket = new ReconnectingWebSocket(
        webSocketUrlWithToken
    );
    reconnectingWebSocket.onopen = function () {
        console.info(
            'Connected Websocket update config ui ' + webSocketUrl + ' ...'
        );
    };
    return reconnectingWebSocket;
}

export function connectNotificationsWsUpdateTask() {
    const webSocketBaseUrl = getBaseUrl()
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
    const webSocketUrl =
        webSocketBaseUrl + PREFIX_TASK_NOTIFICATION_WS + '/websocket';

    const reconnectingWebSocket = new ReconnectingWebSocket(webSocketUrl);
    reconnectingWebSocket.onopen = function () {
        console.info(
            'Connected Websocket update task ui ' + webSocketUrl + ' ...'
        );
    };
    return reconnectingWebSocket;
}

function backendFetch(url, init) {
    if (!(typeof init == 'undefined' || typeof init == 'object')) {
        throw new TypeError(
            'Argument 2 of backendFetch is not an object' + typeof init
        );
    }
    const initCopy = Object.assign({}, init);
    initCopy.headers = new Headers(initCopy.headers || {});
    initCopy.headers.append('Authorization', 'Bearer ' + getToken());

    return fetch(url, initCopy);
}

export function fetchAppsAndUrls() {
    console.info(`Fetching apps and urls...`);
    return fetch('env.json')
        .then((res) => res.json())
        .then((res) => {
            return fetch(
                res.appsMetadataServerUrl + '/apps-metadata.json'
            ).then((response) => {
                return response.json();
            });
        });
}

export function fetchTimestampData(timestamp) {
    console.info('Fetching task data for timestamp : ' + timestamp);
    const fetchParams = getBaseUrl() + PREFIX_TASK_QUERIES + `/${timestamp}`;
    console.log(fetchParams);
    return backendFetch(fetchParams).then((response) =>
        response.ok
            ? response.json()
            : response.text().then((text) => Promise.reject(text))
    );
}

export function fetchBusinessDateData(businessDate) {
    console.info('Fetching tasks for date : ' + businessDate);
    const fetchParams = getBaseUrl() + PREFIX_TASK_QUERIES + '/businessdate' + `/${businessDate}`;
    console.log(fetchParams);
    return backendFetch(fetchParams).then((response) =>
        response.ok
            ? response.json()
            : response.text().then((text) => Promise.reject(text))
    );
}

export function fetchConfigParameters(appName) {
    console.info('Fetching UI configuration params for app : ' + appName);
    const fetchParams =
        getBaseUrl() +
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters`;
    return backendFetch(fetchParams).then((response) =>
        response.ok
            ? response.json()
            : response.text().then((text) => Promise.reject(text))
    );
}

export function fetchConfigParameter(name) {
    const appName = getAppName(name);
    console.info(
        "Fetching UI config parameter '%s' for app '%s' ",
        name,
        appName
    );
    const fetchParams =
        getBaseUrl() +
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters/${name}`;
    return backendFetch(fetchParams).then((response) =>
        response.ok
            ? response.json()
            : response.text().then((text) => Promise.reject(text))
    );
}

export function updateConfigParameter(name, value) {
    const appName = getAppName(name);
    console.info(
        "Updating config parameter '%s=%s' for app '%s' ",
        name,
        value,
        appName
    );
    const updateParams =
        getBaseUrl() +
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters/${name}?value=` +
        encodeURIComponent(value);
    return backendFetch(updateParams, { method: 'put' }).then((response) =>
        response.ok
            ? response
            : response.text().then((text) => Promise.reject(text))
    );
}

export function fetchJobLauncherPost(taskTimestamp) {
    console.log('Fetching job launcher for task:' + taskTimestamp);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };
    fetch(
        getBaseUrl() + PREFIX_JOB_LAUNCHER_QUERIES + taskTimestamp,
        requestOptions
    ).then();
}

function getBaseUrl() {
    let baseUrl = document.baseURI;
    if (process.env.REACT_APP_PROFILE === 'development') {
        baseUrl = process.env.REACT_APP_PUBLIC_URL;
    }
    return baseUrl;
}
