/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useCallback, useState, useRef } from 'react';

import { FormattedMessage } from 'react-intl';
import { useSnackbar } from 'notistack';
import { useIntlRef } from '../utils/messages';

import FilterMenu from './filter-menu';
import { gridcapaFormatDate } from '../utils/commons';
import GlobalViewCoreRow from './global-view-core-row';
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

import { fetchBusinessDateData, fetchTimestampData } from '../utils/rest-api';
import {
    connectTaskNotificationWebSocket,
    disconnectTaskNotificationWebSocket,
} from '../utils/websocket-api';

const createAllSteps = (timestampMin, timestampMax, timestampStep) => {
    let currentTimeStamp = timestampMin;
    let array = timestampStep.split(':');
    let seconds =
        Number.parseInt(array[0], 10) * 3600 +
        Number.parseInt(array[1], 10) * 60;
    let result = [];

    while (currentTimeStamp <= timestampMax) {
        let elem = { timestamp: currentTimeStamp };
        result.push(elem);
        currentTimeStamp += seconds * 1000;
    }

    return result;
};

const GlobalViewCore = ({ timestampMin, timestampMax, timestampStep }) => {
    const { enqueueSnackbar } = useSnackbar();
    const intlRef = useIntlRef();

    const [openEvent, setOpenEvent] = useState([]);
    const [steps, setSteps] = useState(
        createAllSteps(timestampMin, timestampMax, timestampStep)
    );
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
    }, []); // With the empty array we ensure that the effect is only fired one time check the documentation https://reactjs.org/docs/hooks-effect.html

    const handleTimestampMessage = useCallback(
        async (event) => {
            const data = event;
            const stepsCopy = [...steps];
            let globalIndex = stepsCopy.findIndex(
                (step) =>
                    Date.parse(data.timestamp) === step.timestamp ||
                    data.timestamp === step.timestamp
            );
            if (globalIndex >= 0) {
                stepsCopy[globalIndex].taskData = data;
                setSteps(stepsCopy);
            }
        },
        [steps]
    );

    const getListOfTopics = useCallback(() => {
        return [
            '/task/update/' +
                new Date(timestampMin).toISOString().substr(0, 10),
            '/task/update/' +
                new Date(timestampMax).toISOString().substr(0, 10),
        ];
    }, [timestampMin, timestampMax]);

    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
        getMissingData(steps, newPage, rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        getMissingData(steps, 0, event.target.value);
    };

    const handleEventOpen = (step) => {
        let index = steps.findIndex(
            (inSteps) => inSteps.timestamp === step.timestamp
        );
        setIsLoadingEvent(true);
        openEvent[index] = true;
        setModalEventOpen(true);
        if (index >= 0) {
            fetchTimestampData(
                new Date(steps[index].timestamp).toISOString(),
                intlRef,
                enqueueSnackbar
            ).then((res) => {
                steps[index].eventsData = res.processEvents;
                setIsLoadingEvent(false);
            });
        }
    };

    const handleEventClose = () => {
        let index = openEvent.indexOf(true);
        openEvent[index] = false;
        setModalEventOpen(false);
    };

    const handleFileOpen = (step) => {
        let index = steps.findIndex(
            (inSteps) => inSteps.timestamp === step.timestamp
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
            filterSteps(newFilter, timestampFilter).length <
            page * rowsPerPage
        ) {
            setPage(
                Math.floor(
                    filterSteps(newFilter, timestampFilter).length / rowsPerPage
                )
            );
        }
    };

    const handleTimestampFilterChange = (filters) => {
        let newFilter = filters.map((filter) => filter.toUpperCase());
        setTimestampFilter(newFilter);
        if (filterSteps(statusFilter, newFilter).length < page * rowsPerPage) {
            setPage(
                Math.floor(
                    filterSteps(statusFilter, newFilter).length / rowsPerPage
                )
            );
        }
    };

    const filterSteps = (currentStatusFilter, currentTimestampFilter) => {
        // gridcapaFormatDate is not accessible inside the filter we have to use an intermediate
        let formatDate = gridcapaFormatDate;
        return steps.filter((step) => {
            return (
                step.taskData &&
                (currentStatusFilter.length === 0 ||
                    (currentStatusFilter.length > 0 &&
                        currentStatusFilter.some((f) =>
                            step.taskData.status.includes(f)
                        ))) &&
                (currentTimestampFilter.length === 0 ||
                    (currentTimestampFilter.length > 0 &&
                        currentTimestampFilter.some((f) =>
                            formatDate(step.taskData.timestamp).includes(f)
                        )))
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
                        if (globalIndex >= 0) {
                            allSteps[globalIndex].taskData = td;
                        }
                    });
                });
                setIsLoading(false);
                setSteps(allSteps);
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
        return index >= 0 ? steps[index].eventsData : [];
    };

    const getFilesData = (field) => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? steps[index].taskData[field] : [];
    };

    const getTimestamp = () => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? steps[index].taskData.timestamp : null;
    };

    useEffect(() => {
        if (websockets.current.length === 0) {
            const taskNotificationClient = connectTaskNotificationWebSocket(
                getListOfTopics(),
                handleTimestampMessage
            );
            websockets.current.push(taskNotificationClient);
        }

        // 👇️ The above function runs when the component unmounts 👇️
        return () => {
            websockets.current.forEach(disconnectTaskNotificationWebSocket);
            websockets.current = [];
        };
    }, [getListOfTopics, handleTimestampMessage]);

    return (
        <div>
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
                                    manual={timestampFilterRef?.length <= 0}
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
                            filterSteps(statusFilter, timestampFilter)
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((step, index) => (
                                    <GlobalViewCoreRow
                                        step={step}
                                        key={'GlobalViewCoreRow' + index}
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
                count={filterSteps(statusFilter, timestampFilter).length}
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

export default GlobalViewCore;
