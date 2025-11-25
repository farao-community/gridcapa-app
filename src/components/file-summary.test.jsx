/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act } from 'react-dom/test-utils';
import FileSummary from './file-summary.jsx';
import {
    renderWithProviders,
    setupTestContainer,
} from '../utils/test-utils.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => {
    // cleanup on exiting
    container.remove();
    container = null;

    if (root) {
        act(() => {
            root.unmount();
        });
        root = null;
    }
});

it('displays validated file count correctly', async () => {
    const listOfFile = [
        { processFileStatus: 'VALIDATED' },
        { processFileStatus: 'ERROR' },
        { processFileStatus: 'RUNNING' },
    ];
    await act(async () =>
        renderWithProviders(
            <FileSummary type="Input" listOfFile={listOfFile} />,
            root
        )
    );

    expect(container.innerHTML).toContain('1&nbsp;/&nbsp;3');
});
