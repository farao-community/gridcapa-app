/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Button } from '@material-ui/core';
import { GetApp } from '@material-ui/icons';

async function downloadFile(processFile) {
    const file = await fetch(processFile.fileUrl);

    const blob = await file.blob();
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = processFile.filename;

    downloadLink.click();
}

const DownloadButton = ({ processFile }) => {
    return processFile.fileUrl === null ? (
        ''
    ) : (
        <Button onClick={() => downloadFile(processFile)}>
            <GetApp />
        </Button>
    );
};

export default DownloadButton;
