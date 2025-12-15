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
import RunningTasksView from './running-tasks-view.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));
jest.mock('./running-tasks-view-core');

it('renders running tasks view', async () => {
    await renderComponent(<RunningTasksView processName="VALID" />, root);

    expect(container.innerHTML).toContain('VALID Supervisor');
    expect(container.innerHTML).not.toContain('Error message');
});
