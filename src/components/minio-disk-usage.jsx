/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';

import { fetchMinioStorageData } from '../utils/rest-api';
import { FormattedMessage } from 'react-intl';
import { Box, LinearProgress } from '@mui/material';

const styles = {
    minioProgressStyle: {
        height: '8px',
    },
};

function MinioDiskUsage() {
    const [usedDiskSpacePercentage, setUsedDiskSpacePercentage] = useState(0);

    useEffect(() => {
        fetchMinioStorageData().then((res) => {
            let usedDiskSpace = 0;
            let freeDiskSpace = 0;
            res.info?.servers?.forEach((server) => {
                server.drives.forEach((drive) => {
                    usedDiskSpace = usedDiskSpace + drive.usedspace;
                    freeDiskSpace = freeDiskSpace + drive.availspace;
                });
            });
            setUsedDiskSpacePercentage(
                Math.round(
                    (usedDiskSpace / (usedDiskSpace + freeDiskSpace)) * 100
                )
            );
        });
    }, []);

    return (
        <Box>
            <FormattedMessage id="minioDiskUsage" />
            {usedDiskSpacePercentage}%
            <LinearProgress
                sx={styles.minioProgressStyle}
                variant="determinate"
                value={usedDiskSpacePercentage}
            />
        </Box>
    );
}

export default MinioDiskUsage;
