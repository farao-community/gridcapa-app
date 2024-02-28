/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';

import PropTypes from 'prop-types';

import ParametersDialogContent, {
    REFERENCE_PROCESS,
} from './parameters-dialog-content';
import ParametersConfirmClosingDialog from './parameters-confirm-closing-dialog';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';

const style = {
    dialogTitleStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};

function TimestampParametersDialog({
    open,
    onClose,
    parameters,
    buttonAction,
}) {
    const [parametersChanged, setParametersChanged] = useState(false);
    const [
        showClosingConfirmationDialog,
        setShowClosingConfirmationDialog,
    ] = useState(false);

    function checkBeforeClose() {
        parametersChanged ? setShowClosingConfirmationDialog(true) : onClose();
    }

    function handleButtonAction() {
        buttonAction()
            .then(() => setParametersChanged(false))
            .catch((errorMessage) => console.error(errorMessage));
    }

    function handleConfirmClosing() {
        onClose();
        setParametersChanged(false);
    }

    function handleInnerDialogClosing() {
        setShowClosingConfirmationDialog(false);
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={checkBeforeClose}
                maxWidth="md"
                fullWidth="true"
            >
                <DialogTitle sx={style.dialogTitleStyle}>
                    <FormattedMessage id="timestampParameters" />
                    <Button onClick={checkBeforeClose}>
                        <Close />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <ParametersDialogContent
                            parameters={parameters}
                            setParametersChanged={setParametersChanged}
                            reference={REFERENCE_PROCESS}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleButtonAction}
                    >
                        <FormattedMessage id="runButtonLabel" />
                    </Button>
                </DialogActions>
            </Dialog>

            <ParametersConfirmClosingDialog
                open={showClosingConfirmationDialog}
                onClickYes={handleConfirmClosing}
                closeDialog={handleInnerDialogClosing}
            ></ParametersConfirmClosingDialog>
        </>
    );
}

TimestampParametersDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    parameters: PropTypes.array.isRequired,
    buttonAction: PropTypes.func.isRequired,
};

export default TimestampParametersDialog;
