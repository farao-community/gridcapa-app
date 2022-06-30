/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import GlobalViewHeader from './global-view-header';
import GlobalViewCore from './global-view-core';

const GlobalView = ({ processName }) => {
    const start = new Date();
    start.setHours(0, 30, 0, 0);
    const end = new Date();
    end.setHours(0, 30, 0, 0);
    end.setDate(end.getDate() + 1);
    const [timestampMin, setTimestampMin] = useState(start.getTime());
    const [timestampMax, setTimestampMax] = useState(end.getTime());
    const [timestampStep, setTimestampStep] = useState('01:00');
    const onTimestampChange = (dateMin, dateMax, step) => {
        setTimestampMin(Date.parse(dateMin));
        setTimestampMax(Date.parse(dateMax));
        setTimestampStep(step);
    };

    return (
        <Grid container direction="column">
            <Grid item>
                <GlobalViewHeader
                    timestampMin={timestampMin}
                    timestampMax={timestampMax}
                    timestampStep={timestampStep}
                    onTimestampChange={onTimestampChange}
                    processName={processName}
                />
            </Grid>
            <Grid item>
                <GlobalViewCore
                    timestampMin={timestampMin}
                    timestampMax={timestampMax}
                    timestampStep={timestampStep}
                    processName={processName}
                />
            </Grid>
        </Grid>
    );
};

export default GlobalView;
