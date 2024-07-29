/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Grid from '@mui/material/Grid';
import TableHeaderRunningTasksView from './table-header-running-tasks-view';
import RunningTasksViewCore from './running-tasks-view-core';

const RunningTasksView = ({ processName }) => {
    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeaderRunningTasksView processName={processName} />
            </Grid>
            <Grid item>
                <RunningTasksViewCore />
            </Grid>
        </Grid>
    );
};

export default RunningTasksView;
