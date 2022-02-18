/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';
import React from 'react';
import {formatTimestampWithoutSecond} from './commons';

const processFileStatusStyles = {
    ERROR: {
        backgroundColor: 'red',
        color: 'white',
    },
    READY: {
        backgroundColor: 'limegreen',
        color: 'white',
    },
    RUNNING: {
        backgroundColor: 'blue',
        color: 'white',
    },
    SUCCESS: {
        backgroundColor: 'green',
        color: 'white',
    },

};

function fillTimestampCell(rowValue) {
    let taskTimestamp = rowValue === null ? [] : formatTimestampWithoutSecond(rowValue.timestamp);
    return (
        <TableCell data-test={taskTimestamp + '-task-timestamp'}>
            {taskTimestamp}</TableCell>
    );
}

function fillStatusCell(rowValue) {
    let taskStatus = rowValue === null ? [] : rowValue.status;
    return (
        <TableCell data-test={taskStatus + '-task-status'} style={processFileStatusStyles[taskStatus]}>
            {taskStatus}</TableCell>
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

const OverviewTableBusinessView = ({listTasksData}) => {
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="Timesatmp"/>
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="Status"/>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {listTasksData.map((input) => fillDataRow(input))}
                </TableBody>
            </Table>
        </TableContainer>
    );

}

export default OverviewTableBusinessView;