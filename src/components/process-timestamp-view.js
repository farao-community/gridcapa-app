import React, { useCallback, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TableHeader from './table-header';
import TableCore from './table-core';
import {
    connectNotificationsWsUpdateTask,
    fetchTimestampData,
} from '../utils/rest-api';
import { displayErrorMessageWithSnackbar, useIntlRef } from '../utils/messages';
import { useSnackbar } from 'notistack';

const ProcessTimestampView = () => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();

    const [taskData, setTaskData] = React.useState(null);
    const [processMetadata, setProcessMetadata] = React.useState(null);
    const [isWebsocketCreated, setWebsocketCreated] = React.useState(false);
    const defaultTimestamp = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        30
    );
    const [timestamp, setTimestamp] = React.useState(defaultTimestamp);

    const connectNotificationsUpdateTask = useCallback(() => {
        const ws = connectNotificationsWsUpdateTask();

        ws.onmessage = function (event) {
            let data = JSON.parse(event.data);
            if (
                data !== null &&
                data.timestamp === timestamp.toISOString().substr(0, 19)
            ) {
                setTaskData(data);
            }
        };
        ws.onerror = function (event) {
            console.error('Unexpected Notification WebSocket error', event);
        };
        return ws;
    }, [setTaskData, timestamp]);

    const updateSelectedTimestampData = useCallback(
        (timestamp) => {
            fetchTimestampData(timestamp.toISOString().substr(0, 19))
                .then((data) => setTaskData(data))
                .catch((errorMessage) =>
                    displayErrorMessageWithSnackbar({
                        errorMessage: errorMessage,
                        enqueueSnackbar: enqueueSnackbar,
                        headerMessage: {
                            headerMessageId: 'taskRetrievingError',
                            intlRef: intlRef,
                        },
                    })
                );
        },
        [setTaskData, enqueueSnackbar, intlRef]
    );

    const updateSelectedDateData = useCallback(
        (event) => {
            const date = event.target.value;
            let newTimestamp = timestamp;
            newTimestamp.setDate(date.substr(8, 2));
            newTimestamp.setMonth(date.substr(5, 2) - 1);
            newTimestamp.setFullYear(date.substr(0, 4));
            setTimestamp(newTimestamp);
            updateSelectedTimestampData(newTimestamp);
        },
        [timestamp, setTimestamp, updateSelectedTimestampData]
    );

    const updateSelectedTimeData = useCallback(
        (event) => {
            const time = event.target.value;
            let newTimestamp = timestamp;
            newTimestamp.setHours(time.substr(0, 2));
            newTimestamp.setMinutes(time.substr(3, 2));
            setTimestamp(newTimestamp);
            updateSelectedTimestampData(newTimestamp);
        },
        [timestamp, setTimestamp, updateSelectedTimestampData]
    );

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
        if (taskData === null) {
            updateSelectedTimestampData(timestamp);
        }
    }, [taskData, updateSelectedTimestampData, timestamp]);

    useEffect(() => {
        if (processMetadata === null) {
            fetch('process-metadata.json')
                .then((res) => res.json())
                .then((res) => {
                    setProcessMetadata(res);
                });
        }
    });

    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeader
                    taskData={taskData}
                    processMetadata={processMetadata}
                    onSelectedDateChange={updateSelectedDateData}
                    onSelectedTimeChange={updateSelectedTimeData}
                />
            </Grid>
            <Grid item>
                <TableCore
                    taskData={taskData}
                />
            </Grid>
        </Grid>
    );
};

export default ProcessTimestampView;
