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
import { connectNotificationsWsUpdateTask, fetchTimestampData } from '../utils/rest-api';

function timestampEquals(t1, t2) {
    return t1.substr(0, 19) === t2.substr(0, 19);
}

const ProcessTimestampView = ({
    processName,
    timestamp,
    onTimestampChange,
}) => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();
    const [timestampData, setTimestampData] = useState(null);
    const [isWebsocketCreated, setWebsocketCreated] = React.useState(false);

    const handleTimestampMessage = useCallback(
        (event) => {
            const data = JSON.parse(event.data);
            if (
                data &&
                timestampEquals(data.timestamp, timestamp.toISOString())
            ) {
                setTimestampData(data);
            }
        },
        [timestamp]
    );

    const connectNotificationsUpdateTask = useCallback(() => {
        const ws = connectNotificationsWsUpdateTask();
        ws.onmessage = function (event) {
            handleTimestampMessage(event);
        };
        ws.onerror = function (event) {
            console.error('Unexpected Notification WebSocket error', event);
        };
        return ws;
    }, [setTimestampData, timestamp, handleTimestampMessage]);

    useEffect(() => {
        const ws = connectNotificationsUpdateTask();
        setWebsocketCreated(true);
        return function () {
            ws.close();
        };
    }, [
        isWebsocketCreated,
        setWebsocketCreated,
        connectNotificationsUpdateTask,
    ]);

    useEffect(() => {
        console.log('Fetching timestamp data...');
        if (timestamp) {
            fetchTimestampData(
                timestamp.toISOString(),
                intlRef,
                enqueueSnackbar
            ).then((data) => {
                // Avoid filling data with null when no data is retrieved. Wrong date for example.
                if (data) {
                    setTimestampData(data);
                }
            });
        }
    }, [timestamp, intlRef, enqueueSnackbar]);

    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeader
                    taskStatus={
                        timestampData ? timestampData.status : 'Not created'
                    }
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
