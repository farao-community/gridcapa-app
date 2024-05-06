/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    FormControl,
    Select,
    MenuItem,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { gridcapaFormatDate } from '../utils/commons';
import DownloadButton from './buttons/download-button';
import UploadButton from './upload-button';
import { fetchTaskManagerSelectFile } from '../utils/rest-api';
import SelectFileDialog from './dialogs/select-file-dialog';

const INPUT_FILE_GROUP = 'input';
const OUTPUT_FILE_GROUP = 'output';
const SELECT_STYLES = {
    padding: 0,
    minWidth: '200px',
};
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
                {fileGroup === INPUT_FILE_GROUP && (
                    <TableCell>
                        <FormattedMessage id="upload" />
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}

function FileGroupTableRows({
    fileGroup,
    availableInputs,
    processFiles,
    timestamp,
}) {
    return (
        <TableBody>
            {processFiles.map((processFile, index) => (
                <FileDataRow
                    key={'file_' + index}
                    processFile={processFile}
                    availableInputs={availableInputs}
                    fileGroup={fileGroup}
                    timestamp={timestamp}
                />
            ))}
        </TableBody>
    );
}

function FileGroupTable({
    fileGroup,
    processFiles,
    availableInputs,
    timestamp,
}) {
    return (
        <>
            <FileGroupTableHead fileGroup={fileGroup} />
            <FileGroupTableRows
                processFiles={processFiles}
                availableInputs={availableInputs}
                fileGroup={fileGroup}
                timestamp={timestamp}
            />
        </>
    );
}
function FileDataRow({ processFile, availableInputs, fileGroup, timestamp }) {
    const [open, setOpen] = useState(false);
    let fileType = processFile.fileType;
    let processFilename = processFile.fileName;
    let [selectedFilename, setSelectedFilename] = useState('');
    let processFileStatus = processFile.processFileStatus;
    let lastModificationDate = gridcapaFormatDate(
        processFile.lastModificationDate
    );
    const handleClickOpen = (event) => {
        setOpen(true);
        setSelectedFilename(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFilename('');
    };

    const selectFile = async () => {
        await fetchTaskManagerSelectFile(timestamp, fileType, selectedFilename);
        handleClose();
    };

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
                {availableInputs !== undefined ? (
                    <FormControl>
                        <Select
                            sx={SELECT_STYLES}
                            displayEmpty
                            onChange={handleClickOpen}
                            value={processFilename}
                        >
                            <MenuItem value={processFilename}>
                                <em>{processFilename}</em>
                            </MenuItem>

                            {availableInputs
                                .filter(
                                    (input) =>
                                        input.fileType === fileType &&
                                        input.fileName !== processFilename
                                )
                                .map((input) => (
                                    <MenuItem value={input.fileName}>
                                        {input.fileName}
                                    </MenuItem>
                                ))}
                        </Select>
                        <SelectFileDialog
                            open={open}
                            handleClose={handleClose}
                            fileType={fileType}
                            selectFile={selectFile}
                        />
                    </FormControl>
                ) : (
                    processFilename
                )}
            </TableCell>
            <TableCell
                data-test={fileType + '-' + fileGroup + '-latest-modification'}
            >
                {lastModificationDate}
            </TableCell>
            <TableCell
                data-test={fileType + '-' + fileGroup + '-latest-url'}
                align="center"
            >
                <DownloadButton
                    processFile={processFile}
                    timestamp={timestamp}
                />
            </TableCell>
            {fileGroup === INPUT_FILE_GROUP && ( // never use null as false
                <TableCell
                    data-test={fileType + '-' + fileGroup + '-latest-url'}
                    align="center"
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

const OverviewTable = ({ inputs, availableInputs, outputs, timestamp }) => {
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <FileGroupTable
                    fileGroup={INPUT_FILE_GROUP}
                    processFiles={inputs}
                    availableInputs={availableInputs}
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
