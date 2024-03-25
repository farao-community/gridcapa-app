/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Views } from '../../utils/view-utils';
import { Tab, Tabs } from '@mui/material';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ViewTabs({ view, onViewChange }) {
    const handleViewChange = (event, newValue) => {
        onViewChange(newValue);
    };

    return (
        <Tabs value={view} onChange={handleViewChange} orientation="horizontal">
            <Tab
                label={<FormattedMessage id="timestampView" />}
                {...a11yProps(Views.PROCESS_TIMESTAMP_VIEW)}
            />
            <Tab
                label={<FormattedMessage id="businessDateView" />}
                {...a11yProps(Views.BUSINESS_DATE_VIEW)}
            />
            <Tab
                label={<FormattedMessage id="runningTasksView" />}
                {...a11yProps(Views.RUNNING_TASKS_VIEW)}
            />
        </Tabs>
    );
}

ViewTabs.propTypes = {
    view: PropTypes.number.isRequired,
    onViewChange: PropTypes.func.isRequired,
};

export default ViewTabs;
