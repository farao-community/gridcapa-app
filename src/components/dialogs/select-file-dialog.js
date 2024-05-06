/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

function SelectFileDialog({ open, handleClose, fileType, selectFile }) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <DialogContentText>
                    <FormattedMessage
                        id="changeProcessFileAlertMessage"
                        values={{ input_type: fileType }}
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    data-test="yes-button"
                    onClick={selectFile}
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
    );
}

SelectFileDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    fileType: PropTypes.string.isRequired,
    selectFile: PropTypes.func.isRequired,
};

export default SelectFileDialog;
