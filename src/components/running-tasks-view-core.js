/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useCallback } from 'react';
import {
    Button,
    Modal,
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
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { Close } from '@mui/icons-material';
import EventsTable from './events-table';
import OverviewTable from './overview-table';
import { useSnackbar } from 'notistack';
import { useIntlRef } from '../utils/messages';
import {
    fetchRunningTasksData,
    fetchTimestampData,
    getWebSocketUrl,
} from '../utils/rest-api';
import FilterMenu from './filter-menu';
import { gridcapaFormatDate } from '../utils/commons';
import RunningTasksViewCoreRow from './running-tasks-view-core-row';
import SockJsClient from 'react-stomp';

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

const modalNoOverflowStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    maxHeight: '82vh',
    minHeight: '82vh',
    overflow: 'initial',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    padding: '0px',
};

const RunningTasksViewCore = () => {
    const [openEvent, setOpenEvent] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [modalEventOpen, setModalEventOpen] = React.useState(false);
    const [modalFileOpen, setModalFileOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isLoadingEvent, setIsLoadingEvent] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(12);
    const [statusFilter, setStatusFilter] = React.useState([]);
    const [timestampFilter, setTimestampFilter] = React.useState([]);
    const [timestampFilterRef, setTimestampFilterRef] = React.useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const intlRef = useIntlRef();
    useEffect(() => {
        async function getTimestampFilter() {
            let filter = await fetch('process-metadata.json')
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    return res.globalViewTimestampFilter;
                });
            setTimestampFilter(filter);
            setTimestampFilterRef(filter);
        }
        getTimestampFilter();
        getAllTasks();
    }, []); // With the empty array we ensure that the effect is only fired one time check the documentation https://reactjs.org/docs/hooks-effect.html

    const getAllTasks = async () => {
        setIsLoading(true);
        const newTasks = await fetchRunningTasksData();
        if (newTasks && newTasks.length) {
            setTasks(newTasks);
        } else {
            setTasks([]);
        }
        setIsLoading(false);
    };

    const handleTimestampMessage = useCallback(
        async (event) => {
            const data = event;
            const tasksCopy = [...tasks];
            let globalIndex = tasksCopy.findIndex(
                (task) =>
                    Date.parse(data.timestamp) === task.timestamp ||
                    data.timestamp === task.timestamp
            );
            if (globalIndex >= 0) {
                tasksCopy[globalIndex] = data;
                setTasks(tasksCopy);
            }
        },
        [tasks]
    );

    const getListOfTopics = () => {
        return tasks.map(
            (task) =>
                '/task/update/' +
                new Date(task.timestamp).toISOString().substr(0, 10)
        );
    };

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleEventOpen = (task) => {
        let index = tasks.findIndex(
            (inTasks) => inTasks.timestamp === task.timestamp
        );
        setIsLoadingEvent(true);
        openEvent[index] = true;
        setModalEventOpen(true);
        if (index >= 0) {
            fetchTimestampData(
                new Date(tasks[index].timestamp).toISOString(),
                intlRef,
                enqueueSnackbar
            ).then((res) => {
                tasks[index].processEvents = res.processEvents;
                setIsLoadingEvent(false);
            });
        }
    };

    const handleEventClose = () => {
        let index = openEvent.indexOf(true);
        openEvent[index] = false;
        setModalEventOpen(false);
    };

    const handleFileOpen = (task) => {
        let index = tasks.findIndex(
            (inTasks) => inTasks.timestamp === task.timestamp
        );
        openEvent[index] = true;
        setModalFileOpen(true);
    };
    const handleFileClose = () => {
        let index = openEvent.indexOf(true);
        openEvent[index] = false;
        setModalFileOpen(false);
    };

    const handleStatusFilterChange = (filters) => {
        let newFilter = filters.map((filter) => filter.toUpperCase());
        setStatusFilter(newFilter);
        if (
            filterTasks(newFilter, timestampFilter).length <
            page * rowsPerPage
        ) {
            setPage(
                Math.floor(
                    filterTasks(newFilter, timestampFilter).length / rowsPerPage
                )
            );
        }
    };

    const handleTimestampFilterChange = (filters) => {
        let newFilter = filters.map((filter) => filter.toUpperCase());
        setTimestampFilter(newFilter);
        if (filterTasks(statusFilter, newFilter).length < page * rowsPerPage) {
            setPage(
                Math.floor(
                    filterTasks(statusFilter, newFilter).length / rowsPerPage
                )
            );
        }
    };

    const filterTasks = (currentStatusFilter, currentTimestampFilter) => {
        // gridcapaFormatDate is not accessible inside the filter we have to use an intermediate
        let formatDate = gridcapaFormatDate;
        return tasks.filter((task) => {
            return (
                task &&
                (currentStatusFilter.length === 0 ||
                    (currentStatusFilter.length > 0 &&
                        currentStatusFilter.some((f) =>
                            task.status.includes(f)
                        ))) &&
                (currentTimestampFilter.length === 0 ||
                    (currentTimestampFilter.length > 0 &&
                        currentTimestampFilter.some((f) =>
                            formatDate(task.timestamp).includes(f)
                        )))
            );
        });
    };

    useEffect(() => {
        setPage(0);
        setOpenEvent([]);
    }, [rowsPerPage]);

    const getEventsData = () => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? tasks[index] : [];
    };

    const getFilesData = (field) => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? tasks[index][field] : [];
    };

    const getTimestamp = () => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? tasks[index].timestamp : null;
    };

    return (
        <div>
            <SockJsClient
                url={getWebSocketUrl('task')}
                topics={getListOfTopics()}
                onMessage={handleTimestampMessage}
            />
            <TableContainer
                style={{ maxHeight: '73vh', minHeight: '63vh' }}
                component={Paper}
            >
                <Table className="table">
                    <TableHead>
                        <TableRow>
                            <TableCell size="small">
                                <FormattedMessage id="timestamp" />
                                <FilterMenu
                                    filterHint="filterOnTimestamp"
                                    handleChange={handleTimestampFilterChange}
                                    currentFilter={timestampFilter}
                                    manual={timestampFilterRef.length <= 0}
                                    predefinedValues={timestampFilterRef}
                                />
                            </TableCell>
                            <TableCell size="small">
                                <FormattedMessage id="globalViewCoreFiles" />
                            </TableCell>
                            <TableCell size="small">
                                <FormattedMessage id="status" />
                                <FilterMenu
                                    filterHint="filterOnStatus"
                                    handleChange={handleStatusFilterChange}
                                    currentFilter={statusFilter}
                                />
                            </TableCell>
                            <TableCell size="small">
                                <FormattedMessage id="globalViewCoreAction" />
                            </TableCell>
                            <TableCell size="small">
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
                            filterTasks(statusFilter, timestampFilter)
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((task, index) => (
                                    <RunningTasksViewCoreRow
                                        task={task}
                                        key={'RunningTasksViewCoreRow' + index}
                                        index={index}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        handleFileOpen={handleFileOpen}
                                        handleEventOpen={handleEventOpen}
                                    />
                                ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[12, 24, 48]}
                component="div"
                count={filterTasks(statusFilter, timestampFilter).length}
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
                <Box sx={modalNoOverflowStyle}>
                    <Box
                        style={{
                            position: 'sticky',
                            zIndex: '1',
                            paddingLeft: '32px',
                            paddingTop: '15px',
                            marginRight: '10px',
                            backgroundColor: 'inherit',
                        }}
                    >
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
                    </Box>
                    <Box sx={modalStyle}>
                        {isLoadingEvent ? (
                            <LinearProgress />
                        ) : (
                            <EventsTable
                                id="modal-modal-description"
                                taskData={getEventsData()}
                            />
                        )}
                    </Box>
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
                        timestamp={getTimestamp()}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default RunningTasksViewCore;
