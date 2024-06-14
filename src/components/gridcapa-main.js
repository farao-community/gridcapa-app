/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

import ProcessTimestampView from './process-timestamp-view';
import BusinessDateView from './business-date-view';
import RunningTasksView from './running-tasks-view';
import { Views } from '../utils/view-utils';
import CustomTabPanel from './tabs/custom-tab-panel';

function GridCapaMain({ view, processName, timestamp, onTimestampChange }) {
    return (
        timestamp && (
            <>
                <CustomTabPanel
                    value={view}
                    index={Views.PROCESS_TIMESTAMP_VIEW}
                >
                    <ProcessTimestampView
                        processName={processName}
                        timestamp={timestamp}
                        onTimestampChange={onTimestampChange}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={view} index={Views.BUSINESS_DATE_VIEW}>
                    <BusinessDateView
                        processName={processName}
                        timestamp={timestamp}
                        onTimestampChange={onTimestampChange}
                    />
                </CustomTabPanel>
                <CustomTabPanel value={view} index={Views.RUNNING_TASKS_VIEW}>
                    <RunningTasksView processName={processName} />
                </CustomTabPanel>
            </>
        )
    );
}

GridCapaMain.propTypes = {
    view: PropTypes.number.isRequired,
    processName: PropTypes.string,
    timestamp: PropTypes.object,
    onTimestampChange: PropTypes.func.isRequired,
};

export default GridCapaMain;
