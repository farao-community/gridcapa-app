/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { TableBody, TableCell, TableRow } from '@mui/material';
import { gridcapaFormatDate, sha256 } from '../../utils/commons';

const eventLevelColor = {
    INFO: 'green',
    WARN: 'orange',
    ERROR: 'red',
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

export default EventsTableBody;
