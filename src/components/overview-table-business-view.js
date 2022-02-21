/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
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
import React from 'react';
import { formatTimestampWithoutSecond, getBackgroundColor } from './commons';

function fillTimestampCell(rowValue) {
    let taskTimestamp = rowValue === null ? [] : rowValue.timestamp;
    return (
        <TableCell data-test={taskTimestamp + '-task-timestamp'}>
            {formatTimestampWithoutSecond(taskTimestamp)}
        </TableCell>
    );
}

function fillStatusCell(rowValue) {
    let taskStatus = rowValue === null ? [] : rowValue.status;
    return (
        <TableCell
            data-test={taskStatus + '-task-status'}
            style={{
                backgroundColor: getBackgroundColor(taskStatus),
                color: 'white',
            }}
        >
            {taskStatus}
        </TableCell>
    );
}

function fillDataRow(task) {
    return (
        <TableRow>
            {fillTimestampCell(task)}
            {fillStatusCell(task)}
        </TableRow>
    );
}

const OverviewTableBusinessView = ({ listTasksData }) => {
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="Timesatmp" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="Status" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listTasksData.map((input) => fillDataRow(input))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OverviewTableBusinessView;
