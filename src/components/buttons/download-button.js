/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { useSnackbar } from 'notistack';
import { useIntlRef } from '../../utils/messages';

import { Button, CircularProgress } from '@mui/material';
import { GetApp } from '@mui/icons-material';

import { fetchFileFromProcess } from '../../utils/rest-api';

async function downloadFile(processFile, timestamp, intlRef, enqueueSnackbar) {
    const blob = await fetchFileFromProcess(
        timestamp,
        processFile.fileType,
        intlRef,
        enqueueSnackbar
    );
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = processFile.filename;
    downloadLink.click();
}

const DownloadButton = ({ processFile, timestamp }) => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        await downloadFile(processFile, timestamp, intlRef, enqueueSnackbar);
        setIsLoading(false);
    };

    return processFile.fileUrl === null ? null : isLoading ? (
        <CircularProgress size={30} />
    ) : (
        <Button
            data-test={
                'download-' + processFile.fileType + '-' + Date.parse(timestamp)
            }
            onClick={handleClick}
        >
            <GetApp />
        </Button>
    );
};

DownloadButton.propTypes = {
    processFile: PropTypes.object.isRequired,
    timestamp: PropTypes.string.isRequired,
};

export default DownloadButton;
