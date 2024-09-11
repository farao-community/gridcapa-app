/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@mui/material';
import { Publish } from '@mui/icons-material';
import { fetchFileToBackend } from '../utils/rest-api';

function sendFileToback(event, processEvent, timestamp) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', processEvent.fileType);
    fetchFileToBackend(timestamp, formData);
}

function downloadFile(processFile, timestamp) {
    const chooseFile = document.createElement('input');
    chooseFile.type = 'file';
    chooseFile.addEventListener('change', (event) => {
        sendFileToback(event, processFile, timestamp);
    });
    chooseFile.click();
    console.log(chooseFile);
}

const UploadButton = ({ processFile, timestamp }) => {
    return (
        <Button
            data-test={
                'upload-' + processFile.fileType + '-' + Date.parse(timestamp)
            }
            onClick={() => downloadFile(processFile, timestamp)}
        >
            <Publish />
        </Button>
    );
};

export default UploadButton;
