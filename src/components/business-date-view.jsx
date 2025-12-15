/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import TableHeaderBusinessView from './table-header-business-view';
import GlobalViewCore from './global-view-core';

const BusinessDateView = ({ processName, timestamp, onTimestampChange }) => {
    const refTimestamp = new Date(Date.parse(timestamp));
    const [onTheHourProcess, setOnTheHourProcess] = useState(false);

    useEffect(() => {
        console.log('Fetching process metadata...');
        fetch('process-metadata.json')
            .then((res) => res.json())
            .then((res) => {
                setOnTheHourProcess(res.isOnTheHourProcess || false);
            });
    }, []);

    if (onTheHourProcess) {
        refTimestamp.setHours(0, 0, 0, 0);
    } else {
        refTimestamp.setHours(0, 30, 0, 0);
    }
    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeaderBusinessView
                    processName={processName}
                    timestamp={timestamp}
                    onTimestampChange={onTimestampChange}
                />
            </Grid>
            <Grid item>
                <GlobalViewCore
                    timestampMin={refTimestamp.getTime()}
                    timestampMax={refTimestamp.getTime() + 24 * 60 * 60 * 1000}
                    timestampStep={'01:00'}
                />
            </Grid>
        </Grid>
    );
};

export default BusinessDateView;
