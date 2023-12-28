/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';

import { Box, Button, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

const modalHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

function ModalHeader({ titleId, onClose }) {
    return (
        <Box sx={modalHeaderStyle}>
            <Typography variant="h6" component="h2">
                <FormattedMessage id={titleId} />
            </Typography>
            <Button onClick={onClose}>
                <Close />
            </Button>
        </Box>
    );
}

ModalHeader.propTypes = {
    titleId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ModalHeader;
