/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Tab, Tabs } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import ProcessTimestampView from './process-timestamp-view';
import Box from '@mui/material/Box';
import BusinessDateView from './business-date-view';
import RunningTasksView from './running-tasks-view';
import { setTimestampWithDaysIncrement } from './commons';
import { fetchMinioStorageData } from '../utils/rest-api';
import { PieChart, Pie, Cell } from 'recharts';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

function MinioChart(props) {
    const { used, free } = props;
    const data = [
        { name: 'FREE', value: free },
        { name: 'USED', value: used },
    ];
    const COLORS = ['#007700', '#880000'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };
    return (
        <PieChart width={120} height={120}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Pie>
        </PieChart>
    );
}

const TODAY_TIMESTAMP = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
    0,
    30
);

const GridCapaMain = () => {
    const [view, setView] = useState(0);
    const [processName, setProcessName] = useState(null);
    const [timestamp, setTimestamp] = useState(null);
    const [usedDiskSpace, setUsedDiskSpace] = useState(0);
    const [freeDiskSpace, setFreeDiskSpace] = useState(100);

    const onTimestampChange = useCallback((newTimestamp) => {
        setTimestamp(new Date(newTimestamp));
    }, []);

    const handleViewChange = useCallback((_event, newValue) => {
        setView(newValue);
    }, []);

    useEffect(() => {
        if (processName === null) {
            console.log('Fetching process metadata...');
            fetch('process-metadata.json')
                .then((res) => res.json())
                .then((res) => {
                    setProcessName(res.processName);
                    const daysToIncrement = Number.isInteger(
                        res.dayIncrementInDate
                    )
                        ? res.dayIncrementInDate
                        : 0;
                    setTimestamp(
                        setTimestampWithDaysIncrement(
                            TODAY_TIMESTAMP,
                            daysToIncrement
                        )
                    );
                });
            fetchMinioStorageData().then((res) => {
                setUsedDiskSpace(0);
                setFreeDiskSpace(0);
                res.info.servers.forEach((server) => {
                    server.drives.forEach((drive) => {
                        setUsedDiskSpace(usedDiskSpace + drive.usedspace);
                        setFreeDiskSpace(freeDiskSpace + drive.availspace);
                    });
                });
            });
        }
    }, [processName]);

    return (
        timestamp && (
            <Grid container>
                <Grid item xs={2}>
                    <Tabs
                        value={view}
                        onChange={handleViewChange}
                        orientation="vertical"
                    >
                        <Tab
                            label={<FormattedMessage id="timestampView" />}
                            data-test="timestamp-view"
                        />
                        <Tab
                            label={<FormattedMessage id="businessDateView" />}
                            data-test="business-view"
                        />
                        <Tab
                            label={<FormattedMessage id="runningTasksView" />}
                            data-test="global-view"
                        />
                    </Tabs>
                    <div class="center">
                        <MinioChart free={freeDiskSpace} used={usedDiskSpace} />
                        <FormattedMessage id="minioDiskUsage" />
                    </div>
                </Grid>
                <Grid item xs={10}>
                    <TabPanel value={view} index={0}>
                        <ProcessTimestampView
                            processName={processName}
                            timestamp={timestamp}
                            onTimestampChange={onTimestampChange}
                        />
                    </TabPanel>
                    <TabPanel value={view} index={1}>
                        <BusinessDateView
                            processName={processName}
                            timestamp={timestamp}
                            onTimestampChange={onTimestampChange}
                        />
                    </TabPanel>
                    <TabPanel value={view} index={2}>
                        <RunningTasksView processName={processName} />
                    </TabPanel>
                </Grid>
            </Grid>
        )
    );
};

export default GridCapaMain;
