/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import TableCoreBusinessView from './table-core-business-view';
import TableHeaderBusinessView from './table-header-business-view';

const BusinessDateView = ({ processName, timestamp, onTimestampChange }) => {
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
                <TableCoreBusinessView timestamp={timestamp}/>
            </Grid>
        </Grid>
    );
};

export default BusinessDateView;
