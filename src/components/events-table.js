/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
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
    const [levelFilter, setLevelFilter] = React.useState('');
    const [logFilter, setLogFilter] = React.useState('');

    const handleLevelChange = (event) => {
        setLevelFilter(event.currentTarget.value);
    };

    const handleLogChange = (event) => {
        setLogFilter(event.currentTarget.value);
    };

    const filterProcessEvent = (currentEventFilter, currentLogFilter) => {
        let filtered;
        filtered = taskData.processEvents.filter(
            (event) =>
                event.level
                    .toUpperCase()
                    .includes(currentEventFilter.toUpperCase()) &&
                event.message
                    .toUpperCase()
                    .includes(currentLogFilter.toUpperCase())
        );

        return filtered;
    };

    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="level" />
                            <FilterMenu
                                filterHint="filterOnLevel"
                                handleChange={handleLevelChange}
                                currentFilter={levelFilter}
                            />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="timestamp" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="eventDescription" />
                            <FilterMenu
                                filterHint="filterOnLog"
                                handleChange={handleLogChange}
                                currentFilter={logFilter}
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
