/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useCallback } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { fetchJobLauncherPost } from '../utils/rest-api';
import { PlayArrow } from '@material-ui/icons';

function isDisabled(taskStatus) {
    return (
        taskStatus !== 'READY' &&
        taskStatus !== 'SUCCESS' &&
        taskStatus !== 'ERROR'
    );
}

function isRunning(taskStatus) {
    return taskStatus && (taskStatus === 'RUNNING' || taskStatus === 'PENDING');
}

export function RunButton({ status, timestamp }) {
    const [disabled, setDisabled] = useState(false);

    const launchTask = useCallback(
        async function () {
            setDisabled(true);
            await fetchJobLauncherPost(timestamp);
            setDisabled(false);
        },
        [timestamp]
    );

    return (
        <span>
            {!isRunning(status) && (
                <Button
                    color="primary"
                    data-test="run-button"
                    variant="contained"
                    size="large"
                    disabled={disabled || isDisabled(status)}
                    onClick={launchTask}
                    style={{ marginRight: '5px' }}
                >
                    <PlayArrow />
                </Button>
            )}
            {isRunning(status) && (
                <CircularProgress
                    size="24px"
                    style={{ marginTop: '5px', marginLeft: '22px' }}
                />
            )}
        </span>
    );
}
