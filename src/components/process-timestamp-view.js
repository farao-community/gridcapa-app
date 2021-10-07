import React, { useCallback, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TableHeader from './table-header';
import TableCore from './table-core';
import { connectNotificationsWsUpdateTask, fetchTimestampData } from '../utils/rest-api';
import { displayErrorMessageWithSnackbar, useIntlRef } from '../utils/messages';
import { useSnackbar } from 'notistack';

const ProcessTimestampView = () => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();

    const [taskData, setTaskData] = React.useState(null)
    const defaultTimestamp = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 30);

    const connectNotificationsUpdateTask = useCallback(() => {
        const ws = connectNotificationsWsUpdateTask();

        ws.onmessage = function (event) {
            let data = JSON.parse(event.data);
            //todo filter taskData with timestamp
            setTaskData(data)
        };
        ws.onerror = function (event) {
            console.error('Unexpected Notification WebSocket error', event);
        };
        return ws;
    },[
        setTaskData,
        connectNotificationsWsUpdateTask
    ]);

    useEffect(() => {
        const ws = connectNotificationsUpdateTask();
        if (taskData === null) {
            updateSelectedTimestampData(defaultTimestamp);
        } return function () {
            ws.close();
        };
    }, [
        taskData,
        setTaskData,
        connectNotificationsUpdateTask,
    ]);

    const updateSelectedTimestampData = (timestamp) => {
        fetchTimestampData(timestamp.toISOString().substr(0,19))
            .then((data) => setTaskData(data))
            .catch((errorMessage) =>
                displayErrorMessageWithSnackbar({
                    errorMessage: errorMessage,
                    enqueueSnackbar: enqueueSnackbar,
                    headerMessage: {
                        headerMessageId: 'taskRetrievingError',
                        intlRef: intlRef,
                    },
                }))
    }

    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeader taskData={taskData} onSelectedTimestampChange={updateSelectedTimestampData} />
            </Grid>
            <Grid item>
                <TableCore taskData={taskData}/>
            </Grid>
        </Grid>
    );
};

export default ProcessTimestampView;
