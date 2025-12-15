/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    cleanUpOnExit,
    firstButtonOf,
    renderComponent,
    setupTestContainer,
    startOf2020IsoStr,
} from '../utils/test-utils.js';
import RunningTasksViewCoreRow from './running-tasks-view-core-row.jsx';
import { fireEvent } from '@testing-library/react';

let container = null;
let root = null;

jest.mock('./manual-export-button');
jest.mock('./file-summary');
jest.mock('./stop-button');
jest.mock('./run-button');
jest.mock('./task-status-chip');

beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders global view row', async () => {
    let task = {
        timestamp: startOf2020IsoStr(),
        taskData: {
            inputs: [],
            outputs: [],
            status: 'RUNNING',
            runHistory: [
                { id: 'a', executionDate: 12 },
                { id: 'b', executionDate: 112 },
                { id: 'c', executionDate: 5 },
            ],
        },
    };
    const fileOpenFunction = jest.fn();
    await renderComponent(
        <RunningTasksViewCoreRow
            index={0}
            handleEventOpen={jest.fn()}
            handleFileOpen={fileOpenFunction}
            page={1}
            rowsPerPage={10}
            task={task}
        />,
        root
    );

    expect(container.innerHTML).toContain(
        'timestamp-files-' + startOf2020IsoStr()
    );
    expect(container.innerHTML).not.toContain('Error message');

    fireEvent.click(firstButtonOf(container));

    expect(fileOpenFunction).toHaveBeenCalled();
});
