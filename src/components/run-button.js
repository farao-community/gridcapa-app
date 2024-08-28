/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';

import { Button, CircularProgress } from '@mui/material';
import {
    fetchJobLauncherPost,
    fetchProcessParameters,
} from '../utils/rest-api';
import { PlayArrow } from '@mui/icons-material';
import TimestampParametersDialog from './dialogs/timestamp-parameters-dialog';

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

const style = {
    runButtonStyle: {
        marginLeft: '3px',
        marginRight: '3px',
    },
};

export function RunButton({ status, timestamp }) {
    const [runButtonDisabled, setRunButtonDisabled] = useState(false);
    const [parametersEnabled, setParametersEnabled] = useState(false);
    const [parametersDialogOpen, setParametersDialogOpen] = useState(false);
    const [parameters, setParameters] = useState([]);

    async function handleParametersDialogOpening() {
        const parameters = await fetchProcessParameters();
        setParameters(parameters);
        setParametersDialogOpen(true);
    }

    async function launchTaskWithoutParameters() {
        await fetchJobLauncherPost(timestamp, []);
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
        const res = await fetchJobLauncherPost(timestamp, parameters);
        handleParametersDialogClosing();
        if (res?.status === undefined || res.status < 200 || res.status > 299) {
            throw new Error(res?.statusText);
        }
    }

    function handleParametersDialogClosing() {
        setParametersDialogOpen(false);
        setRunButtonDisabled(false);
    }

    useEffect(() => {
        console.log('Fetching process metadata...');
        fetch('process-metadata.json')
            .then((res) => res.json())
            .then((res) => {
                setParametersEnabled(res.parametersEnabled || false);
            });
    }, []);

    return (
        <>
            {!isRunning(status) && (
                <Button
                    color="primary"
                    data-test={'run-button-' + Date.parse(timestamp)}
                    variant="contained"
                    size="large"
                    disabled={runButtonDisabled || isDisabled(status)}
                    onClick={onRunButtonClick}
                    sx={style.runButtonStyle}
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
            <TimestampParametersDialog
                open={parametersDialogOpen}
                onClose={handleParametersDialogClosing}
                buttonAction={launchTaskWithParameters}
                parameters={parameters}
            />
        </>
    );
}

RunButton.propTypes = {
    status: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
};
