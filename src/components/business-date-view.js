/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TableHeaderBusinessView from './table-header-business-view';
import GlobalViewCore from './global-view-core';

const BusinessDateView = ({ processName, timestamp, onTimestampChange }) => {
    const refTimestamp = new Date(Date.parse(timestamp));
    refTimestamp.setHours(0, 30, 0, 0);
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
