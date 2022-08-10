/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@material-ui/core';
import { Publish } from '@material-ui/icons';
import { getBaseUrl } from '../utils/rest-api';

// File types to upload files on FTP
const type = {
    CGM: 'cgms',
    CRAC: 'cracs',
    GLSK: 'glsks',
    'NTC-RED': 'ntcreds',
    NTC: 'ntc',
    'TARGET-CH': 'targetchs',
    'USER-CONFIG': 'user-configs',
    CBCORA: 'cbcoras',
    REFPROG: 'refprogs',
    'STUDY-POINTS': 'studypoints',
    'NTC2-AT': 'ntc2-at',
    'NTC2-CH': 'ntc2-ch',
    'NTC2-FR': 'ntc2-fr',
    'NTC2-SI': 'ntc2-si',
    VULCANUS: 'vulcanus',
};

function sendFileToback(event, processEvent) {
    const url = new URL(getBaseUrl());
    const file = event.path[0].files[0];
    const formData = new FormData();
    let dest = url.pathname + '/' + type[processEvent.fileType];
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('directory', dest);
    fetch(url.toString() + '/task-manager/tasks/file', {
        method: 'POST',
        body: formData,
    });
}

function downloadFile(processFile) {
    const chooseFile = document.createElement('input');
    chooseFile.type = 'file';
    chooseFile.addEventListener('change', (event) => {
        sendFileToback(event, processFile);
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
            onClick={() => downloadFile(processFile)}
        >
            <Publish />
        </Button>
    );
};

export default UploadButton;
