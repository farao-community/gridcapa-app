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
import { formatTimeStamp, sha256 } from './commons';

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

    let formattedTimestamp =
        timestamp === null ? null : formatTimeStamp(timestamp);

    return (
        <TableRow>
            <TableCell
                data-test={encryptedMessage + '-process-event-level'}
                style={processEventLevelStyles[level]}
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
    let processEvents = taskData === null ? [] : taskData.processEvents;
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="level" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="timestamp" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="eventDescription" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processEvents.map((processEvent) =>
                        inputDataRow(processEvent)
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EventsTable;
