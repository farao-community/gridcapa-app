/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

let container = null;
let root = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
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

it('renders minio disk usage', async () => {});
