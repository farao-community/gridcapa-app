/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useCallback, useState } from 'react';

import SockJsClient from 'react-stomp';
import { FormattedMessage } from 'react-intl';
import { useSnackbar } from 'notistack';
import { useIntlRef } from '../utils/messages';

import FilterMenu from './filter-menu';
import { gridcapaFormatDate } from '../utils/commons';
import RunningTasksViewCoreRow from './running-tasks-view-core-row';
import EventDialog from './dialogs/event-dialog';
import FileDialog from './dialogs/file-dialog';

import {
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

import {
    fetchRunningTasksData,
    fetchTimestampData,
    getWebSocketUrl,
} from '../utils/rest-api';

const RunningTasksViewCore = () => {
    const { enqueueSnackbar } = useSnackbar();
    const intlRef = useIntlRef();

    const [openEvent, setOpenEvent] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [processEvents, setProcessEvents] = useState([]);
    const [modalEventOpen, setModalEventOpen] = useState(false);
    const [modalFileOpen, setModalFileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEvent, setIsLoadingEvent] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [statusFilter, setStatusFilter] = useState([]);
    const [timestampFilter, setTimestampFilter] = useState([]);
    const [timestampFilterRef, setTimestampFilterRef] = useState([]);

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
        initAllTasksAndProcessEvents();
    }, []); // With the empty array we ensure that the effect is only fired one time check the documentation https://reactjs.org/docs/hooks-effect.html

    const initAllTasksAndProcessEvents = async () => {
        setIsLoading(true);
        const newTasks = await fetchRunningTasksData();
        let newProcessEvents;
        if (newTasks && newTasks.length) {
            setTasks(newTasks);
            newProcessEvents = new Array(newTasks.length);
        } else {
            setTasks([]);
            newProcessEvents = [];
        }
        newProcessEvents.fill([]);
        setProcessEvents(newProcessEvents);
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
                processEvents[index] = res.processEvents;
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
        return index >= 0 ? processEvents[index] : [];
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
            <EventDialog
                open={modalEventOpen}
                onClose={handleEventClose}
                isLoadingEvent={isLoadingEvent}
                eventsData={getEventsData()}
            />
            <FileDialog
                open={modalFileOpen}
                onClose={handleFileClose}
                inputs={getFilesData('inputs') || []}
                outputs={getFilesData('outputs') || []}
                timestamp={getTimestamp()}
            />
        </div>
    );
};

export default RunningTasksViewCore;
