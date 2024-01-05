/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import {FormattedMessage} from 'react-intl';
import {Button, DialogActions, DialogContent} from '@mui/material';
import {fetchVersionAndEnvironnement} from '../utils/rest-api';

const styles = {
    title: (theme) => ({
        padding: theme.spacing(2),
    }),
    grid: (theme) => ({
        padding: theme.spacing(2),
    }),
};

const About = ({showAbout, hideAbout}) => {
    const [appVersion, setAppVersion] = useState(0);

    useEffect(() => {
        fetchVersionAndEnvironnement().then((res) => {
            setAppVersion(res);
        });
    }, []);

    return (
        <Dialog
            open={showAbout}
            onClose={hideAbout}
            aria-labelledby="form-dialog-title"
            maxWidth={'md'}
            fullWidth={true}
        >
            <DialogTitle id="form-dialog-title">
                <Typography component="span" variant="h5" sx={styles.title}>
                    <FormattedMessage id="about"/>
                </Typography>
            </DialogTitle>
            <DialogContent>
                {appVersion}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={hideAbout}
                    variant="contained"
                    color="primary"
                >
                    <FormattedMessage id="close"/>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default About;
