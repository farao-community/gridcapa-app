/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import ModalHeader from './modal-header';
import OverviewTable from '../overview-table';

import { Box, Modal } from '@mui/material';

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

function FileModal({ open, onClose, inputs, outputs, timestamp }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style.modalStyle}>
                <ModalHeader titleId="globalViewCoreFiles" onClose={onClose} />
                <FileModalContent
                    inputs={inputs}
                    outputs={outputs}
                    timestamp={timestamp}
                />
            </Box>
        </Modal>
    );
}

FileModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    inputs: PropTypes.array.isRequired,
    outputs: PropTypes.array.isRequired,
    timestamp: PropTypes.string,
};

export default FileModal;

function FileModalContent({ inputs, outputs, timestamp }) {
    return (
        <Box sx={style.modalContentStyle}>
            <OverviewTable
                inputs={inputs}
                outputs={outputs}
                timestamp={timestamp}
            />
        </Box>
    );
}

FileModalContent.propTypes = {
    inputs: PropTypes.array.isRequired,
    outputs: PropTypes.array.isRequired,
    timestamp: PropTypes.string,
};
