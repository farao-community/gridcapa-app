/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { FormattedMessage } from 'react-intl';
import { useSnackbar } from 'notistack';
import { useIntlRef } from '../utils/messages';

import FilterMenu from './filter-menu';
import { doFilterTasks } from '../utils/commons';
import RunningTasksViewCoreRow from './running-tasks-view-core-row';
import EventDialog from './dialogs/event-dialog';
import FileDialog from './dialogs/file-dialog';

import {
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';

import { fetchRunningTasksData, fetchTimestampData } from '../utils/rest-api';
import { addWebSocket, disconnect } from '../utils/websocket-api';
import { areSameDates, toISODate } from '../utils/date-time-utils.js';
import { applyTimestampFilterEffect } from '../utils/effect-utils.js';

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
    const websockets = useRef([]);

    useEffect(() => {
        applyTimestampFilterEffect(setTimestampFilter, setTimestampFilterRef);
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
                (task) => areSameDates(data, task)
            );
            if (globalIndex >= 0) {
                tasksCopy[globalIndex] = data;
                setTasks(tasksCopy);
            }
        },
        [tasks]
    );

    const getListOfTopics = useCallback(() => {
        return tasks.map((task) => '/task/update/' + toISODate(task.timestamp));
    }, [tasks]);

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
        const newStatusFilter = filters.map((filter) => filter.toUpperCase());
        setStatusFilter(newStatusFilter);
        if (isBeforeCurrentPage(newStatusFilter, timestampFilter)) {
            setPage(
                Math.floor(
                    filterTasks(newStatusFilter, timestampFilter).length / rowsPerPage
                )
            );
        }
    };

    const handleTimestampFilterChange = (filters) => {
        const newTimestampFilter = filters.map((filter) => filter.toUpperCase());
        setTimestampFilter(newTimestampFilter);
        if (isBeforeCurrentPage(statusFilter, newTimestampFilter)) {
            setPage(getCurrentPage(statusFilter, newTimestampFilter));
        }
    };

    const filterTasks = (currentStatusFilter, currentTimestampFilter) => {
        return doFilterTasks(tasks, (t) => t, currentStatusFilter, currentTimestampFilter);
    };

    function isBeforeCurrentPage(statusFilter, timestampFilter) {
        return filterTasks(statusFilter, timestampFilter).length < page * rowsPerPage;
    }

    function getCurrentPage(statusFilter, timestampFilter) {
        return Math.floor(
            filterTasks(statusFilter, timestampFilter).length / rowsPerPage
        );
    }


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

    useEffect(() => {
        if (websockets.current.length === 0) {
            addWebSocket(
                websockets,
                getListOfTopics(),
                handleTimestampMessage
            );
        }
        // 👇️ The above function runs when the component unmounts 👇️
        return () => disconnect(websockets);
    }, [getListOfTopics, handleTimestampMessage]);

    return (
        <div>
            <TableContainer
                style={{maxHeight: '73vh', minHeight: '63vh'}}
                component={Paper}
            >
                <Table className="table">
                    <TableHead>
                        <TableRow>
                            <TableCell size="small">
                                <FormattedMessage id="timestamp"/>
                                <FilterMenu
                                    filterHint="filterOnTimestamp"
                                    handleChange={handleTimestampFilterChange}
                                    currentFilter={timestampFilter}
                                    manual={timestampFilterRef.length <= 0}
                                    predefinedValues={timestampFilterRef}
                                />
                            </TableCell>
                            <TableCell size="small">
                                <FormattedMessage id="globalViewCoreFiles"/>
                            </TableCell>
                            <TableCell size="small">
                                <FormattedMessage id="status"/>
                                <FilterMenu
                                    filterHint="filterOnStatus"
                                    handleChange={handleStatusFilterChange}
                                    currentFilter={statusFilter}
                                />
                            </TableCell>
                            <TableCell size="small">
                                <FormattedMessage id="globalViewCoreAction"/>
                            </TableCell>
                            <TableCell size="small">
                                <FormattedMessage id="events"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <LinearProgress/>
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
                labelRowsPerPage={<FormattedMessage id="RowsPerPage"/>}
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
