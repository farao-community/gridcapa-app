/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Button, Grid, TableCell, TableRow } from '@mui/material';
import { gridcapaFormatDate, sha256 } from '../utils/commons';
import { ListAlt, Visibility } from '@mui/icons-material';
import { TaskStatusChip } from './task-status-chip';
import { RunButton } from './run-button';
import FileSummary from './file-summary';
import { StopButton } from './stop-button';

const GlobalViewCoreRow = ({
    step,
    index,
    page,
    rowsPerPage,
    handleFileOpen,
    handleEventOpen,
}) => {
    let timestamp = step.timestamp;
    let formattedTimestamp = gridcapaFormatDate(timestamp);
    let encryptedMessage = sha256(formattedTimestamp);

    return (
        step.taskData && (
            <TableRow hover key={encryptedMessage}>
                <TableCell
                    data-test={encryptedMessage + '-process-event-timestamp'}
                    size="small"
                >
                    {formattedTimestamp}
                </TableCell>
                <TableCell size="small">
                    <Grid container direction="row" spacing={2}>
                        <Grid item>
                            <Grid container direction="column">
                                <Grid item>
                                    <FileSummary
                                        type="Input"
                                        listOfFile={step.taskData.inputs}
                                    />
                                </Grid>
                                <Grid item>
                                    <FileSummary
                                        type="Output"
                                        listOfFile={step.taskData.outputs}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button
                                id={'Files_' + (index + page * rowsPerPage)}
                                data-test={'timestamp-files-' + step.timestamp}
                                onClick={() => {
                                    handleFileOpen(step);
                                }}
                            >
                                <Visibility />
                            </Button>
                        </Grid>
                    </Grid>
                </TableCell>
                <TableCell size="small">
                    <TaskStatusChip
                        data-test={'timestamp-status-' + step.timestamp}
                        task-status={step.taskData.status}
                        variant={
                            step.taskData.status === 'RUNNING'
                                ? 'outlined'
                                : 'filled'
                        }
                    />
                </TableCell>
                <TableCell size="small">
                    <RunButton
                        status={step.taskData.status}
                        timestamp={step.taskData.timestamp}
                    />
                    <StopButton
                        status={step.taskData.status}
                        timestamp={step.taskData.timestamp}
                    />
                </TableCell>
                <TableCell size="small">
                    <Button
                        id={'Events_' + (index + page * rowsPerPage)}
                        onClick={() => {
                            handleEventOpen(step);
                        }}
                    >
                        <ListAlt />
                    </Button>
                </TableCell>
            </TableRow>
        )
    );
};

export default GlobalViewCoreRow;
