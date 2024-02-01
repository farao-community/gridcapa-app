/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import OverviewTable from '../overview-table';
import { FormattedMessage } from 'react-intl';

import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Close } from '@mui/icons-material';

const style = {
    dialogTitleStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};

function FileDialog({ open, onClose, inputs, outputs, timestamp }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={style.dialogTitleStyle}>
                <FormattedMessage id="globalViewCoreFiles" />
                <Button onClick={onClose}>
                    <Close />
                </Button>
            </DialogTitle>

            <DialogContent>
                <OverviewTable
                    inputs={inputs}
                    outputs={outputs}
                    timestamp={timestamp}
                />
            </DialogContent>
        </Dialog>
    );
}

FileDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    inputs: PropTypes.array.isRequired,
    outputs: PropTypes.array.isRequired,
    timestamp: PropTypes.string,
};

export default FileDialog;
