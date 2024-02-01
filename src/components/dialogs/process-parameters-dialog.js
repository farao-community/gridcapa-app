/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';

import PropTypes from 'prop-types';

import ParametersDialogContent, {
    REFERENCE_DEFAULT,
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

function ProcessParametersDialog({ open, onClose, parameters, buttonAction }) {
    const [parametersChanged, setParametersChanged] = useState(false);
    const [innerDialogOpen, setInnerDialogOpen] = React.useState(false);

    function checkBeforeClose() {
        parametersChanged ? setInnerDialogOpen(true) : onClose();
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
        setInnerDialogOpen(false);
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
                    <FormattedMessage id="processParameters" />
                    <Button onClick={checkBeforeClose}>
                        <Close />
                    </Button>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <ParametersDialogContent
                            parameters={parameters}
                            setParametersChanged={setParametersChanged}
                            reference={REFERENCE_DEFAULT}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={!parametersChanged}
                        onClick={handleButtonAction}
                    >
                        <FormattedMessage id="save" />
                    </Button>
                </DialogActions>
            </Dialog>

            <ParametersConfirmClosingDialog
                open={innerDialogOpen}
                onClickYes={handleConfirmClosing}
                onClickNo={() => {}}
                closeDialog={handleInnerDialogClosing}
            ></ParametersConfirmClosingDialog>
        </>
    );
}

ProcessParametersDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProcessParametersDialog;
