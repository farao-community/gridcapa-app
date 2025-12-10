/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@mui/material';
import dateFormat from 'dateformat';
import {
    fetchJobLauncherPost,
    fetchBusinessDateData,
    fetchProcessParameters,
} from '../utils/rest-api';
import {
    connectTaskNotificationWebSocket,
    disconnectTaskNotificationWebSocket,
} from '../utils/websocket-api';
import { useSnackbar } from 'notistack';
import { useIntlRef } from '../utils/messages';
import { FormattedMessage } from 'react-intl';
import TimestampParametersDialog from './dialogs/timestamp-parameters-dialog';

function isDisabled(taskArray) {
    if (taskArray && taskArray.length > 0) {
        return taskArray.every((task) => isDisabledTask(task.status));
    } else {
        return true;
    }
}

function isDisabledTask(taskStatus) {
    return (
        taskStatus !== 'READY' &&
        taskStatus !== 'SUCCESS' &&
        taskStatus !== 'INTERRUPTED' &&
        taskStatus !== 'ERROR'
    );
}

export function RunAllButton({ timestamp }) {
    const { enqueueSnackbar } = useSnackbar();
    const intlRef = useIntlRef();
    const [tasks, setTasks] = useState([]);
    const [runButtonDisabled, setRunButtonDisabled] = useState(false);
    const [currentTimestamp, setCurrentTimestamp] = useState(timestamp);
    const [parametersEnabled, setParametersEnabled] = useState(false);
    const [isOnTheHourProcess, setOnTheHourProcess] = useState(false);
    const [parametersDialogOpen, setParametersDialogOpen] = useState(false);
    const [parameters, setParameters] = useState([]);
    const websockets = useRef([]);

    const fetchTasks = useCallback(async () => {
        let timestampMid =
            new Date(Date.parse(currentTimestamp)).getTime() +
            12 * 60 * 60 * 1000;
        let currentDate = dateFormat(timestampMid, 'yyyy-mm-dd');
        setTasks(
            await fetchBusinessDateData(currentDate, intlRef, enqueueSnackbar)
        );
    }, [enqueueSnackbar, intlRef, currentTimestamp]);

    useEffect(() => {
        console.log('Fetching process metadata...');
        fetch('process-metadata.json')
            .then((res) => res.json())
            .then((res) => {
                setParametersEnabled(res.parametersEnabled || false);
                setOnTheHourProcess(res.isOnTheHourProcess || false);
            });
    }, []);

    useEffect(() => {
        setCurrentTimestamp(timestamp);
        async function getBackendTasks() {
            let timestampMid =
                new Date(Date.parse(currentTimestamp)).getTime() +
                12 * 60 * 60 * 1000;
            let currentDate = dateFormat(timestampMid, 'yyyy-mm-dd');
            let backendTasks = await fetchBusinessDateData(
                currentDate,
                intlRef,
                enqueueSnackbar
            );
            setTasks(backendTasks);
        }
        getBackendTasks();
    }, [enqueueSnackbar, intlRef, timestamp, currentTimestamp]);

    const getListOfTopics = useCallback(() => {
        const refTimestamp = new Date(Date.parse(currentTimestamp));
        if (isOnTheHourProcess === true) {
            refTimestamp.setHours(0, 30, 0, 0);
        } else {
            refTimestamp.setHours(0, 30, 0, 0);
        }
        const timestampMin = refTimestamp.getTime();
        const timestampMax = refTimestamp.getTime() + 24 * 60 * 60 * 1000;
        return [
            '/task/update/' +
                new Date(timestampMin).toISOString().substr(0, 10),
            '/task/update/' +
                new Date(timestampMax).toISOString().substr(0, 10),
        ];
    }, [currentTimestamp, isOnTheHourProcess]);

    async function handleParametersDialogOpening() {
        const parameters = await fetchProcessParameters();
        setParameters(parameters);
        setParametersDialogOpen(true);
    }

    async function launchTaskWithoutParameters() {
        await fetchTasks();
        await Promise.all(
            tasks.map(async (task) => {
                if (!isDisabledTask(task.status)) {
                    await fetchJobLauncherPost(task.timestamp, []);
                }
            })
        );
        await fetchTasks();

        setRunButtonDisabled(false);
    }

    function onRunButtonClick() {
        setRunButtonDisabled(true);
        if (parametersEnabled) {
            handleParametersDialogOpening();
        } else {
            launchTaskWithoutParameters();
        }
    }

    async function launchTaskWithParameters() {
        fetchTasks();
        let launchErrors = [];
        await Promise.all(
            tasks.map(async (task) => {
                if (!isDisabledTask(task.status)) {
                    const res = await fetchJobLauncherPost(
                        task.timestamp,
                        parameters
                    );
                    if (
                        res?.status === undefined ||
                        res.status < 200 ||
                        res.status > 299
                    ) {
                        launchErrors.push(task.timestamp);
                    }
                }
            })
        );
        fetchTasks();
        handleParametersDialogClosing();
        if (launchErrors.length > 0) {
            throw new Error(launchErrors.join(', '));
        }
    }

    function handleParametersDialogClosing() {
        setParametersDialogOpen(false);
        setRunButtonDisabled(false);
    }

    useEffect(() => {
        if (websockets.current.length === 0) {
            const taskNotificationClient = connectTaskNotificationWebSocket(
                getListOfTopics(),
                fetchTasks
            );
            websockets.current.push(taskNotificationClient);
        }

        // 👇️ The above function runs when the component unmounts 👇️
        return () => {
            websockets.current.forEach(disconnectTaskNotificationWebSocket);
            websockets.current = [];
        };
    }, [fetchTasks, getListOfTopics]);

    return (
        <>
            <Button
                data-test={'run-all-button-' + timestamp}
                variant="contained"
                size="large"
                disabled={runButtonDisabled || isDisabled(tasks)}
                onClick={onRunButtonClick}
                style={{ marginRight: '5px' }}
            >
                <FormattedMessage id="runBusinessDate" />
            </Button>
            <TimestampParametersDialog
                open={parametersDialogOpen}
                onClose={handleParametersDialogClosing}
                buttonAction={launchTaskWithParameters}
                parameters={parameters}
            />
        </>
    );
}
