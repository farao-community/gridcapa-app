/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import {
    Button,
    TextField,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { FilterList } from '@material-ui/icons';
import { gridcapaFormatDate, sha256 } from './commons';

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
    const [anchorLevelEl, setAnchorLevelEl] = React.useState(null);
    const [anchorLogEl, setAnchorLogEl] = React.useState(null);

    const [processEvents] = React.useState(taskData.processEvents);
    const [filtredProcessEvents, setFiltredProcessEvents] = React.useState(
        taskData.processEvents
    );

    const [levelFilter, setLevelFilter] = React.useState('');
    const [logFilter, setLogFilter] = React.useState('');
    const handleLevelMenuClick = (event) => {
        setAnchorLevelEl(event.currentTarget);
    };

    const handleLevelChange = (event) => {
        setLevelFilter(event.currentTarget.value.toUpperCase());
        filterProcessEvent(event.currentTarget.value.toUpperCase(), logFilter);
    };

    const handleLogMenuClick = (event) => {
        setAnchorLogEl(event.currentTarget);
    };
    const handleLogChange = (event) => {
        setLogFilter(event.currentTarget.value.toUpperCase());
        filterProcessEvent(
            levelFilter,
            event.currentTarget.value.toUpperCase()
        );
    };

    const filterProcessEvent = (currentEventFIlter, currentLogFilter) => {
        let filtered;
        filtered = processEvents.filter(
            (event) =>
                event.level.includes(currentEventFIlter) &&
                event.message.toUpperCase().includes(currentLogFilter)
        );
        setFiltredProcessEvents(filtered);
    };

    const handleCloseLevel = () => {
        setAnchorLevelEl(null);
    };
    const handleCloseLog = () => {
        setAnchorLogEl(null);
    };

    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="level" />
                            <span>
                                <Button
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleLevelMenuClick}
                                    style={{
                                        color:
                                            logFilter === ''
                                                ? 'inherit'
                                                : '#3F51b5',
                                    }}
                                >
                                    <FilterList />
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorLevelEl}
                                    keepMounted
                                    open={Boolean(anchorLevelEl)}
                                    onClose={handleCloseLevel}
                                >
                                    <MenuItem>
                                        <TextField
                                            id="levelTextField"
                                            label={
                                                <FormattedMessage id="filterOnLevel" />
                                            }
                                            type="text"
                                            defaultValue={levelFilter}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={handleLevelChange}
                                        />
                                    </MenuItem>
                                </Menu>
                            </span>
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="timestamp" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="eventDescription" />
                            <span>
                                <Button
                                    aria-controls="simple-menu"
                                    aria-haspopup="true"
                                    onClick={handleLogMenuClick}
                                    style={{
                                        color:
                                            logFilter === ''
                                                ? 'inherit'
                                                : '#3F51b5',
                                    }}
                                >
                                    <FilterList />
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorLogEl}
                                    keepMounted
                                    open={Boolean(anchorLogEl)}
                                    onClose={handleCloseLog}
                                >
                                    <MenuItem>
                                        <TextField
                                            id="levelTextField"
                                            label={
                                                <FormattedMessage id="filterOnLog" />
                                            }
                                            type="text"
                                            defaultValue={logFilter}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={handleLogChange}
                                        />
                                    </MenuItem>
                                </Menu>
                            </span>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filtredProcessEvents?.map((processEvent) =>
                        inputDataRow(processEvent)
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EventsTable;
