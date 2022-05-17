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
import { useSelector } from 'react-redux';
import { PARAM_THEME } from '../utils/config-params';
import { getTaskStatusStyle } from './task-status-style';
import {
    connectNotificationsWsUpdateTask,
    fetchBusinessDateData,
} from '../utils/rest-api';
import { gridcapaFormatDate } from './commons';
import dateFormat from 'dateformat';
import { useIntlRef } from '../utils/messages';
import { useSnackbar } from 'notistack';

function TaskStatusCell(props) {
    const theme = useSelector((state) => state[PARAM_THEME]);

    return (
        <TableCell
            {...props}
            style={{ ...getTaskStatusStyle(props.taskStatus, theme) }}
        >
            {props.taskStatus}
        </TableCell>
    );
}

function dateEquality(date1, date2) {
    return gridcapaFormatDate(date1) === gridcapaFormatDate(date2);
}

function findTimestampData(businessDateTimestamps, timestamp) {
    if (businessDateTimestamps && businessDateTimestamps.length !== 0) {
        for (let i = 0; i < businessDateTimestamps.length; i++) {
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
            <TaskStatusCell
                data-test={taskTimestamp + '-task-status'}
                taskStatus={taskStatus}
            />
        </TableRow>
    );
}

const OverviewTableBusinessView = ({ timestamp }) => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();
    const [businessDateData, setBusinessDateData] = useState([]);
    const [timestamps, setTimestamps] = useState([]);

    const getBusinessData = useCallback(() => {
        console.log('Fetching business date data...');
        if (timestamp) {
            const date = dateFormat(timestamp, 'yyyy-mm-dd');
            return fetchBusinessDateData(date, intlRef, enqueueSnackbar);
        }
        return null;
    }, [timestamp, intlRef, enqueueSnackbar]);

    const updateBusinessData = useCallback(() => {
        getBusinessData().then((data) => {
            // Avoid filling data with null when no data is retrieved. Wrong date for example.
            console.log('effect data fetched: ', data);
            if (data) {
                setBusinessDateData(data);
            }
        });
    }, [getBusinessData]);

    const handleBusinessDateMessage = useCallback(
        (event) => {
            const data = JSON.parse(event.data);
            if (data && findTimestampData(timestamps, data.timestamp)) {
                updateBusinessData();
            }
        },
        [timestamps, updateBusinessData]
    );

    useEffect(() => {
        getBusinessData().then((data) => {
            // Avoid filling data with null when no data is retrieved. Wrong date for example.
            if (data) {
                const newTimestamps = [];
                data.map((timestampData) =>
                    newTimestamps.push(timestampData.timestamp)
                );
                setTimestamps(newTimestamps);
            }
        });
    }, [getBusinessData]);

    useEffect(() => {
        const ws = connectNotificationsWsUpdateTask(
            updateBusinessData,
            handleBusinessDateMessage
        );
        return function () {
            ws.close();
        };
    }, [updateBusinessData, handleBusinessDateMessage]);

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
