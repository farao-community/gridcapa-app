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
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

function ParametersConfirmClosingDialog({ open, onClickYes, closeDialog }) {
    const handleClickYes = () => {
        onClickYes();
        closeDialog();
    };

    return (
        <Dialog open={open} onClose={() => {}}>
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage id="parametersNotSavedDialog" />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClickYes}>
                    <FormattedMessage id="yes" />,{' '}
                    <FormattedMessage id="quit" />
                </Button>
                <Button variant="contained" onClick={closeDialog}>
                    <FormattedMessage id="no" />,{' '}
                    <FormattedMessage id="cancel" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ParametersConfirmClosingDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClickYes: PropTypes.func.isRequired,
    closeDialog: PropTypes.func.isRequired,
};

export default ParametersConfirmClosingDialog;
