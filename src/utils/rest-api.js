/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getAppName } from './config-params';
import { store } from '../redux/store';
import { displayErrorMessageWithSnackbar } from './messages';

const PREFIX_CONFIG_QUERIES = '/config';
const PREFIX_TASK_QUERIES = '/task-manager/tasks';
const PREFIX_JOB_LAUNCHER_QUERIES = '/gridcapa-job-launcher/start/';
const PREFIX_INTERRUPT_PROCESS_QUERIES = '/gridcapa-job-launcher/stop/';
const PREFIX_PARAMETERS_QUERIES = '/task-manager/parameters';

function getToken() {
    const state = store.getState();
    return state.user?.id_token;
}

function removeTrailingSlash(aString) {
    return aString?.replace(/\/$/, '');
}

function backendFetch(url, init) {
    if (!(init === undefined || typeof init == 'object')) {
        throw new TypeError(
            'Argument 2 of backendFetch is not an object' + typeof init
        );
    }
    const initCopy = { ...init };
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

export function fetchIdpSettings() {
    return fetch('idpSettings.json').then((res) => res.json());
}

export function fetchAppsAndUrls() {
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
    return fetch('env.json')
        .then((res) => res.json())
        .then((res) => {
            return removeTrailingSlash(res.appVersionAndEnvironnement);
        });
}

export function fetchMinioStorageData() {
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
    const fetchParams = getBaseUrl() + PREFIX_TASK_QUERIES + `/${timestamp}`;
    return backendFetch(fetchParams)
        .then((response) =>
            response.ok ? response.json() : response.text().then(throwError)
        )
        .catch((error) =>
            displayErrorMessageWithSnackbar({
                errorMessage: error.message,
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
    const fetchParams =
        getBaseUrl() + PREFIX_TASK_QUERIES + `/${timestamp}/file/${type}`;
    return backendFetch(fetchParams)
        .then((response) =>
            response.ok ? response.blob() : response.text().then(throwError)
        )
        .catch((error) =>
            displayErrorMessageWithSnackbar({
                errorMessage: error.message,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'taskRetrievingError',
                    intlRef: intlRef,
                },
            })
        );
}

export function fetchBusinessDateData(businessDate, intlRef, enqueueSnackbar) {
    const fetchParams =
        getBaseUrl() +
        PREFIX_TASK_QUERIES +
        '/businessdate' +
        `/${businessDate}`;
    return backendFetch(fetchParams)
        .then((response) =>
            response.ok ? response.json() : response.text().then(throwError)
        )
        .catch((error) =>
            displayErrorMessageWithSnackbar({
                errorMessage: error.message,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'taskRetrievingError',
                    intlRef: intlRef,
                },
            })
        );
}

function throwError(message) {
    throw new Error(message);
}

export function fetchRunningTasksData(intlRef, enqueueSnackbar) {
    const fetchParams = getBaseUrl() + PREFIX_TASK_QUERIES + '/runningtasks';
    return backendFetch(fetchParams)
        .then((response) =>
            response.ok ? response.json() : response.text().then(throwError)
        )
        .then((result) => {
            return result;
        })
        .catch((error) =>
            displayErrorMessageWithSnackbar({
                errorMessage: error.message,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'taskRetrievingError',
                    intlRef: intlRef,
                },
            })
        );
}

export function fetchConfigParameters(appName) {
    const fetchParams =
        getBaseUrl() +
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters`;
    return backendFetch(fetchParams).then((response) =>
        response.ok ? response.json() : response.text().then(throwError)
    );
}

export function fetchConfigParameter(name) {
    const appName = getAppName(name);
    const fetchParams =
        getBaseUrl() +
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters/${name}`;
    return backendFetch(fetchParams).then((response) =>
        response.ok ? response.json() : response.text().then(throwError)
    );
}

export function updateConfigParameter(name, value) {
    const appName = getAppName(name);
    const updateParams =
        getBaseUrl() +
        PREFIX_CONFIG_QUERIES +
        `/v1/applications/${appName}/parameters/${name}?value=` +
        encodeURIComponent(value);
    return backendFetch(updateParams, { method: 'put' }).then((response) =>
        response.ok ? response : response.text().then(throwError)
    );
}

export function fetchJobLauncherPost(taskTimestamp, parameters) {
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

export function fetchJobLauncherToInterruptTask(taskTimestamp, runId) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    };

    return backendFetch(
        getBaseUrl() +
            PREFIX_INTERRUPT_PROCESS_QUERIES +
            taskTimestamp +
            '/' +
            runId,
        requestOptions
    );
}

export function fetchTaskManagerSelectFile(timestamp, type, filename) {
    const requestOptions = {
        method: 'put',
    };

    return backendFetch(
        getBaseUrl() +
            PREFIX_TASK_QUERIES +
            '/' +
            timestamp +
            '/input/' +
            type +
            '?filename=' +
            filename,
        requestOptions
    );
}

export function fetchTaskManagerManualExport(taskTimestamp) {
    const requestOptions = {
        method: 'POST',
    };

    return backendFetch(
        getBaseUrl() + PREFIX_TASK_QUERIES + '/' + taskTimestamp + '/export',
        requestOptions
    );
}

export function fetchProcessParameters() {
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
            response.ok ? response.json() : response.text().then(throwError)
        )
        .catch((error) => {
            displayErrorMessageWithSnackbar({
                errorMessage: error.message,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'parametersUpdateError',
                    intlRef: intlRef,
                },
            });
            return Promise.reject(error);
        });

    return updatedParameters;
}

export function getBaseUrl() {
    let baseUrl = document.baseURI;
    if (import.meta.env.MODE === 'development') {
        baseUrl = import.meta.env.VITE_PUBLIC_URL;
    }
    return removeTrailingSlash(baseUrl);
}
