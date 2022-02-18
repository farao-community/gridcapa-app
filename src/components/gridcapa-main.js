/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Grid, Tab, Tabs } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import ProcessTimestampView from './process-timestamp-view';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import BusinessDateView from './business-date-view';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const GridCapaMain = () => {
    const [value, setValue] = React.useState(-1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container>
            <Grid item xs={2}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    orientation="vertical"
                >
                    <Tab
                        label={<FormattedMessage id="timestampView" />}
                        data-test="timestamp-view"
                    />
                    <Tab
                        label={<FormattedMessage id="businessDateView" />}
                        data-test="business-view"
                    />
                </Tabs>
            </Grid>
            <Grid item xs={10}>
                <TabPanel value={value} index={0}>
                    <ProcessTimestampView />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <BusinessDateView />
                </TabPanel>
            </Grid>
        </Grid>
    );
};

export default GridCapaMain;
