/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import ModalHeader from './modal-header';
import ParametersModalContent from './parameters-modal-content';
import ModalFooter from './modal-footer';

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
};

function TimestampParametersModal({ open, onClose, parameters, buttonAction }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style.modalStyle}>
                <ModalHeader titleId="timestampParameters" onClose={onClose} />
                <ParametersModalContent
                    parameters={parameters}
                    setButtonDisabled={() => {}}
                />
                <ModalFooter
                    buttonDisabled={false}
                    buttonAction={buttonAction}
                    setButtonDisabled={() => {}}
                    buttonLabel="runButtonLabel"
                />
            </Box>
        </Modal>
    );
}

TimestampParametersModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TimestampParametersModal;
