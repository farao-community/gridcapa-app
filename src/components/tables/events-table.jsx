/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import FilterMenu from '../filter-menu';
import { gridcapaFormatDate, sha256 } from '../../utils/commons';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

function loadPredefinedFilter(
    predefinedFilter,
    setPredefinedFilter,
    setActiveFilter
) {
    setPredefinedFilter(predefinedFilter);
    let activePredefinedFilter = [];
    predefinedFilter.forEach((f) => {
        if (f.defaultChecked && f.defaultChecked === true) {
            activePredefinedFilter.push(...f.filterValue);
        }
    });
    activePredefinedFilter = Array.from(new Set(activePredefinedFilter));
    setActiveFilter(activePredefinedFilter);
}

function isCurrentLogFilterAddErrors(
    currentLogFilter,
    eventLogPredefinedFilter
) {
    let result = false;
    eventLogPredefinedFilter.forEach((f) => {
        if (
            f.addErrors === true &&
            JSON.stringify(currentLogFilter).includes(
                JSON.stringify(f.filterValue)
                    .replaceAll('[', '')
                    .replaceAll(']', '')
            )
        ) {
            result = true;
        }
    });
    return result;
}

function filterProcessEvent(
    eventsData,
    currentEventFilter,
    currentLogFilter,
    eventLogPredefinedFilter
) {
    let isAddErrors = isCurrentLogFilterAddErrors(
        currentLogFilter,
        eventLogPredefinedFilter
    );
    let filtered = [];
    if (eventsData) {
        filtered = eventsData.filter(
            (event) =>
                (currentEventFilter.length === 0 ||
                    (currentEventFilter.length > 0 &&
                        currentEventFilter.some((f) =>
                            event.level.toUpperCase().includes(f.toUpperCase())
                        ))) &&
                (currentLogFilter.length === 0 ||
                    (currentLogFilter.length > 0 &&
                        (currentLogFilter.some((f) =>
                            event.message
                                .toUpperCase()
                                .includes(f.toUpperCase())
                        ) ||
                            (isAddErrors &&
                                event.level.toUpperCase() === 'ERROR'))))
        );
    }

    return filtered;
}

const EventsTable = ({ eventsData }) => {
    const [eventLevelPredefinedFilter, setEventLevelPredefinedFilter] =
        useState([]);
    const [eventLogPredefinedFilter, setEventLogPredefinedFilter] = useState(
        []
    );
    const [levelFilter, setLevelFilter] = useState([]);
    const [logFilter, setLogFilter] = useState([]);

    useEffect(() => {
        fetch('process-metadata.json')
            .then((res) => res.json())
            .then((res) => {
                loadPredefinedFilter(
                    res.eventLevelPredefinedFilter,
                    setEventLevelPredefinedFilter,
                    setLevelFilter
                );
                loadPredefinedFilter(
                    res.eventLogPredefinedFilter,
                    setEventLogPredefinedFilter,
                    setLogFilter
                );
            });
    }, []);

    const handleLevelChange = (filter) => {
        setLevelFilter(filter);
    };

    const handleLogChange = (filter) => {
        setLogFilter(filter);
    };

    return (
        <TableContainer component={Paper} sx={{ overflowX: 'initial' }}>
            <Table className="table" stickyHeader>
                <EventTableHeader
                    onLevelChange={handleLevelChange}
                    levelFilter={levelFilter}
                    eventLevelPredefinedFilter={eventLevelPredefinedFilter}
                    onLogChange={handleLogChange}
                    logFilter={logFilter}
                    eventLogPredefinedFilter={eventLogPredefinedFilter}
                />
                <EventsTableBody
                    eventsData={filterProcessEvent(
                        eventsData,
                        levelFilter,
                        logFilter,
                        eventLogPredefinedFilter
                    )}
                />
            </Table>
        </TableContainer>
    );
};

EventsTable.propTypes = {
    eventsData: PropTypes.array.isRequired,
};

export default EventsTable;

function EventTableHeader({
    onLevelChange,
    levelFilter,
    eventLevelPredefinedFilter,
    onLogChange,
    logFilter,
    eventLogPredefinedFilter,
}) {
    return (
        <TableHead>
            <TableRow>
                <TableCell sx={{ width: '12%' }}>
                    <FormattedMessage id="level" />
                    <FilterMenu
                        filterHint="filterOnLevel"
                        handleChange={onLevelChange}
                        currentFilter={levelFilter}
                        predefinedValues={eventLevelPredefinedFilter}
                    />
                </TableCell>
                <TableCell sx={{ width: '12%' }}>
                    <FormattedMessage id="timestamp" />
                </TableCell>
                <TableCell sx={{ width: '76%' }}>
                    <FormattedMessage id="eventDescription" />
                    <FilterMenu
                        filterHint="filterOnLog"
                        handleChange={onLogChange}
                        currentFilter={logFilter}
                        manual={true}
                        predefinedValues={eventLogPredefinedFilter}
                    />
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

EventTableHeader.propTypes = {
    onLevelChange: PropTypes.func.isRequired,
    levelFilter: PropTypes.array.isRequired,
    eventLevelPredefinedFilter: PropTypes.array.isRequired,
    onLogChange: PropTypes.func.isRequired,
    logFilter: PropTypes.array.isRequired,
    eventLogPredefinedFilter: PropTypes.array.isRequired,
};

const eventLevelColor = {
    INFO: 'green',
    WARN: 'orange',
    ERROR: 'red',
    DEBUG: 'royalblue',
};

function formattedMessage(message) {
    return message.split('\n').map((line, index) => <p key={index}>{line}</p>);
}

function EventsTableBody({ eventsData }) {
    return (
        <TableBody>
            {eventsData.map((event) => (
                <TableRow key={`${event.timestamp} ${sha256(event.message)}`}>
                    <TableCell sx={{ color: eventLevelColor[event.level] }}>
                        {event.level}
                    </TableCell>
                    <TableCell>{gridcapaFormatDate(event.timestamp)}</TableCell>
                    <TableCell>{formattedMessage(event.message)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
}

EventsTableBody.propTypes = {
    eventsData: PropTypes.array.isRequired,
};
