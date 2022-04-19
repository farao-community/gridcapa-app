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
import { formatTimeStamp } from './commons';

const processFileStatusStyles = {
    NOT_PRESENT: {
        backgroundColor: 'grey',
        color: 'white',
    },
    VALIDATED: {
        backgroundColor: 'green',
        color: 'white',
    },
};
function processFileGroupTableHead(fileGroup) {
    return (
        <TableHead>
            <TableRow>
                <TableCell>
                    <FormattedMessage id={fileGroup} />
                </TableCell>
                <TableCell>
                    <FormattedMessage id="status" />
                </TableCell>
                <TableCell>
                    <FormattedMessage id="filename" />
                </TableCell>
                <TableCell>
                    <FormattedMessage id="latestModification" />
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

function processFileGroupTableRows(processFiles, fileGroup) {
    return (
        <TableBody>
            {processFiles.map((processFile) =>
                processFileDataRow(processFile, fileGroup)
            )}
        </TableBody>
    );
}

function processFileDataRow(processFile, fileGroup) {
    let fileType = processFile.fileType;
    let processFileStatus = processFile.processFileStatus;
    let lastModificationDate =
        processFile.lastModificationDate === null
            ? null
            : formatTimeStamp(processFile.lastModificationDate);
    return (
        <TableRow>
            <TableCell data-test={fileType + '-' + fileGroup + '-type'}>
                {fileType}
            </TableCell>
            <TableCell
                data-test={fileType + '-' + fileGroup + '-status'}
                style={processFileStatusStyles[processFileStatus]}
            >
                {processFileStatus}
            </TableCell>
            <TableCell data-test={fileType + '-' + fileGroup + '-filename'}>
                {processFile.filename}
            </TableCell>
            <TableCell
                data-test={fileType + '-' + fileGroup + '-latest-modification'}
            >
                {lastModificationDate}
            </TableCell>
        </TableRow>
    );
}

const OverviewTable = ({ taskData }) => {
    let inputFileGroup = 'inputs';
    let inputs = taskData === null ? [] : taskData.inputs;

    let outputFileGroup = 'outputs';
    let outputs = taskData === null ? [] : taskData.outputs;
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                {processFileGroupTableHead(inputFileGroup)}
                {processFileGroupTableRows(inputs, inputFileGroup)}
                {processFileGroupTableHead(outputFileGroup)}
                {processFileGroupTableRows(outputs, outputFileGroup)}
            </Table>
        </TableContainer>
    );
};

export default OverviewTable;
