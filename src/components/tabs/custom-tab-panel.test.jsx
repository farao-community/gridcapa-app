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
import CustomTabPanel from './custom-tab-panel.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('displays tab when index and value are the same', async () => {
    await renderComponent(
        <CustomTabPanel index={0} value={0}>
            aaa
        </CustomTabPanel>,
        root
    );

    expect(container.innerHTML).toContain('aaa');
});

it('hides tab when index and value are not the same', async () => {
    await renderComponent(
        <CustomTabPanel index={0} value={1}>
            aaa
        </CustomTabPanel>,
        root
    );

    expect(container.innerHTML).not.toContain('aaa');
});
