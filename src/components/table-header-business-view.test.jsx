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
import TableHeaderBusinessView from './table-header-business-view.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders business date view', async () => {
    await renderComponent(
        <TableHeaderBusinessView
            processName="VALID"
            timestamp={startOf2020IsoStr()}
            onTimestampChange={jest.fn()}
        />,
        root
    );

    expect(container.innerHTML).toContain('VALID Supervisor');
});
