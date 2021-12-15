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
import {FormattedMessage} from 'react-intl';
import {formatTimeStamp} from './commons';

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
    let formattedTimestamp =
        timestamp === null ? null : formatTimeStamp(timestamp);
    return (
        <TableRow>
            <TableCell data-test={timestamp + '-process-event-level'}
                       style={processEventLevelStyles[level]}
            >
                {level}
            </TableCell>
            <TableCell data-test={timestamp + '-process-event-timestamp'}>
                {formattedTimestamp}
            </TableCell>
            <TableCell data-test={timestamp + '-process-event-message'}>
                {processEvent.message}
            </TableCell>
        </TableRow>
    );
}

const EventsTable = ({taskData}) => {
    let processEvents = taskData === null ? [] : taskData.processEvents;
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="level"/>
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="timestamp"/>
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="eventDescription"/>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processEvents.map((processEvent) => inputDataRow(processEvent))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EventsTable;
