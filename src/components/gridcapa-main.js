/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Tab, Tabs, LinearProgress } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import ProcessTimestampView from './process-timestamp-view';
import Box from '@mui/material/Box';
import BusinessDateView from './business-date-view';
import RunningTasksView from './running-tasks-view';
import { fetchMinioStorageData } from '../utils/rest-api';
import {
    getInitialTimestampToSet,
    getDateString,
    getTimeString,
} from '../utils/date-time-utils';
import {
    PROCESS_TIMESTAMP_VIEW,
    BUSINESS_DATE_VIEW,
    RUNNING_TASKS_VIEW,
    getInitialViewToSet,
} from '../utils/view-utils';

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

const minioProgressStyle = {
    height: '8px',
};

function updateUrlWithTimestampAndView(navigate, timestamp, view) {
    let newUrl = '/';

    if (view === BUSINESS_DATE_VIEW) {
        const noonTimestamp = new Date(timestamp);
        noonTimestamp.setHours(12);
        newUrl = '/date/' + getDateString(noonTimestamp);
    } else if (view === PROCESS_TIMESTAMP_VIEW) {
        newUrl =
            '/utcDate/' +
            getDateString(timestamp) +
            '/utcTime/' +
            getTimeString(timestamp);
    }

    navigate(newUrl, {
        replace: true,
    });
}

const GridCapaMain = () => {
    const { dateParam, timeParam } = useParams();
    const [view, setView] = useState(BUSINESS_DATE_VIEW);
    const [processName, setProcessName] = useState(null);
    const [timestamp, setTimestamp] = useState(null);
    const [usedDiskSpacePercentage, setUsedDiskSpacePercentage] = useState(0);
    const navigate = useNavigate();

    const onTimestampChange = useCallback(
        (newTimestamp) => {
            setTimestamp(new Date(newTimestamp));
            updateUrlWithTimestampAndView(navigate, newTimestamp, view);
        },
        [navigate, view]
    );

    const handleViewChange = useCallback(
        (_event, newValue) => {
            setView(newValue);
            updateUrlWithTimestampAndView(navigate, timestamp, newValue);
        },
        [navigate, timestamp]
    );

    useEffect(() => {
        if (processName === null) {
            console.log('Fetching process metadata...');
            fetch('process-metadata.json')
                .then((res) => res.json())
                .then((res) => {
                    setProcessName(res.processName);

                    const timestampToSet = getInitialTimestampToSet(
                        dateParam,
                        timeParam,
                        res.dayIncrementInDate
                    );
                    setTimestamp(timestampToSet);

                    setView(getInitialViewToSet(dateParam, timeParam, view));
                });
        }
    }, [processName, dateParam, timeParam, view]);

    useEffect(() => {
        fetchMinioStorageData().then((res) => {
            let usedDiskSpace = 0;
            let freeDiskSpace = 0;
            res.info.servers.forEach((server) => {
                server.drives.forEach((drive) => {
                    usedDiskSpace = usedDiskSpace + drive.usedspace;
                    freeDiskSpace = freeDiskSpace + drive.availspace;
                });
            });
            setUsedDiskSpacePercentage(
                Math.round(
                    (usedDiskSpace / (usedDiskSpace + freeDiskSpace)) * 100
                )
            );
        });
    }, []);

    return (
        timestamp && (
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
                        <Tab
                            label={<FormattedMessage id="runningTasksView" />}
                            data-test="global-view"
                        />
                    </Tabs>
                    <div class="center">
                        <FormattedMessage id="minioDiskUsage" />
                        {usedDiskSpacePercentage}%
                        <LinearProgress
                            sx={minioProgressStyle}
                            variant="determinate"
                            value={usedDiskSpacePercentage}
                        />
                    </div>
                </Grid>
                <Grid item xs={10}>
                    <TabPanel value={view} index={PROCESS_TIMESTAMP_VIEW}>
                        <ProcessTimestampView
                            processName={processName}
                            timestamp={timestamp}
                            onTimestampChange={onTimestampChange}
                        />
                    </TabPanel>
                    <TabPanel value={view} index={BUSINESS_DATE_VIEW}>
                        <BusinessDateView
                            processName={processName}
                            timestamp={timestamp}
                            onTimestampChange={onTimestampChange}
                        />
                    </TabPanel>
                    <TabPanel value={view} index={RUNNING_TASKS_VIEW}>
                        <RunningTasksView processName={processName} />
                    </TabPanel>
                </Grid>
            </Grid>
        )
    );
};

export default GridCapaMain;
