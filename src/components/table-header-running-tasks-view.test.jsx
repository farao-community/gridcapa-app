/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    cleanUpOnExit,
    renderComponent,
    setupTestContainer,
} from '../utils/test-utils.js';
import TableHeaderRunningTasksView from './table-header-running-tasks-view.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders running tasks view', async () => {
    await renderComponent(
        <TableHeaderRunningTasksView processName="VALID" />,
        root
    );

    expect(container.innerHTML).toContain('VALID Supervisor');
    expect(container.innerHTML).not.toContain('Error message');
});
