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
    START_2020_AS_NUMERAL_STRING,
    startOf2020IsoStr,
} from '../utils/test-utils.js';
import GlobalViewCoreRow from './global-view-core-row.jsx';

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
    let step = {
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
    await renderComponent(
        <GlobalViewCoreRow
            index={0}
            handleEventOpen={jest.fn()}
            handleFileOpen={jest.fn()}
            page={1}
            rowsPerPage={10}
            step={step}
        />,
        root
    );

    expect(container.innerHTML).toContain(
        'timestamp-files-' + startOf2020IsoStr()
    );
});
