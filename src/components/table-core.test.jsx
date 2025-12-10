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
import TableCore from './table-core.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

jest.mock('./overview-table');
jest.mock('./events-table');

afterEach(() => cleanUpOnExit(container, root));

it('renders table core', async () => {
    const taskData = {
        inputs: [],
        outputs: [],
        status: 'RUNNING',
        runHistory: [
            { id: 'a', executionDate: 12 },
            { id: 'b', executionDate: 112 },
            { id: 'c', executionDate: 5 },
        ],
    };

    await renderComponent(
        <TableCore taskData={taskData} eventsData={[]} />,
        root
    );

    ['overview', 'tab', 'tablist', 'simple-tab'].forEach((text) =>
        expect(container.innerHTML).toContain(text)
    );

    expect(container.innerHTML).not.toContain('Error message');
});
