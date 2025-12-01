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
} from '../../utils/test-utils.js';
import ViewTabs from './view-tabs.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('displays tab when index and value are the same', async () => {
    await renderComponent(<ViewTabs onViewChange={jest.fn()} view={0} />, root);

    ['0', '1', '2'].forEach((i) => {
        expect(container.innerHTML).toContain('simple-tab-' + i);
        expect(container.innerHTML).toContain('simple-tabpanel-' + i);
    });
});
