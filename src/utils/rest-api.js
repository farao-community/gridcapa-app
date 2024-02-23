/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { APP_NAME, getAppName } from './config-params';
import { store } from '../redux/store';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { displayErrorMessageWithSnackbar } from './messages';

const PREFIX_CONFIG_QUERIES = '/config';
const PREFIX_CONFIG_NOTIFICATION_WS = '/config-notification';
const PREFIX_TASK_QUERIES = '/task-manager/tasks';
const PREFIX_TASK_NOTIFICATION_WS = '/task-notification/tasks/notify';
const PREFIX_JOB_LAUNCHER_QUERIES = '/gridcapa-job-launcher/start/';
const PREFIX_INTERRUPT_PROCESS_QUERIES = '/gridcapa-job-launcher/stop/';
const PREFIX_PARAMETERS_QUERIES = '/task-manager/parameters';

function getToken() {
    const state = store.getState();
    return state.user.id_token;
}

function removeTrailingSlash(aString) {
    return aString.replace(/\/$/, '');
}

const wsOptions = {
    minReconnectionDelay: 1000,
    connectionTimeout: 500,
    maxRetries: 10,
};

export function connectNotificationsWsUpdateConfig() {
    const webSocketBaseUrl = getBaseUrl()
        .replace(/^http:\/\//, 'ws://')
        .replace(/^https:\/\//, 'wss://');
    const webSocketUrl =
        webSocketBaseUrl +
        PREFIX_CONFIG_NOTIFICATION_WS +
        '/notify?appName=' +
        APP_NAME;

    let webSocketUrlWithToken = webSocketUrl + '&access_token=' + getToken();

    const reconnectingWebSocket = new ReconnectingWebSocket(
        webSocketUrlWithToken,
        null,
        wsOptions
    );
    reconnectingWebSocket.onopen = function () {
        console.info(
            'Connected Websocket update config ui ' + webSocketUrl + ' ...'
        );
    };
    return reconnectingWebSocket;
}

export function getWebSocketUrl(type) {
    let webSocketBaseUrl = getBaseUrl();
    let prefixConfig = '';
    switch (type) {
        case 'config':
            webSocketBaseUrl = webSocketBaseUrl
                .replace(/^http:\/\//, 'ws://')
                .replace(/^https:\/\//, 'wss://');
            prefixConfig =
                PREFIX_CONFIG_NOTIFICATION_WS +
                '/notify?appName=' +
                APP_NAME +
                '&access_token=' +
                getToken();
            break;
        case 'task':
            prefixConfig =
                PREFIX_TASK_NOTIFICATION_WS + '?access_token=' + getToken();
            break;
        default:
            console.err("Error don't know where to connect");
    }
    return webSocketBaseUrl + prefixConfig;
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

export function fetchFileToBackend(timestamp, formData) {
    backendFetch(
        getBaseUrl() + PREFIX_TASK_QUERIES + `/${timestamp}/uploadfile`,
        {
            method: 'POST',
            body: formData,
        }
    );
}

export function fetchAppsAndUrls() {
    console.info(`Fetching apps and urls...`);
    return fetch('env.json')
        .then((res) => res.json())
        .then((res) => {
            return backendFetch(
                removeTrailingSlash(res.appsMetadataServerUrl) +
                    '/apps-metadata.json'
            ).then((response) => {
                return response.json();
            });
        });
}

export function fetchVersionAndEnvironnement() {
    console.info(`Fetching env vars...`);
    return fetch('env.json')
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            return removeTrailingSlash(res.appVersionAndEnvironnement);
        });
}

export function fetchMinioStorageData() {
    console.info(`Fetching minio storage data...`);
    return fetch('env.json')
        .then((res) => res.json())
        .then((res) => {
            return backendFetch(
                removeTrailingSlash(res.appsMinioStorageServerUrl)
            ).then((response) => {
                return response.json();
            });
        });
}

export function fetchTimestampData(timestamp, intlRef, enqueueSnackbar) {
    console.info('Fetching task data for timestamp : ' + timestamp);
    const fetchParams = getBaseUrl() + PREFIX_TASK_QUERIES + `/${timestamp}`;
    console.log(fetchParams);
    return backendFetch(fetchParams)
        .then((response) =>
            response.ok
                ? response.json()
                : response.text().then((text) => Promise.reject(text))
        )
        .catch((errorMessage) =>
            displayErrorMessageWithSnackbar({
                errorMessage: errorMessage,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'taskRetrievingError',
                    intlRef: intlRef,
                },
            })
        );
}

export function fetchFileFromProcess(
    timestamp,
    type,
    intlRef,
    enqueueSnackbar
) {
    console.info('Fetching file ' + type + ' for timestamp : ' + timestamp);
    const fetchParams =
        getBaseUrl() + PREFIX_TASK_QUERIES + `/${timestamp}/file/${type}`;
    console.log(fetchParams);
    return backendFetch(fetchParams)
        .then((response) =>
            response.ok
                ? response.blob()
                : response.text().then((text) => Promise.reject(text))
        )
        .catch((errorMessage) =>
            displayErrorMessageWithSnackbar({
                errorMessage: errorMessage,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'taskRetrievingError',
                    intlRef: intlRef,
                },
            })
        );
}

export function fetchBusinessDateData(businessDate, intlRef, enqueueSnackbar) {
    console.info('Fetching tasks for date : ' + businessDate);
    const fetchParams =
        getBaseUrl() +
        PREFIX_TASK_QUERIES +
        '/businessdate' +
        `/${businessDate}`;
    console.log(fetchParams);
    return backendFetch(fetchParams)
        .then((response) =>
            response.ok
                ? response.json()
                : response.text().then((text) => Promise.reject(text))
        )
        .catch((errorMessage) =>
            displayErrorMessageWithSnackbar({
                errorMessage: errorMessage,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'taskRetrievingError',
                    intlRef: intlRef,
                },
            })
        );
}

export function fetchRunningTasksData(intlRef, enqueueSnackbar) {
    console.info('Fetching all running tasks');
    const fetchParams = getBaseUrl() + PREFIX_TASK_QUERIES + '/runningtasks';
    console.log(fetchParams);
    return backendFetch(fetchParams)
        .then((response) =>
            response.ok
                ? response.json()
                : response.text().then((text) => Promise.reject(text))
        )
        .then((result) => {
            return result;
        })
        .catch((errorMessage) =>
            displayErrorMessageWithSnackbar({
                errorMessage: errorMessage,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'taskRetrievingError',
                    intlRef: intlRef,
                },
            })
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

export async function fetchJobLauncherPost(taskTimestamp, parameters) {
    console.log('Fetching job launcher for task:' + taskTimestamp);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parameters),
    };
    return backendFetch(
        getBaseUrl() + PREFIX_JOB_LAUNCHER_QUERIES + taskTimestamp,
        requestOptions
    );
}

export function fetchJobLauncherToInterruptTask(taskTimestamp) {
    console.log('Fetching job launcher for task:' + taskTimestamp);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    backendFetch(
        getBaseUrl() + PREFIX_INTERRUPT_PROCESS_QUERIES + taskTimestamp,
        requestOptions
    ).then();
}

export function fetchTaskManagerManualExport(taskTimestamp) {
    console.log('Requesting export for task: ' + taskTimestamp);
    const requestOptions = {
        method: 'POST',
    };

    backendFetch(
        getBaseUrl() + PREFIX_TASK_QUERIES + '/' + taskTimestamp + '/export',
        requestOptions
    );
}

export function fetchProcessParameters() {
    console.log('Requesting process parameters');
    const requestOptions = {
        method: 'GET',
    };

    const parameters = backendFetch(
        getBaseUrl() + PREFIX_PARAMETERS_QUERIES,
        requestOptions
    ).then((response) => response.json());

    return parameters;
}

export function updateProcessParameters(parameters, intlRef, enqueueSnackbar) {
    console.log('Updating process parameters');
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parameters),
    };

    const updatedParameters = backendFetch(
        getBaseUrl() + PREFIX_PARAMETERS_QUERIES,
        requestOptions
    )
        .then((response) =>
            response.ok
                ? response.json()
                : response.text().then((text) => Promise.reject(text))
        )
        .catch((errorMessage) => {
            displayErrorMessageWithSnackbar({
                errorMessage: errorMessage,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'parametersUpdateError',
                    intlRef: intlRef,
                },
            });
            return Promise.reject(errorMessage);
        });

    return updatedParameters;
}

export function getBaseUrl() {
    let baseUrl = document.baseURI;
    if (process.env.REACT_APP_PROFILE === 'development') {
        baseUrl = process.env.REACT_APP_PUBLIC_URL;
    }
    return removeTrailingSlash(baseUrl);
}
