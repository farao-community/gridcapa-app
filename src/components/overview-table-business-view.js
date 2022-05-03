/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import React, { useCallback, useEffect, useState } from 'react';
import {
    findTimestampData,
    gridcapaFormatDate,
    getBackgroundColor,
} from './commons';
import { connectNotificationsWsUpdateTask, fetchBusinessDateData } from '../utils/rest-api';
import { useIntlRef } from '../utils/messages';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { selectWebSocketHandlingMethod } from '../redux/actions';
import dateFormat from 'dateformat';

function FillDataRow({ rowValue }) {
    const taskTimestamp = gridcapaFormatDate(rowValue.timestamp);
    const taskStatus = rowValue.status;
    return (
        <TableRow>
            <TableCell data-test={taskTimestamp + '-task-timestamp'}>
                {taskTimestamp}
            </TableCell>
            <TableCell
                data-test={taskTimestamp + '-task-status'}
                style={{
                    backgroundColor: getBackgroundColor(taskStatus),
                    color: 'white',
                }}
            >
                {taskStatus}
            </TableCell>
        </TableRow>
    );
}

const OverviewTableBusinessView = ({ timestamp }) => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();
    const [businessDateData, setBusinessDateData] = useState([]);
    const [isWebsocketCreated, setWebsocketCreated] = React.useState(false);

    const handleBusinessDateMessage = useCallback(
        (event) => {
            const data = JSON.parse(event.data);
            if (data) {
                const listTasksDataUpdated = [...businessDateData];
                const timestampData = findTimestampData(
                    listTasksDataUpdated,
                    data.timestamp
                );
                if (timestampData) {
                    timestampData.status = data.status;
                    setBusinessDateData(listTasksDataUpdated);
                }
            }
        },
        [businessDateData]
    );

    const connectNotificationsUpdateTask = useCallback(() => {
        const ws = connectNotificationsWsUpdateTask();
        ws.onmessage = function (event) {
            handleBusinessDateMessage(event);
        };
        ws.onerror = function (event) {
            console.error('Unexpected Notification WebSocket error', event);
        };
        return ws;
    }, [timestamp, handleBusinessDateMessage]);

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
        console.log('Fetching business date data...');
        if (timestamp) {
            const date = dateFormat(timestamp, 'yyyy-mm-dd');
            fetchBusinessDateData(date, intlRef, enqueueSnackbar).then(
                (data) => {
                    // Avoid filling data with null when no data is retrieved. Wrong date for example.
                    if (data) {
                        setBusinessDateData(data);
                    }
                }
            );
        }
    }, [timestamp, intlRef, enqueueSnackbar]);

    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="Timestamp" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="Status" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {businessDateData?.map((input) => (
                        <FillDataRow rowValue={input} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OverviewTableBusinessView;
