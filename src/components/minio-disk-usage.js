import React, { useEffect, useState } from 'react';

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
            res.info.servers.forEach((server) => {
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
