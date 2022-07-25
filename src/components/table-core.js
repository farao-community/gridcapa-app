/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { AppBar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import OverviewTable from './overview-table';
import EventsTable from './events-table';

import { FormattedMessage } from 'react-intl';

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TableCore = ({ taskData }) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <AppBar position="static" color="transparent">
                <Tabs value={value} onChange={handleChange} variant="fullWidth">
                    <Tab
                        label={<FormattedMessage id="overview" />}
                        data-test="overview"
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={<FormattedMessage id="events" />}
                        data-test="events"
                        {...a11yProps(1)}
                    />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <OverviewTable
                    inputs={taskData.inputs || []}
                    outputs={taskData.outputs || []}
                    timestamp={taskData.timestamp}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <EventsTable taskData={taskData} />
            </TabPanel>
        </div>
    );
};

export default TableCore;
