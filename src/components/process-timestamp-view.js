/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TableHeader from './table-header';
import TableCore from './table-core';
import { useIntlRef } from '../utils/messages';
import { useSnackbar } from 'notistack';
import { fetchTimestampData } from '../utils/rest-api';
import { selectWebSocketHandlingMethod } from '../redux/actions';
import { useDispatch } from 'react-redux';

function timestampEquals(t1, t2) {
    return t1.substr(0, 19) === t2.substr(0, 19)
}

const ProcessTimestampView = ({ processName, timestamp, onTimestampChange }) => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();
    const handleWebSocketListener = useDispatch();
    const [timestampData, setTimestampData] = useState(null);

    const handleMessage = useCallback((event) => {
        const data = JSON.parse(event.data);
        if (data && timestampEquals(data.timestamp, timestamp.toISOString())) {
            setTimestampData(data);
        }
    }, [timestamp]);

    useEffect(() => {
        handleWebSocketListener(selectWebSocketHandlingMethod(handleMessage));
    }, [handleMessage]);

    useEffect(() => {
        console.log('Fetching timestamp data...')
        if (timestamp) {
            fetchTimestampData(timestamp.toISOString(), intlRef, enqueueSnackbar)
                .then((data) => {
                    // Avoid filling data with null when no data is retrieved. Wrong date for example.
                    if (data) {
                        setTimestampData(data);
                    }
                })
        }
    }, [timestamp]);

    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeader
                    taskStatus={timestampData ? timestampData.status : 'Not created'}
                    processName={processName}
                    timestamp={timestamp}
                    onTimestampChange={onTimestampChange}
                />
            </Grid>
            <Grid item>
                {timestampData ? <TableCore taskData={timestampData} /> : null}
            </Grid>
        </Grid>
    );
};

export default ProcessTimestampView;
