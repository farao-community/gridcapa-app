/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { FormattedMessage } from 'react-intl';
import DialogContent from '@mui/material/DialogContent';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { fetchVersionAndEnvironnement } from '../utils/rest-api';

const styles = {
    title: (theme) => ({
        padding: theme.spacing(2),
    }),
    grid: (theme) => ({
        padding: theme.spacing(2),
    }),
};

const About = ({ showAbout, hideAbout }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const [appVersion, setAppVersion] = useState(0);

    useEffect(() => {
        fetchVersionAndEnvironnement().then((res) => {
            setAppVersion(res);
        });
    }, []);

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <Typography
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
    }

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
                    <FormattedMessage id="About" />
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Container maxWidth="md">
                    <TabPanel value={tabIndex} index={0}>
                        {appVersion}
                    </TabPanel>

                    <Grid item xs={12}>
                        <Button
                            onClick={hideAbout}
                            variant="contained"
                            color="primary"
                            sx={styles.button}
                        >
                            <FormattedMessage id="close" />
                        </Button>
                    </Grid>
                </Container>
            </DialogContent>
        </Dialog>
    );
};

export default About;
