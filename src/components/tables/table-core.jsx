/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import OverviewTable from '../overview-table';
import EventsTable from './events-table';
import { FormattedMessage } from 'react-intl';
import StructuredLogsProvider from '../structured-logs-provider';
import CustomTabPanel from '../tabs/custom-tab-panel';

import { AppBar, Tab, Tabs } from '@mui/material';

const TabelCoreViewEnum = {
    OVERVIEW: 0,
    EVENTS: 1,
    STRUCTURED_LOG: 2,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TableCore = ({ processName, taskData, eventsData }) => {
    const [tableCoreView, setTableCoreView] = useState(
        TabelCoreViewEnum.OVERVIEW
    );

    const handleTableCoreViewChange = (_event, newValue) => {
        setTableCoreView(newValue);
    };

    return (
        <div>
            <AppBar position="static" color="transparent" enableColorOnDark>
                <Tabs
                    value={tableCoreView}
                    onChange={handleTableCoreViewChange}
                    orientation="horizontal"
                    variant="fullWidth"
                >
                    <Tab
                        label={<FormattedMessage id="overview" />}
                        {...a11yProps(TabelCoreViewEnum.OVERVIEW)}
                    />
                    <Tab
                        label={<FormattedMessage id="events" />}
                        {...a11yProps(TabelCoreViewEnum.EVENTS)}
                    />
                    {processName === 'SWE D2CC' && (
                        <Tab
                            label={<FormattedMessage id="structuredLogs" />}
                            {...a11yProps(TabelCoreViewEnum.STRUCTURED_LOG)}
                        />
                    )}
                </Tabs>
            </AppBar>
            <CustomTabPanel
                value={tableCoreView}
                index={TabelCoreViewEnum.OVERVIEW}
            >
                <OverviewTable
                    inputs={taskData.inputs || []}
                    availableInputs={taskData.availableInputs || []}
                    outputs={taskData.outputs || []}
                    timestamp={taskData.timestamp}
                />
            </CustomTabPanel>
            <CustomTabPanel
                value={tableCoreView}
                index={TabelCoreViewEnum.EVENTS}
            >
                <EventsTable eventsData={eventsData} />
            </CustomTabPanel>
            {processName === 'SWE D2CC' && (
                <CustomTabPanel
                    value={tableCoreView}
                    index={TabelCoreViewEnum.STRUCTURED_LOG}
                >
                    <StructuredLogsProvider />
                </CustomTabPanel>
            )}
        </div>
    );
};

TableCore.propTypes = {
    processName: PropTypes.string.isRequired,
    taskData: PropTypes.object.isRequired,
    eventsData: PropTypes.array.isRequired,
};

export default TableCore;
