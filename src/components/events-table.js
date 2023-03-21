/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { gridcapaFormatDate, sha256 } from './commons';
import FilterMenu from './filter-menu';

const processEventLevelStyles = {
    INFO: {
        color: 'green',
    },
    WARN: {
        color: 'orange',
    },
    ERROR: {
        color: 'red',
    },
};

function inputDataRow(processEvent) {
    let level = processEvent.level;
    let timestamp = processEvent.timestamp;
    let message = processEvent.message;
    let encryptedMessage = sha256(message);

    let formattedTimestamp = gridcapaFormatDate(timestamp);

    return (
        <TableRow key={timestamp + encryptedMessage}>
            <TableCell
                data-test={encryptedMessage + '-process-event-level'}
                style={{ ...processEventLevelStyles[level], width: '9vw' }}
            >
                {level}
            </TableCell>
            <TableCell
                data-test={encryptedMessage + '-process-event-timestamp'}
            >
                {formattedTimestamp}
            </TableCell>
            <TableCell data-test={encryptedMessage + '-process-event-message'}>
                {message}
            </TableCell>
        </TableRow>
    );
}

const EventsTable = ({ taskData }) => {
    const [eventPredefinedFilter, setEventPredefinedFilter] = useState([]);
    const [levelFilter, setLevelFilter] = useState([]);
    const [logFilter, setLogFilter] = useState([]);

    useEffect(() => {
        fetch('process-metadata.json')
            .then((res) => res.json())
            .then((res) => {
                const filter = res.eventPredefinedFilter;
                setEventPredefinedFilter(filter);
                let newtoFilter = [];
                filter.forEach((f) => {
                    if (f.defaultChecked && f.defaultChecked === true) {
                        newtoFilter.push(...f.filterValue);
                    }
                });
                newtoFilter = Array.from(new Set(newtoFilter));
                setLogFilter(newtoFilter);
            });
    }, []);

    const handleLevelChange = (filter) => {
        setLevelFilter(filter);
    };

    const handleLogChange = (filter) => {
        setLogFilter(filter);
    };

    const isCurrentLogFilterAddErrors = (currentLogFilter) => {
        let result = false;
        eventPredefinedFilter.forEach((f) => {
            if (
                f.addErrors &&
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
    };

    const filterProcessEvent = (currentEventFilter, currentLogFilter) => {
        let isAddErrors = isCurrentLogFilterAddErrors(currentLogFilter);
        let filtered;
        filtered = taskData.processEvents.filter(
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

        return filtered;
    };

    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '12%' }}>
                            <FormattedMessage id="level" />
                            <FilterMenu
                                filterHint="filterOnLevel"
                                handleChange={handleLevelChange}
                                currentFilter={levelFilter}
                            />
                        </TableCell>
                        <TableCell style={{ width: '12%' }}>
                            <FormattedMessage id="timestamp" />
                        </TableCell>
                        <TableCell style={{ width: '76%' }}>
                            <FormattedMessage id="eventDescription" />
                            <FilterMenu
                                filterHint="filterOnLog"
                                handleChange={handleLogChange}
                                currentFilter={logFilter}
                                manual={true}
                                predefinedValues={eventPredefinedFilter}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filterProcessEvent(
                        levelFilter,
                        logFilter
                    )?.map((processEvent) => inputDataRow(processEvent))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EventsTable;
