/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import { ImportExport } from '@mui/icons-material';
import { fetchTaskManagerManualExport } from '../utils/rest-api';
import { FormattedMessage } from 'react-intl';

function isDisabled(taskStatus) {
    return taskStatus !== 'SUCCESS' && taskStatus !== 'ERROR';
}

const style = {
    exportButtonStyle: {
        marginLeft: '3px',
        marginRight: '3px',
    },
};

export function ManualExportButton({ status, timestamp }) {
    const [disabled, setDisabled] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const manualExportTask = useCallback(
        async function () {
            setDisabled(true);
            handleClose();
            await fetchTaskManagerManualExport(timestamp);
            setDisabled(false);
        },
        [timestamp]
    );

    return (
        <>
            <Button
                color="primary"
                data-test="mannual-export-button"
                size="large"
                variant="contained"
                disabled={disabled || isDisabled(status)}
                onClick={handleClickOpen}
                sx={style.exportButtonStyle}
            >
                <ImportExport />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>
                        <FormattedMessage id="manualExportAlertMessage" />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={manualExportTask}
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
