/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
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
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { gridcapaFormatDate } from './commons';
import DownloadButton from './download-button';
import UploadButton from './upload-button';

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
    // Hiding Upload button for now until we complete the feature
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
                {false && ( // never use null as false
                    <TableCell>
                        <FormattedMessage id="upload" />
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}

function FileGroupTableRows({ fileGroup, processFiles, timestamp }) {
    return (
        <TableBody>
            {processFiles.map((processFile, index) => (
                <FileDataRow
                    key={'file_' + index}
                    processFile={processFile}
                    fileGroup={fileGroup}
                    timestamp={timestamp}
                />
            ))}
        </TableBody>
    );
}

function FileGroupTable({ fileGroup, processFiles, timestamp }) {
    return (
        <>
            <FileGroupTableHead fileGroup={fileGroup} />
            <FileGroupTableRows
                processFiles={processFiles}
                fileGroup={fileGroup}
                timestamp={timestamp}
            />
        </>
    );
}

function FileDataRow({ processFile, fileGroup, timestamp }) {
    let fileType = processFile.fileType;
    let processFileStatus = processFile.processFileStatus;
    let lastModificationDate = gridcapaFormatDate(
        processFile.lastModificationDate
    );
    // Hiding Upload button for now until we complete the feature
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
                <DownloadButton
                    processFile={processFile}
                    timestamp={timestamp}
                />
            </TableCell>
            {false && ( // never use null as false
                <TableCell
                    data-test={fileType + '-' + fileGroup + '-latest-url'}
                >
                    <UploadButton
                        processFile={processFile}
                        timestamp={timestamp}
                    />
                </TableCell>
            )}
        </TableRow>
    );
}

const OverviewTable = ({ inputs, outputs, timestamp }) => {
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <FileGroupTable
                    fileGroup={INPUT_FILE_GROUP}
                    processFiles={inputs}
                    timestamp={timestamp}
                />
                <FileGroupTable
                    fileGroup={OUTPUT_FILE_GROUP}
                    processFiles={outputs}
                    timestamp={timestamp}
                />
            </Table>
        </TableContainer>
    );
};

export default OverviewTable;
