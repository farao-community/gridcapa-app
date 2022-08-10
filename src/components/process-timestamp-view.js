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
import { fetchTimestampData, getWebSocketUrl } from '../utils/rest-api';
import { gridcapaFormatDate } from './commons';
import SockJsClient from 'react-stomp';

function timestampEquals(t1, t2) {
    return gridcapaFormatDate(t1) === gridcapaFormatDate(t2);
}

const ProcessTimestampView = ({
    processName,
    timestamp,
    onTimestampChange,
}) => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();
    const [timestampData, setTimestampData] = useState(null);

    const updateTimestampData = useCallback(() => {
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

    const handleTimestampMessage = useCallback(
        async (event) => {
            const data = event;
            if (data && timestampEquals(data.timestamp, timestamp)) {
                setTimestampData(data);
            }
        },
        [timestamp]
    );

    const createWS = (timestampTosubscribe) => {
        let listOfTopics = [
            '/task/update/' + timestampTosubscribe.toISOString(),
        ];
        return (
            <SockJsClient
                url={getWebSocketUrl('task')}
                topics={listOfTopics}
                onMessage={handleTimestampMessage}
            />
        );
    };

    useEffect(() => {
        updateTimestampData();
    }, [updateTimestampData]);

    return (
        <div>
            {createWS(timestamp)}
            <Grid container direction="column">
                <Grid item>
                    <TableHeader
                        taskData={timestampData}
                        processName={processName}
                        timestamp={timestamp}
                        onTimestampChange={onTimestampChange}
                    />
                </Grid>
                <Grid item>
                    {timestampData ? (
                        <TableCore taskData={timestampData} />
                    ) : null}
                </Grid>
            </Grid>
        </div>
    );
};

export default ProcessTimestampView;
