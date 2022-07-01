/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useCallback } from 'react';
import {
    Button,
    Modal,
    Grid,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    LinearProgress,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { gridcapaFormatDate, sha256 } from './commons';
import { ListAlt, Close, Visibility } from '@material-ui/icons';
import EventsTable from './events-table';
import { TaskStatusChip } from './task-status-chip';
import OverviewTable from './overview-table';
import { RunButton } from './run-button';
import { useSnackbar } from 'notistack';
import { useIntlRef } from '../utils/messages';
import { fetchBusinessDateData, getWebSocketUrl } from '../utils/rest-api';
import useWebSocket from 'react-use-websocket';
import FilterMenu from './filter-menu';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    maxHeight: '80vh',
    minHeight: '80vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const createAllSteps = (timestampMin, timestampMax, timestampStep) => {
    let currentTimeStamp = timestampMin;
    let array = timestampStep.split(':');
    let seconds = parseInt(array[0], 10) * 3600 + parseInt(array[1], 10) * 60;
    let result = [];

    while (currentTimeStamp < timestampMax) {
        let elem = { timestamp: currentTimeStamp };
        result.push(elem);
        currentTimeStamp += seconds * 1000;
    }

    return result;
};

const GlobalViewCore = ({
    timestampMin,
    timestampMax,
    timestampStep,
    onTimestampChange,
    processName,
}) => {
    const [openEvent, setOpenEvent] = React.useState([]);
    const [steps, setSteps] = React.useState(
        createAllSteps(timestampMin, timestampMax, timestampStep)
    );
    const [modalEventOpen, setModalEventOpen] = React.useState(false);
    const [modalFileOpen, setModalFileOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(12);
    const [statusFilter, setStatusFilter] = React.useState('');
    const { enqueueSnackbar } = useSnackbar();
    const intlRef = useIntlRef();

    const handleTimestampMessage = useCallback(
        async (event) => {
            const data = JSON.parse(event.data);
            const plop = [...steps];
            let globalIndex = plop.findIndex(
                (step) =>
                    Date.parse(data.timestamp) === step.timestamp ||
                    data.timestamp === step.timestamp
            );
            if (globalIndex >= 0) {
                plop[globalIndex].taskData = data;
                setSteps(plop);
            }
        },
        [steps]
    );

    useWebSocket(getWebSocketUrl('task'), {
        shouldReconnect: (closeEvent) => true,
        share: true,
        onMessage: handleTimestampMessage,
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getMissingData(steps, newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        getMissingData(steps, 0, event.target.value);
    };

    const handleEventOpen = (event) => {
        openEvent[parseInt(event.currentTarget.id.split('_')[1])] = true;
        setModalEventOpen(true);
    };
    const handleEventClose = () => {
        let index = openEvent.indexOf(true);
        openEvent[index] = false;
        setModalEventOpen(false);
    };

    const handleFileOpen = (event) => {
        openEvent[parseInt(event.currentTarget.id.split('_')[1])] = true;
        setModalFileOpen(true);
    };
    const handleFileClose = () => {
        let index = openEvent.indexOf(true);
        openEvent[index] = false;
        setModalFileOpen(false);
    };

    const handleStatusFilterChange = (event) => {
        let newFilter = event.currentTarget.value.toUpperCase();
        setStatusFilter(newFilter);
        if (filterSteps(newFilter).length < page * rowsPerPage) {
            setPage(Math.floor(filterSteps(newFilter).length / rowsPerPage));
        }
    };

    const filterSteps = (localFilter = null) => {
        return steps.filter((step) => {
            return (
                step.taskData &&
                step.taskData.status.includes(
                    localFilter ? localFilter : statusFilter
                )
            );
        });
    };

    const getMissingData = useCallback(
        (allSteps, consideredPage, consideredRowsPerPage) => {
            let allPromise = [];
            let searchDays = [];
            for (
                let i = consideredPage * consideredRowsPerPage;
                i <
                    consideredPage * consideredRowsPerPage +
                        consideredRowsPerPage && i < allSteps.length;
                i++
            ) {
                if (!allSteps[i].taskData) {
                    setIsLoading(true);
                    let day = new Date(allSteps[i].timestamp)
                        .toISOString()
                        .substring(0, 10);
                    if (!searchDays.includes(day)) {
                        allPromise.push(
                            fetchBusinessDateData(
                                new Date(allSteps[i].timestamp)
                                    .toISOString()
                                    .substring(0, 10),
                                intlRef,
                                enqueueSnackbar
                            )
                        );
                        searchDays.push(day);
                    }
                }
            }
            Promise.all(allPromise).then((values) => {
                values.forEach((tasksdata) => {
                    tasksdata.forEach((td) => {
                        let globalIndex = allSteps.findIndex(
                            (step) =>
                                Date.parse(td.timestamp) === step.timestamp ||
                                td.timestamp === step.timestamp
                        );
                        if (globalIndex >= 0)
                            allSteps[globalIndex].taskData = td;
                    });
                });
                setIsLoading(false);
                setSteps(allSteps);
                setStatusFilter('');
            });
        },
        [enqueueSnackbar, intlRef]
    );

    useEffect(() => {
        let newSteps = createAllSteps(
            timestampMin,
            timestampMax,
            timestampStep
        );
        setPage(0);
        setOpenEvent([]);
        getMissingData(newSteps, 0, rowsPerPage);
    }, [
        timestampMin,
        timestampMax,
        timestampStep,
        rowsPerPage,
        getMissingData,
    ]);

    const getEventsData = () => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? steps[index].taskData : [];
    };

    const getFilesData = (field) => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? steps[index].taskData[field] : [];
    };

    const inputDataRow = (step, index) => {
        let timestamp = step.timestamp;
        if (!openEvent[index + page * rowsPerPage]) {
            openEvent[index + page * rowsPerPage] = false;
        }
        let formattedTimestamp = gridcapaFormatDate(timestamp);
        let encryptedMessage = sha256(formattedTimestamp);

        return (
            step.taskData && (
                <TableRow hover key={encryptedMessage}>
                    <TableCell
                        data-test={
                            encryptedMessage + '-process-event-timestamp'
                        }
                        size="small"
                    >
                        {formattedTimestamp}
                    </TableCell>
                    <TableCell size="small">
                        <Grid container direction="row" spacing={2}>
                            <Grid item>
                                <Grid container direction="column">
                                    <Grid item>
                                        Input&nbsp;:&nbsp;&nbsp;&nbsp;
                                        {step.taskData.inputs.filter(
                                            (i) =>
                                                i.processFileStatus ===
                                                'VALIDATED'
                                        ).length +
                                            '\u00a0/\u00a0' +
                                            step.taskData.inputs.length}
                                    </Grid>
                                    <Grid item>
                                        Output&nbsp;:&nbsp;
                                        {step.taskData.outputs.filter(
                                            (i) =>
                                                i.processFileStatus ===
                                                'VALIDATED'
                                        ).length +
                                            '\u00a0/\u00a0' +
                                            step.taskData.outputs.length}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button
                                    id={'Files_' + (index + page * rowsPerPage)}
                                    onClick={handleFileOpen}
                                >
                                    <Visibility />
                                </Button>
                            </Grid>
                        </Grid>
                    </TableCell>
                    <TableCell size="small">
                        <TaskStatusChip
                            data-test={'timestamp-status-' + step.timestamp}
                            taskstatus={step.taskData.status}
                            variant={
                                step.taskData.status === 'RUNNING'
                                    ? 'outlined'
                                    : 'default'
                            }
                        />
                    </TableCell>
                    <TableCell size="small">
                        <RunButton
                            status={step.taskData.status}
                            timestamp={step.taskData.timestamp}
                        />
                    </TableCell>
                    <TableCell size="small">
                        <Button
                            id={'Events_' + (index + page * rowsPerPage)}
                            onClick={handleEventOpen}
                        >
                            <ListAlt />
                        </Button>
                    </TableCell>
                </TableRow>
            )
        );
    };

    return (
        <div>
            <TableContainer
                style={{ maxHeight: '75vh', minHeight: '63vh' }}
                component={Paper}
            >
                <Table stickyHeader className="table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <FormattedMessage id="timestamp" />
                            </TableCell>
                            <TableCell>
                                <FormattedMessage id="globalViewCoreFiles" />
                            </TableCell>
                            <TableCell>
                                <FormattedMessage id="status" />
                                <FilterMenu
                                    filterHint="filterOnStatus"
                                    handleChange={handleStatusFilterChange}
                                />
                            </TableCell>
                            <TableCell>
                                <FormattedMessage id="globalViewCoreAction" />
                            </TableCell>
                            <TableCell>
                                <FormattedMessage id="events" />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <LinearProgress />
                                </TableCell>
                            </TableRow>
                        )}
                        {!isLoading &&
                            filterSteps()
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((step, index) =>
                                    inputDataRow(step, index)
                                )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[12, 24, 48]}
                component="div"
                count={filterSteps().length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={<FormattedMessage id="RowsPerPage" />}
            />
            <Modal
                open={modalEventOpen}
                onClose={handleEventClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        <FormattedMessage id="events" />
                        <Button
                            style={{ float: 'right' }}
                            onClick={handleEventClose}
                        >
                            <Close />
                        </Button>
                    </Typography>
                    <EventsTable
                        id="modal-modal-description"
                        taskData={getEventsData()}
                    />
                </Box>
            </Modal>
            <Modal
                open={modalFileOpen}
                onClose={handleFileClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        <FormattedMessage id="globalViewCoreFiles" />
                        <Button
                            style={{ float: 'right' }}
                            onClick={handleFileClose}
                        >
                            <Close />
                        </Button>
                    </Typography>
                    <OverviewTable
                        id="modal-modal-description"
                        inputs={getFilesData('inputs') || []}
                        outputs={getFilesData('outputs') || []}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default GlobalViewCore;
