/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import { useIntlRef } from '../utils/messages';
import { fetchFileFromProcess } from '../utils/rest-api';

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
    return processFile.fileUrl === null ? (
        ''
    ) : (
        <Button
            data-test={
                'download-' + processFile.fileType + '-' + Date.parse(timestamp)
            }
            onClick={() =>
                downloadFile(processFile, timestamp, intlRef, enqueueSnackbar)
            }
        >
            <GetApp />
        </Button>
    );
};

export default DownloadButton;
