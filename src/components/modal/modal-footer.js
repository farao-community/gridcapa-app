/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import { Box, Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const modalFooterStyle = {
    marginTop: '25px',
};

function ModalFooter({
    buttonDisabled,
    buttonAction,
    setButtonDisabled,
    buttonLabel,
}) {
    const handleButtonAction = () => {
        buttonAction()
            .then(() => setButtonDisabled(true))
            .catch((errorMessage) => console.error(errorMessage));
    };

    return (
        <Box sx={modalFooterStyle}>
            <Button
                color="primary"
                variant="contained"
                disabled={buttonDisabled}
                onClick={handleButtonAction}
            >
                <FormattedMessage id={buttonLabel} />
            </Button>
        </Box>
    );
}

ModalFooter.propTypes = {
    buttonDisabled: PropTypes.bool.isRequired,
    buttonAction: PropTypes.func.isRequired,
    setButtonDisabled: PropTypes.func.isRequired,
    buttonLabel: PropTypes.string.isRequired,
};

export default ModalFooter;
