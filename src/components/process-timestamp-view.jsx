/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import TableHeader from './table-header';
import TableCore from './table-core';
import { useIntlRef } from '../utils/messages';
import { useSnackbar } from 'notistack';
import { fetchTimestampData, getWebSocketUrl } from '../utils/rest-api';
import { gridcapaFormatDate } from '../utils/commons';
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
    const [eventsData, setEventsData] = useState([]);
    const eventsUpdateTimer = useRef(undefined);

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
                    setEventsData(data.processEvents);
                }
            });
        }
    }, [timestamp, intlRef, enqueueSnackbar]);

    const handleTimestampMessage = useCallback(
        async (event) => {
            if (event && timestampEquals(event.timestamp, timestamp)) {
                setTimestampData(event);
            }
        },
        [timestamp]
    );

    const updateEventsAndResetTimer = useCallback(async () => {
        eventsUpdateTimer.current = undefined;
        const eventsFromTaskManager = await fetchTimestampData(
            timestamp.toISOString(),
            intlRef,
            enqueueSnackbar
        );
        setEventsData(eventsFromTaskManager.processEvents);
    }, [timestamp, intlRef, enqueueSnackbar]);

    const handleEventsUpdate = async (eventsUpdate) => {
        if (eventsUpdate && eventsUpdateTimer.current === undefined) {
            eventsUpdateTimer.current = setTimeout(
                updateEventsAndResetTimer,
                5000
            );
        }
    };

    const getListOfTopicsTasks = (timestampSubscription) => {
        return ['/task/update/' + timestampSubscription.toISOString()];
    };

    const getListOfTopicsEvents = (timestampSubscription) => {
        return [
            '/task/update/' + timestampSubscription.toISOString() + '/events',
        ];
    };

    useEffect(() => {
        updateTimestampData();
    }, [updateTimestampData]);

    return (
        <div>
            <SockJsClient
                url={getWebSocketUrl('task')}
                topics={getListOfTopicsTasks(timestamp)}
                onMessage={handleTimestampMessage}
            />
            <SockJsClient
                url={getWebSocketUrl('task')}
                topics={getListOfTopicsEvents(timestamp)}
                onMessage={handleEventsUpdate}
            />
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
                        <TableCore
                            taskData={timestampData}
                            eventsData={eventsData}
                        />
                    ) : null}
                </Grid>
            </Grid>
        </div>
    );
};

export default ProcessTimestampView;
