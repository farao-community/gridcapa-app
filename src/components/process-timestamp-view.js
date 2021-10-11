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

    useEffect(() => {
        const ws = connectNotificationsUpdateTask();
        if (taskData === null) {
            updateSelectedTimestampData(defaultTimestamp);
        }
        return function () {
            ws.close();
        };
    }, [taskData, setTaskData, defaultTimestamp, connectNotificationsUpdateTask]);

    const updateSelectedTimestampData = (timestamp) => {
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
    };

    const updateSelectedDateData = useCallback(
        (event) => {
            const date = event.target.value;
            timestamp.setDate(date.substr(8, 2));
            timestamp.setMonth(date.substr(5, 2) - 1);
            timestamp.setFullYear(date.substr(0, 4));
            setTimestamp(timestamp);
            updateSelectedTimestampData(timestamp);
        },
        [timestamp, setTimestamp, updateSelectedTimestampData]
    );

    const updateSelectedTimeData = useCallback(
        (event) => {
            const time = event.target.value;
            timestamp.setHours(time.substr(0, 2));
            timestamp.setMinutes(time.substr(3, 2));
            setTimestamp(timestamp);
            updateSelectedTimestampData(timestamp);
        },
        [timestamp, setTimestamp, updateSelectedTimestampData]
    );

    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeader
                    taskData={taskData}
                    onSelectedDateChange={updateSelectedDateData}
                    onSelectedTimeChange={updateSelectedTimeData}
                />
            </Grid>
            <Grid item>
                <TableCore taskData={taskData} />
            </Grid>
        </Grid>
    );
};

export default ProcessTimestampView;
