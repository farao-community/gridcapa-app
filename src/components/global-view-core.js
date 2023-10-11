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
    fetchBusinessDateData,
    fetchTimestampData,
    getWebSocketUrl,
} from '../utils/rest-api';
import FilterMenu from './filter-menu';
import { gridcapaFormatDate } from './commons';
import GlobalViewCoreRow from './global-view-core-row';
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

const GlobalViewCore = ({ timestampMin, timestampMax, timestampStep }) => {
    const [openEvent, setOpenEvent] = React.useState([]);
    const [steps, setSteps] = React.useState(
        createAllSteps(timestampMin, timestampMax, timestampStep)
    );
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

    const getListOfTopics = () => {
        return [
            '/task/update/' +
                new Date(timestampMin).toISOString().substr(0, 10),
            '/task/update/' +
                new Date(timestampMax).toISOString().substr(0, 10),
        ];
    };

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
                steps[index].taskData.processEvents = res.processEvents;
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
                        if (globalIndex >= 0)
                            allSteps[globalIndex].taskData = td;
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
        return index >= 0 ? steps[index].taskData : [];
    };

    const getFilesData = (field) => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? steps[index].taskData[field] : [];
    };

    const getTimestamp = () => {
        let index = openEvent.indexOf(true);
        return index >= 0 ? steps[index].taskData.timestamp : null;
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
                    {isLoadingEvent ? (
                        <LinearProgress />
                    ) : (
                        <EventsTable
                            id="modal-modal-description"
                            taskData={getEventsData()}
                        />
                    )}
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

export default GlobalViewCore;
