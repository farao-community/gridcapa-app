/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import { Stop } from '@mui/icons-material';
import { fetchJobLauncherToInterruptTask } from '../utils/rest-api';
import { FormattedMessage } from 'react-intl';

function isDisabled(taskStatus) {
    return taskStatus !== 'RUNNING' && taskStatus !== 'INTERRUPTED';
}

const style = {
    stopButtonStyle: {
        marginLeft: '3px',
        marginRight: '3px',
    },
};

export function StopButton({ status, timestamp, runId }) {
    const [disabled, setDisabled] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const stopTask = useCallback(
        async function () {
            setDisabled(true);
            handleClose();
            await fetchJobLauncherToInterruptTask(timestamp, runId);
            setDisabled(false);
        },
        [timestamp, runId]
    );

    return (
        <>
            <Button
                color="primary"
                data-test="stop-button"
                size="large"
                variant="contained"
                disabled={disabled || isDisabled(status)}
                onClick={handleClickOpen}
                sx={style.stopButtonStyle}
            >
                <Stop />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>
                        <FormattedMessage id="interruptionProcessAlertMessage" />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={stopTask}
                        color="primary"
                        data-test="yes-button"
                    >
                        <FormattedMessage id="yes" />
                    </Button>
                    <Button
                        onClick={handleClose}
                        color="primary"
                        data-test="cancel-button"
                    >
                        <FormattedMessage id="cancel" />
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
