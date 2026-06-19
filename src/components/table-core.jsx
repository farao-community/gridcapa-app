/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AppBar } from '@mui/material';
import OverviewTable from './overview-table';
import EventsTable from './events-table';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import CustomTabPanel from './tabs/custom-tab-panel.jsx';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TableCore = ({ taskData, eventsData }) => {
    const [value, setValue] = useState(0);
    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <AppBar position="static" color="transparent" enableColorOnDark>
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
            <CustomTabPanel value={value} index={0}>
                <OverviewTable
                    inputs={taskData.inputs || []}
                    availableInputs={taskData.availableInputs || []}
                    outputs={taskData.outputs || []}
                    timestamp={taskData.timestamp}
                />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <EventsTable eventsData={eventsData} />
            </CustomTabPanel>
        </div>
    );
};

TableCore.propTypes = {
    taskData: PropTypes.object,
    eventsData: PropTypes.object,
};

export default TableCore;
