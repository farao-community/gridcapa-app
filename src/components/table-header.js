/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import dateFormat from 'dateformat';
import React, { useCallback } from 'react';
import { TaskStatusChip } from './task-status-chip';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        width: 200,
    },
}));

const TableHeader = ({
    taskStatus,
    processName,
    timestamp,
    onTimestampChange,
}) => {
    const classes = useStyles();
    const currentDate = dateFormat(timestamp, 'yyyy-mm-dd');
    const currentTime = dateFormat(timestamp, 'HH:MM');
    const outlined = taskStatus === 'RUNNING' ? 'outlined' : 'default';
    const tableHeaderName = (processName || '') + ' Supervisor';

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
        <Grid container className={classes.container}>
            <Grid item xs={3}>
                <Typography variant="body1">{tableHeaderName}</Typography>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        id="date"
                        label={<FormattedMessage id="selectTimestampDate" />}
                        type="date"
                        defaultValue={currentDate}
                        inputProps={{ 'data-test': 'timestamp-date-picker' }}
                        className={classes.textField}
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
                        id="time"
                        label={<FormattedMessage id="selectTimestampTime" />}
                        type="time"
                        defaultValue={currentTime}
                        inputProps={{
                            'data-test': 'timestamp-time-picker',
                            step: 3600,
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleTimeChange}
                    />
                </form>
            </Grid>
            <Grid item xs={3}>
                <TaskStatusChip
                    data-test="timestamp-status"
                    taskstatus={taskStatus}
                    variant={outlined}
                />
            </Grid>
        </Grid>
    );
};

export default TableHeader;
