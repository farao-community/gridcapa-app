/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Grid, Tab, Tabs, LinearProgress } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useIntlRef } from '../utils/messages';
import ProcessTimestampView from './process-timestamp-view';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import BusinessDateView from './business-date-view';
import RunningTasksView from './running-tasks-view';
import ProcessParametersModal from './modal/process-parameters-modal';
import {
    fetchMinioStorageData,
    fetchProcessParameters,
    updateProcessParameters,
} from '../utils/rest-api';
import {
    getInitialTimestampToSet,
    getDateString,
    getTimeString,
} from '../utils/date-time-utils';
import { Views, getInitialViewToSet } from '../utils/view-utils';

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
    switch (view) {
        case Views.BUSINESS_DATE_VIEW:
            // Because the `timestamp` parameter is in UTC timezone and the HMI is in local timezone,
            // we need to set time to noon instead of midnight in order to be sure that the date displayed
            // in the Business View is the same as the one given in parameter.
            const noonTimestamp = new Date(timestamp);
            noonTimestamp.setHours(12);
            const date = getDateString(noonTimestamp);
            newUrl = `/date/${date}`;
            break;
        case Views.PROCESS_TIMESTAMP_VIEW:
            const utcDate = getDateString(timestamp);
            const utcTime = getTimeString(timestamp);
            newUrl = `/utcDate/${utcDate}/utcTime/${utcTime}`;
            break;
        case Views.RUNNING_TASKS_VIEW:
            newUrl = `/global`;
            break;
        default:
            break;
    }

    navigate(newUrl, {
        replace: true,
    });
}

function displayParametersButton(
    parametersEnabled,
    handleParametersModalOpening
) {
    return parametersEnabled ? (
        <div class="center">
            <Button
                color="primary"
                variant="contained"
                size="large"
                onClick={handleParametersModalOpening}
            >
                <FormattedMessage id="parameters" />
            </Button>
        </div>
    ) : null;
}

const GridCapaMain = ({ displayGlobal }) => {
    const { dateParam, timeParam } = useParams();
    const [view, setView] = useState(Views.BUSINESS_DATE_VIEW);
    const [processName, setProcessName] = useState(null);
    const [timestamp, setTimestamp] = useState(null);
    const [usedDiskSpacePercentage, setUsedDiskSpacePercentage] = useState(0);
    const navigate = useNavigate();
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();

    const [parametersModalOpen, setParmetersModalOpen] = useState(false);
    const [parametersEnabled, setParametersEnabled] = useState(false);
    const [processParameters, setProcessParameters] = useState([]);

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

                    const viewToDisplay = displayGlobal
                        ? Views.RUNNING_TASKS_VIEW
                        : getInitialViewToSet(dateParam, timeParam, view);
                    setView(viewToDisplay);

                    setParametersEnabled(res.parametersEnabled || false);
                });
        }
    }, [processName, displayGlobal, dateParam, timeParam, view]);

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

    function handleParametersModalOpening() {
        return fetchProcessParameters()
            .then(setProcessParameters)
            .then(() => setParmetersModalOpen(true));
    }

    function handleParametersUpdate() {
        console.log('Parameters to update:', processParameters);
        return updateProcessParameters(
            processParameters,
            intlRef,
            enqueueSnackbar
        ).then((updatedParameters) => {
            console.log('Updated parameters: ', updatedParameters);
            setParmetersModalOpen(false);
        });
    }

    return (
        timestamp && (
            <div>
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
                                label={
                                    <FormattedMessage id="businessDateView" />
                                }
                                data-test="business-view"
                            />
                            <Tab
                                label={
                                    <FormattedMessage id="runningTasksView" />
                                }
                                data-test="global-view"
                            />
                        </Tabs>
                        {displayParametersButton(
                            parametersEnabled,
                            handleParametersModalOpening
                        )}
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
                        <TabPanel
                            value={view}
                            index={Views.PROCESS_TIMESTAMP_VIEW}
                        >
                            <ProcessTimestampView
                                processName={processName}
                                timestamp={timestamp}
                                onTimestampChange={onTimestampChange}
                            />
                        </TabPanel>
                        <TabPanel value={view} index={Views.BUSINESS_DATE_VIEW}>
                            <BusinessDateView
                                processName={processName}
                                timestamp={timestamp}
                                onTimestampChange={onTimestampChange}
                            />
                        </TabPanel>
                        <TabPanel value={view} index={Views.RUNNING_TASKS_VIEW}>
                            <RunningTasksView processName={processName} />
                        </TabPanel>
                    </Grid>
                </Grid>
                <ProcessParametersModal
                    open={parametersModalOpen}
                    onClose={() => setParmetersModalOpen(false)}
                    buttonAction={handleParametersUpdate}
                    parameters={processParameters}
                />
            </div>
        )
    );
};

export default GridCapaMain;
