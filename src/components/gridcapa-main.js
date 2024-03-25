/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import ProcessTimestampView from './process-timestamp-view';
import BusinessDateView from './business-date-view';
import RunningTasksView from './running-tasks-view';
import { Views, getInitialViewToSet } from '../utils/view-utils';
import CustomTabPanel from './tabs/custom-tab-panel';
import { getInitialTimestampToSet } from '../utils/date-time-utils';
import { useLocation, useParams } from 'react-router-dom';

function GridCapaMain({
    view,
    setView,
    timestamp,
    setTimestamp,
    onTimestampChange,
    setParametersEnabled,
}) {
    const { dateParam, timeParam } = useParams();
    const location = useLocation();

    const [processName, setProcessName] = useState(null);

    useEffect(() => {
        if (processName === null) {
            console.log('Fetching process metadata...');
            fetch('process-metadata.json')
                .then((res) => res.json())
                .then((res) => {
                    setProcessName(res.processName);

                    const timestampToSet = getInitialTimestampToSet(
                        dateParam,
                        timeParam,
                        res.dayIncrementInDate
                    );
                    setTimestamp(timestampToSet);

                    const viewToDisplay =
                        location.pathname === '/global'
                            ? Views.RUNNING_TASKS_VIEW
                            : getInitialViewToSet(dateParam, timeParam, view);
                    setView(viewToDisplay);

                    setParametersEnabled(res.parametersEnabled || false);
                });
        }
    }, [
        dateParam,
        location,
        processName,
        setParametersEnabled,
        setTimestamp,
        setView,
        timeParam,
        view,
    ]);

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
    setView: PropTypes.func.isRequired,
    timestamp: PropTypes.object,
    setTimestamp: PropTypes.func.isRequired,
    onTimestampChange: PropTypes.func.isRequired,
    setParametersEnabled: PropTypes.func.isRequired,
};

export default GridCapaMain;
