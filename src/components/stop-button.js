/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useState } from 'react';
import { fetchJobLauncherToInterruptTask } from '../utils/rest-api';
import { Button } from '@material-ui/core';
import { Stop } from '@material-ui/icons';
import { confirmAlert } from 'react-confirm-alert';

function isDisabled(taskStatus) {
    return taskStatus !== 'RUNNING';
}

export function StopButton({ status, timestamp }) {
    const [disabled, setDisabled] = useState(false);

    const stopTask = useCallback(
        async function () {
            setDisabled(true);
            await fetchJobLauncherToInterruptTask(timestamp);
            setDisabled(false);
        },
        [timestamp]
    );

    const submit = () => {
        confirmAlert({
            message: 'Do you want to stop the computation ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => stopTask(),
                },
                {
                    label: 'Cancel',
                },
            ],
        });
    };

    return (
        <Button
            color="primary"
            data-test="stop-button"
            size="large"
            variant="contained"
            disabled={disabled || isDisabled(status)}
            onClick={submit}
        >
            <Stop />
        </Button>
    );
}
