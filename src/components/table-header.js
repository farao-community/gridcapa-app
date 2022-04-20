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
    taskData,
    processMetadata,
    onSelectedDateChange,
    onSelectedTimeChange,
}) => {
    const classes = useStyles();
    const defaultTimestamp = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        30
    );
    let defaultDate = dateFormat(defaultTimestamp, 'yyyy-mm-dd');

    let defaultTime = dateFormat(defaultTimestamp, 'HH:MM');

    let taskStatus = taskData === null ? 'Not created' : taskData.status;

    let outlined = taskStatus === 'RUNNING' ? 'outlined' : 'filled';

    let tableHeaderName =
        processMetadata === null
            ? ''
            : processMetadata.processName + ' Supervisor';

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
                        defaultValue={defaultDate}
                        inputProps={{ 'data-test': 'timestamp-date-picker' }}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={onSelectedDateChange}
                    />
                </form>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        id="time"
                        label={<FormattedMessage id="selectTimestampTime" />}
                        type="time"
                        defaultValue={defaultTime}
                        inputProps={{
                            'data-test': 'timestamp-time-picker',
                            step: 3600,
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={onSelectedTimeChange}
                    />
                </form>
            </Grid>
            <Grid item xs={3}>
                <TaskStatusChip
                    data-test="timestamp-status"
                    taskStatus={taskStatus}
                    variant={outlined}
                />
            </Grid>
        </Grid>
    );
};

export default TableHeader;
