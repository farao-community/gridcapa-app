/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import EventsTable from '../events-table';
import { FormattedMessage } from 'react-intl';

import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    LinearProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const style = {
    dialogTitleStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dialogContentStyle: {
        maxHeight: '70vh',
    },
};

function EventDialog({ open, onClose, isLoadingEvent, eventsData }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={style.dialogTitleStyle}>
                <FormattedMessage id="events" />
                <Button onClick={onClose}>
                    <Close />
                </Button>
            </DialogTitle>

            <DialogContent sx={style.dialogContentStyle}>
                {isLoadingEvent ? (
                    <LinearProgress />
                ) : (
                    <EventsTable eventsData={eventsData} />
                )}
            </DialogContent>
        </Dialog>
    );
}

EventDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isLoadingEvent: PropTypes.bool.isRequired,
    eventsData: PropTypes.array.isRequired,
};

export default EventDialog;
