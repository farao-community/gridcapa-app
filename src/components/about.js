/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Typography,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import { fetchVersionAndEnvironnement } from '../utils/rest-api';

const About = ({ showAbout, hideAbout }) => {
    const [appVersion, setAppVersion] = useState(0);

    useEffect(() => {
        fetchVersionAndEnvironnement()
            .then((res) => {
                setAppVersion(res);
            })
            .catch((error) => {
                console.error(
                    'Could not retrieve version and environment ',
                    error
                );
            });
    }, []);

    return (
        <Dialog open={showAbout} onClose={hideAbout} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h5" align="center">
                    <FormattedMessage id="about" />
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <DialogContentText>
                    <FormattedMessage id="versionMessage" />
                    {appVersion}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={hideAbout}>
                    <FormattedMessage id="close" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default About;

About.propTypes = {
    showAbout: PropTypes.bool.isRequired,
    hideAbout: PropTypes.func.isRequired,
};
