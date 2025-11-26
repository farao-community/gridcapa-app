/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import App from './app';
import {
    cleanUpOnExit,
    renderComponent,
    setupTestContainer,
} from '../utils/test-utils.test.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders GridCapa App', async () => {
    await renderComponent(<App />, root);
    expect(container.textContent).toContain('GridCapa');
});
