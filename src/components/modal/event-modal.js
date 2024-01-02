/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import ModalHeader from './modal-header';
import EventsTable from '../events-table';

import { Box, LinearProgress, Modal } from '@mui/material';

const style = {
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw',
        minHeight: '70vh',
        backgroundColor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    modalContentStyle: {
        overflow: 'auto',
        maxHeight: '70vh',
    },
};

function EventModal({ open, onClose, isLoadingEvent, taskData }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style.modalStyle}>
                <ModalHeader titleId="events" onClose={onClose} />
                <EventModalContent
                    isLoadingEvent={isLoadingEvent}
                    taskData={taskData}
                />
            </Box>
        </Modal>
    );
}

EventModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isLoadingEvent: PropTypes.bool.isRequired,
    taskData: PropTypes.object.isRequired,
};

export default EventModal;

function EventModalContent({ isLoadingEvent, taskData }) {
    return (
        <Box sx={style.modalContentStyle}>
            {isLoadingEvent ? (
                <LinearProgress />
            ) : (
                <EventsTable taskData={taskData} />
            )}
        </Box>
    );
}

EventModalContent.propTypes = {
    isLoadingEvent: PropTypes.bool.isRequired,
    taskData: PropTypes.object.isRequired,
};
