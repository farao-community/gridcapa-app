/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';

import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

function ParametersModalCloseDialog({
    open,
    onClickYes,
    onClickNo,
    closeDialog,
}) {
    return (
        <Dialog open={open} onClose={() => {}}>
            <DialogTitle>
                <FormattedMessage id="warning" />
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage id="parametersNotSavedDialog" />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => {
                        onClickYes();
                        closeDialog();
                    }}
                >
                    <FormattedMessage id="yes" />,{' '}
                    <FormattedMessage id="quit" />
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        onClickNo();
                        closeDialog();
                    }}
                >
                    <FormattedMessage id="no" />,{' '}
                    <FormattedMessage id="cancel" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ParametersModalCloseDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClickYes: PropTypes.func.isRequired,
    onClickNo: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
};

export default ParametersModalCloseDialog;
