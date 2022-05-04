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
    gridcapaFormatDate,
    getBackgroundColor,
} from './commons';
import {
    connectNotificationsWsUpdateTask,
    fetchBusinessDateData,
} from '../utils/rest-api';
import { useIntlRef } from '../utils/messages';
import { useSnackbar } from 'notistack';
import dateFormat from 'dateformat';

function dateEquality(date1, date2) {
    return gridcapaFormatDate(date1) === gridcapaFormatDate(date2);
}

function findTimestampData(businessDateTimestamps, timestamp) {
    if (businessDateTimestamps && businessDateTimestamps.length !== 0) {
        for (let i = 0; i <businessDateTimestamps.length; i++) {
            if (dateEquality(businessDateTimestamps[i], timestamp)) {
                return true;
            }
        }
    }
    return false;
}

function FillDataRow({ rowValue }) {
    const taskTimestamp = dateFormat(rowValue.timestamp, 'yyyy-mm-dd HH:MM');
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
    const [timestamps, setTimestamps] = useState([])

    useEffect(() => {
        if (timestamp) {
            const date = dateFormat(timestamp, 'yyyy-mm-dd');
            fetchBusinessDateData(date, intlRef, enqueueSnackbar).then(
                (data) => {
                    // Avoid filling data with null when no data is retrieved. Wrong date for example.
                    if (data) {
                        const newTimestamps = []
                        data.map((timestampData) => newTimestamps.push(timestampData.timestamp));
                        setTimestamps(newTimestamps);
                    }
                }
            );
        }
    }, [timestamp])

    const updateBusinessData = useCallback(
        () => {
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
        },
        [timestamp, intlRef, enqueueSnackbar]
    )

    const handleBusinessDateMessage = useCallback(
        (event) => {
            const data = JSON.parse(event.data);
            if (data) {
                if (findTimestampData(timestamps, data.timestamp)) {
                    updateBusinessData();
                }
            }
        }, [timestamps, updateBusinessData]
    );

    const connectNotificationsUpdateTask = useCallback(() => {
        const ws = connectNotificationsWsUpdateTask();
        ws.onopen = function() {
            updateBusinessData();
        };
        ws.onmessage = function (event) {
            handleBusinessDateMessage(event);
        };
        ws.onerror = function (event) {
            console.error('Unexpected Notification WebSocket error', event);
        };
        ws.reconnect()
        return ws;
    }, [updateBusinessData, handleBusinessDateMessage]);

    useEffect(() => {
        const ws = connectNotificationsUpdateTask();
        return function () {
            ws.close();
        };
    }, [
        connectNotificationsUpdateTask,
    ]);

    useEffect(() => {
        updateBusinessData();
    }, [updateBusinessData]);

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
