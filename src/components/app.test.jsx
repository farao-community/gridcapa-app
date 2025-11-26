/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act } from 'react-dom/test-utils';
import App from './app';
import {
    cleanUpOnExit,
    renderWithProviders,
    setupTestContainer,
} from '../utils/test-utils.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders GridCapa App', async () => {
    await act(() => renderWithProviders(<App />, root));

    expect(container.textContent).toContain('GridCapa');
});
