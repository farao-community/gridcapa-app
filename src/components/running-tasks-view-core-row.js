/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Button, Grid, TableCell, TableRow } from '@mui/material';
import {
    gridcapaFormatDate,
    latestRunFromTaskRunHistory,
    sha256,
} from '../utils/commons';
import { ListAlt, Visibility } from '@mui/icons-material';
import { TaskStatusChip } from './task-status-chip';
import FileSummary from './file-summary';
import { StopButton } from './stop-button';

const RunningTasksViewCoreRow = ({
    task,
    index,
    page,
    rowsPerPage,
    handleFileOpen,
    handleEventOpen,
}) => {
    let timestamp = task.timestamp;
    let formattedTimestamp = gridcapaFormatDate(timestamp);
    let encryptedMessage = sha256(formattedTimestamp);
    let latestRunId = latestRunFromTaskRunHistory(task.runHistory);

    return (
        task && (
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
                                        listOfFile={task.inputs}
                                    />
                                </Grid>
                                <Grid item>
                                    <FileSummary
                                        type="Output"
                                        listOfFile={task.outputs}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button
                                id={'Files_' + (index + page * rowsPerPage)}
                                data-test={'timestamp-files-' + task.timestamp}
                                onClick={() => {
                                    handleFileOpen(task);
                                }}
                            >
                                <Visibility />
                            </Button>
                        </Grid>
                    </Grid>
                </TableCell>
                <TableCell size="small">
                    <TaskStatusChip
                        data-test={'timestamp-status-' + task.timestamp}
                        task-status={task.status}
                        variant={
                            task.status === 'RUNNING' ? 'outlined' : 'filled'
                        }
                    />
                </TableCell>
                <TableCell size="small">
                    <StopButton
                        status={task.status}
                        timestamp={task.timestamp}
                        runId={latestRunId}
                    />
                </TableCell>
                <TableCell size="small">
                    <Button
                        id={'Events_' + (index + page * rowsPerPage)}
                        onClick={() => {
                            handleEventOpen(task);
                        }}
                    >
                        <ListAlt />
                    </Button>
                </TableCell>
            </TableRow>
        )
    );
};

export default RunningTasksViewCoreRow;
