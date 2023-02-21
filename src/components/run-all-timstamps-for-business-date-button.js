/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import dateFormat from 'dateformat';
import {
    getWebSocketUrl,
    fetchJobLauncherPost,
    fetchBusinessDateData,
} from '../utils/rest-api';
import { useSnackbar } from 'notistack';
import { useIntlRef } from '../utils/messages';
import SockJsClient from 'react-stomp';
import { FormattedMessage } from 'react-intl';

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
    const refTimestamp = new Date(Date.parse(timestamp));
    refTimestamp.setHours(0, 30, 0, 0);
    const timestampMin = refTimestamp.getTime();
    const timestampMax = refTimestamp.getTime() + 24 * 60 * 60 * 1000;
    const [tasks, setTasks] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [currentTimestamp, setCurrentTimestamp] = useState(timestamp);

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

    const launchTask = useCallback(
        function () {
            setDisabled(true);
            fetchTasks();
            tasks.forEach(async (task) => {
                if (!isDisabledTask(task.status))
                    await fetchJobLauncherPost(task.timestamp);
            });
            fetchTasks();
            setDisabled(false);
        },
        [tasks, fetchTasks]
    );

    const getListOfTopics = () => {
        return [
            '/task/update/' +
                new Date(timestampMin).toISOString().substr(0, 10),
            '/task/update/' +
                new Date(timestampMax).toISOString().substr(0, 10),
        ];
    };

    return (
        <span>
            <SockJsClient
                url={getWebSocketUrl('task')}
                topics={getListOfTopics()}
                onMessage={fetchTasks}
            />
            <Button
                color="primary"
                data-test={'run-all-button-' + timestamp}
                variant="contained"
                size="large"
                disabled={disabled || isDisabled(tasks)}
                onClick={launchTask}
                style={{ marginRight: '5px' }}
            >
                <FormattedMessage id="runBusinessDate" />
            </Button>
        </span>
    );
}
