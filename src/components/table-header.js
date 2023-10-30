/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';
import dateFormat from 'dateformat';
import React, { useCallback, useEffect, useState } from 'react';
import { TaskStatusChip } from './task-status-chip';
import { RunButton } from './run-button';
import { StopButton } from './stop-button';
import { ManualExportButton } from './manual-export-button';

const styles = {
    container: (theme) => ({
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        display: 'flex',
        flexWrap: 'wrap',
    }),
    textField: (theme) => ({
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        width: 200,
    }),
};

function displayRunButton(taskData) {
    return taskData !== null ? (
        <RunButton status={taskData.status} timestamp={taskData.timestamp} />
    ) : null;
}

function displayStopButton(taskData) {
    return taskData !== null ? (
        <StopButton status={taskData.status} timestamp={taskData.timestamp} />
    ) : null;
}

function displayManualExportButton(taskData, manualExportEnabled) {
    return taskData !== null && manualExportEnabled ? (
        <ManualExportButton
            status={taskData.status}
            timestamp={taskData.timestamp}
        />
    ) : null;
}

const TableHeader = ({
    taskData,
    processName,
    timestamp,
    onTimestampChange,
}) => {
    const taskStatus = taskData ? taskData.status : 'Not created';
    const currentDate = dateFormat(timestamp, 'yyyy-mm-dd');
    const currentTime = dateFormat(timestamp, 'HH:MM');
    const outlined = taskStatus === 'RUNNING' ? 'outlined' : 'filled';
    const tableHeaderName = (processName || '') + ' Supervisor';
    const [manualExportEnabled, setManualExportEnabled] = useState([]);

    useEffect(() => {
        async function getManualExportEnabled() {
            let data = {};
            try {
                const response = await fetch('process-metadata.json');
                data = await response.json();
            } catch (error) {
                console.error('An error has occurred:', error);
            }
            setManualExportEnabled(data.manualExportEnabled || false);
        }
        getManualExportEnabled();
    }, []); // With the empty array we ensure that the effect is only fired one time check the documentation https://reactjs.org/docs/hooks-effect.html

    const handleDateChange = useCallback(
        (event) => {
            const date = event.target.value;
            let newTimestamp = timestamp;
            newTimestamp.setDate(date.substr(8, 2));
            newTimestamp.setMonth(date.substr(5, 2) - 1);
            newTimestamp.setFullYear(date.substr(0, 4));
            onTimestampChange(newTimestamp);
        },
        [timestamp, onTimestampChange]
    );

    const handleTimeChange = useCallback(
        (event) => {
            const time = event.target.value;
            let newTimestamp = timestamp;
            newTimestamp.setHours(time.substr(0, 2));
            newTimestamp.setMinutes(time.substr(3, 2));
            onTimestampChange(newTimestamp);
        },
        [timestamp, onTimestampChange]
    );

    return (
        <Grid container sx={styles.container}>
            <Grid item xs={2}>
                <Typography variant="body1">{tableHeaderName}</Typography>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        variant="standard"
                        id="date"
                        label={<FormattedMessage id="selectTimestampDate" />}
                        type="date"
                        defaultValue={currentDate}
                        inputProps={{ 'data-test': 'timestamp-date-picker' }}
                        sx={styles.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleDateChange}
                    />
                </form>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        variant="standard"
                        id="time"
                        label={<FormattedMessage id="selectTimestampTime" />}
                        type="time"
                        defaultValue={currentTime}
                        inputProps={{
                            'data-test': 'timestamp-time-picker',
                            step: 3600,
                        }}
                        sx={styles.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleTimeChange}
                    />
                </form>
            </Grid>
            <Grid item xs={2}>
                <TaskStatusChip
                    data-test="timestamp-status"
                    task-status={taskStatus}
                    variant={outlined}
                />
            </Grid>
            <Grid item xs={2}>
                {displayRunButton(taskData)}
                {displayStopButton(taskData)}
                {displayManualExportButton(taskData, manualExportEnabled)}
            </Grid>
        </Grid>
    );
};

export default TableHeader;
