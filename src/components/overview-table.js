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

function inputDataRow(input) {
    let inputFileType = input.fileType;
    let processFileStatus = input.processFileStatus;
    let lastModificationDate =
        input.lastModificationDate === null
            ? null
            : formatTimeStamp(input.lastModificationDate);
    return (
        <TableRow>
            <TableCell data-test={inputFileType + '-input-type'}>
                {inputFileType}
            </TableCell>
            <TableCell
                data-test={inputFileType + '-input-status'}
                style={processFileStatusStyles[processFileStatus]}
            >
                {processFileStatus}
            </TableCell>
            <TableCell data-test={inputFileType + '-input-filename'}>
                {input.filename}
            </TableCell>
            <TableCell data-test={inputFileType + '-input-latest-modification'}>
                {lastModificationDate}
            </TableCell>
        </TableRow>
    );
}

const OverviewTable = ({ taskData }) => {
    let inputs = taskData === null ? [] : taskData.processFiles;
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="inputs" />
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
                <TableBody>
                    {inputs.map((input) => inputDataRow(input))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OverviewTable;
