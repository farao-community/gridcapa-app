/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import {
    displayErrorMessageWithSnackbar,
    useIntlRef,
} from '../../utils/messages';

import PropTypes from 'prop-types';

import ParametersDialogContent, {
    REFERENCE_PROCESS,
} from './parameters-dialog-content';
import ParametersConfirmClosingDialog from './parameters-confirm-closing-dialog';

import {
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
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
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();
    const [parametersChanged, setParametersChanged] = useState(false);
    const [runButtonDisabled, setRunButtonDisabled] = useState(false);
    const [showClosingConfirmationDialog, setShowClosingConfirmationDialog] =
        useState(false);

    function checkBeforeClose() {
        parametersChanged ? setShowClosingConfirmationDialog(true) : onClose();
    }

    function handleButtonAction() {
        setRunButtonDisabled(true);
        buttonAction()
            .then(() => {
                setParametersChanged(false);
                setRunButtonDisabled(false);
            })
            .catch((errorMessage) => {
                displayErrorMessageWithSnackbar({
                    errorMessage: errorMessage,
                    enqueueSnackbar: enqueueSnackbar,
                    headerMessage: {
                        headerMessageId: 'computationLaunchError',
                        intlRef: intlRef,
                    },
                });
                console.error(errorMessage);
                setRunButtonDisabled(false);
            });
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
                fullWidth
            >
                <DialogTitle sx={style.dialogTitleStyle}>
                    <FormattedMessage id="timestampParameters" />
                    <Button onClick={checkBeforeClose}>
                        <Close />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <ParametersDialogContent
                        parameters={parameters}
                        setParametersChanged={setParametersChanged}
                        reference={REFERENCE_PROCESS}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={runButtonDisabled}
                        onClick={handleButtonAction}
                    >
                        {!runButtonDisabled && (
                            <FormattedMessage id="runButtonLabel" />
                        )}
                        {runButtonDisabled && (
                            <CircularProgress
                                size="24px"
                                style={{ margin: 'auto' }}
                            />
                        )}
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
