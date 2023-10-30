/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useCallback } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { fetchJobLauncherPost } from '../utils/rest-api';
import { PlayArrow } from '@mui/icons-material';

function isDisabled(taskStatus) {
    return (
        taskStatus !== 'READY' &&
        taskStatus !== 'SUCCESS' &&
        taskStatus !== 'INTERRUPTED' &&
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

    const style = {
        exportButtonStyle: {
            marginLeft: '3px',
            marginRight: '3px',
        },
    };

    return (
        <>
            {!isRunning(status) && (
                <Button
                    color="primary"
                    data-test={'run-button-' + Date.parse(timestamp)}
                    variant="contained"
                    size="large"
                    disabled={disabled || isDisabled(status)}
                    onClick={launchTask}
                    sx={style.exportButtonStyle}
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
        </>
    );
}
