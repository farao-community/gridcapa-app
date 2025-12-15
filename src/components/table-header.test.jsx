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
    startOf2020IsoStr,
} from '../utils/test-utils.js';
import TableHeader from './table-header.jsx';
import { fireEvent } from '@testing-library/react';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

jest.mock('./task-status-chip');
jest.mock('./run-button');
jest.mock('./manual-export-button');
jest.mock('./stop-button');

afterEach(() => cleanUpOnExit(container, root));

it('renders table header', async () => {
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

    const onTsChange = jest.fn();

    await renderComponent(
        <TableHeader
            taskData={taskData}
            processName="VALID"
            timestamp={new Date(startOf2020IsoStr())}
            onTimestampChange={onTsChange}
        />,
        root
    );

    expect(container.innerHTML).toContain('VALID Supervisor');
    expect(container.innerHTML).not.toContain('Error message');

    fireEvent.change(document.getElementById('date'), {
        target: { value: startOf2020IsoStr() },
    });

    fireEvent.change(document.getElementById('time'), {
        target: { value: '16:30' },
    });

    expect(onTsChange).toHaveBeenCalledTimes(2);
});

it('renders table header without process name', async () => {
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

    const onTsChange = jest.fn();

    await renderComponent(
        <TableHeader
            taskData={taskData}
            processName={null}
            timestamp={new Date(startOf2020IsoStr())}
            onTimestampChange={onTsChange}
        />,
        root
    );

    expect(container.innerHTML).toContain('Supervisor');
    expect(container.innerHTML).not.toContain('Error message');
});
