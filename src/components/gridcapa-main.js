/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect } from 'react';
import { Grid, Tab, Tabs } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import ProcessTimestampView from './process-timestamp-view';
import Box from '@material-ui/core/Box';
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
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

const TODAY_TIMESTAMP = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0,
    30
);

const GridCapaMain = () => {
    const [view, setView] = React.useState(0);
    const [processName, setProcessName] = React.useState(null);
    const [timestamp, setTimestamp] = React.useState(TODAY_TIMESTAMP);

    const onTimestampChange = useCallback((newTimestamp) => {
        setTimestamp(new Date(newTimestamp));
    }, []);

    const handleViewChange = useCallback((_event, newValue) => {
        setView(newValue);
    }, []);

    useEffect(() => {
        if (processName === null) {
            console.log('Fetching process metadata...');
            fetch('process-metadata.json')
                .then((res) => res.json())
                .then((res) => {
                    setProcessName(res.processName);
                });
        }
    });

    return (
        <Grid container>
            <Grid item xs={2}>
                <Tabs
                    value={view}
                    onChange={handleViewChange}
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
                <TabPanel value={view} index={0}>
                    <ProcessTimestampView
                        processName={processName}
                        timestamp={timestamp}
                        onTimestampChange={onTimestampChange}
                    />
                </TabPanel>
                <TabPanel value={view} index={1}>
                    <BusinessDateView
                        processName={processName}
                        timestamp={timestamp}
                        onTimestampChange={onTimestampChange}
                    />
                </TabPanel>
            </Grid>
        </Grid>
    );
};

export default GridCapaMain;
