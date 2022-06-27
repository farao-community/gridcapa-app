/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { gridcapaFormatDate } from './commons';
import { GetApp } from '@material-ui/icons';

const INPUT_FILE_GROUP = 'input';
const OUTPUT_FILE_GROUP = 'output';

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

function FileGroupTableHead({ fileGroup }) {
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
                <TableCell>
                    <FormattedMessage id="download" />
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

function FileGroupTableRows({ fileGroup, processFiles }) {
    return (
        <TableBody>
            {processFiles.map((processFile, index) => (
                <FileDataRow
                    key={'file_' + index}
                    processFile={processFile}
                    fileGroup={fileGroup}
                />
            ))}
        </TableBody>
    );
}

function FileGroupTable({ fileGroup, processFiles }) {
    return (
        <>
            <FileGroupTableHead fileGroup={fileGroup} />
            <FileGroupTableRows
                processFiles={processFiles}
                fileGroup={fileGroup}
            />
        </>
    );
}

async function downloadFile(processFile) {
    const file = await fetch(processFile.fileUrl);

    const blob = await file.blob();
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = processFile.filename;

    downloadLink.click();
}

function createLink(processFile) {
    let result = '';
    if (processFile.fileUrl !== null) {
        result = (
            <Button onClick={() => downloadFile(processFile)}>
                <GetApp />
            </Button>
        );
    }

    return result;
}

function FileDataRow({ processFile, fileGroup }) {
    let fileType = processFile.fileType;
    let processFileStatus = processFile.processFileStatus;
    let lastModificationDate = gridcapaFormatDate(
        processFile.lastModificationDate
    );
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
            <TableCell data-test={fileType + '-' + fileGroup + '-latest-url'}>
                {createLink(processFile)}
            </TableCell>
        </TableRow>
    );
}

const OverviewTable = ({ inputs, outputs }) => {
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <FileGroupTable
                    fileGroup={INPUT_FILE_GROUP}
                    processFiles={inputs}
                />
                <FileGroupTable
                    fileGroup={OUTPUT_FILE_GROUP}
                    processFiles={outputs}
                />
            </Table>
        </TableContainer>
    );
};

export default OverviewTable;
