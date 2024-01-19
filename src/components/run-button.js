/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button, CircularProgress } from '@mui/material';
import {
    fetchJobLauncherPost,
    fetchProcessParameters,
} from '../utils/rest-api';
import { PlayArrow } from '@mui/icons-material';
import TimestampParametersModal from './modal/timestamp-parameters-modal';

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
    const [parametersModalOpen, setParmetersModalOpen] = useState(false);
    const [parameters, setParameters] = useState([]);

    const handleParametersModalOpening = useCallback(async function () {
        return fetchProcessParameters()
            .then(setParameters)
            .then(() => setParmetersModalOpen(true));
    }, []);

    const launchTaskWithoutParameters = useCallback(async function () {
        await fetchJobLauncherPost(timestamp, []);
        setRunButtonDisabled(false);
    }, [timestamp]);

    const onRunButtonClick = useCallback(
        async function () {
            setRunButtonDisabled(true);
            if (parametersEnabled) {
                handleParametersModalOpening();
            } else {
                await launchTaskWithoutParameters();
            }
        },
        [
            handleParametersModalOpening,
            launchTaskWithoutParameters,
            parametersEnabled,
        ]
    );

    function launchTaskWithParameters() {
        fetchJobLauncherPost(timestamp, parameters);
        closeModal();
    }

    function closeModal() {
        setParmetersModalOpen(false);
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
            <TimestampParametersModal
                open={parametersModalOpen}
                onClose={closeModal}
                buttonAction={launchTaskWithParameters}
                parameters={parameters}
            />
        </>
    );
}
