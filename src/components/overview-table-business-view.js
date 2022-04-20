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
import { formatTimestampWithoutSecond } from './commons';
import { useSelector } from 'react-redux';
import { PARAM_THEME } from '../utils/config-params';
import { getTaskStatusStyle } from './task-status-style';

function TaskStatusCell(props) {
    const theme = useSelector((state) => state[PARAM_THEME]);

    return (
        <TableCell
            {...props}
            style={{ ...getTaskStatusStyle(props.taskStatus, theme) }}
        >
            {props.taskStatus}
        </TableCell>
    );
}

function fillDataRow(rowValue) {
    let taskTimestamp =
        rowValue === null
            ? []
            : formatTimestampWithoutSecond(rowValue.timestamp);
    let taskStatus = rowValue === null ? [] : rowValue.status;

    return (
        <TableRow>
            <TableCell data-test={taskTimestamp + '-task-timestamp'}>
                {taskTimestamp}
            </TableCell>
            <TaskStatusCell
                data-test={taskTimestamp + '-task-status'}
                taskStatus={taskStatus}
            />
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
                            <FormattedMessage id="Timestamp" />
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
