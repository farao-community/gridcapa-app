import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import GlobalViewHeader from './global-view-header';
import GlobalViewCore from './global-view-core';

const GlobalView = ({ processName }) => {
    const start = new Date();
    start.setHours(0, 30, 0, 0);
    var end = new Date();
    end.setHours(0, 30, 0, 0);
    end.setDate(end.getDate() + 1);
    const [timestampMin, setTimestampMin] = useState(start.getTime());
    const [timestampMax, setTimestampMax] = useState(end.getTime());
    const [timestampStep, setTimestamStep] = useState('01:00');
    const onTimestampChange = (dateMin, dateMax, step) => {
        setTimestampMin(Date.parse(dateMin));
        setTimestampMax(Date.parse(dateMax));
        setTimestamStep(step);
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
