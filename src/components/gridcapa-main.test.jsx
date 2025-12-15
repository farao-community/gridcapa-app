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
import GridCapaMain from './gridcapa-main.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

jest.mock('./process-timestamp-view');
jest.mock('./business-date-view');
jest.mock('./running-tasks-view');
jest.mock('./tabs/custom-tab-panel');

it('renders main view', async () => {
    await renderComponent(
        <GridCapaMain
            view={1}
            onTimestampChange={jest.fn()}
            setParametersEnabled={jest.fn()}
            setTimestamp={jest.fn()}
            setView={jest.fn()}
            timestamp={new Date()}
        />,
        root
    );

    expect(container.innerHTML).not.toContain('Error message');
});
