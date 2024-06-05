/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

import { FormattedMessage } from 'react-intl';
import EventsTableBody from './events-table-body';

function StructuredLogsTable({ eventsData }) {
    return (
        <TableContainer component={Paper}>
            <Table>
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
                <EventsTableBody eventsData={eventsData} />
            </Table>
        </TableContainer>
    );
}

StructuredLogsTable.propTypes = {
    eventsData: PropTypes.array.isRequired,
};

export default StructuredLogsTable;
