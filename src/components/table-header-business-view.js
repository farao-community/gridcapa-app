/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import dateFormat from 'dateformat';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { FormattedMessage } from 'react-intl';
import React, { useCallback } from 'react';
import { RunAllButton } from './run-all-timstamps-for-business-date-button';

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

const TableHeaderBusinessView = ({
    processName,
    timestamp,
    onTimestampChange,
}) => {
    const currentDate = dateFormat(timestamp, 'yyyy-mm-dd');
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

    return (
        <Grid container sx={styles.container}>
            <Grid item xs={3}>
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
                <RunAllButton timestamp={timestamp} />
            </Grid>
        </Grid>
    );
};
export default TableHeaderBusinessView;
