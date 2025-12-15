/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    cleanUpOnExit,
    firstButtonOf,
    renderComponent,
    setupTestContainer,
    startOf2020IsoStr,
} from '../utils/test-utils.js';
import { StopButton } from './stop-button.jsx';
import { fireEvent } from '@testing-library/react';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders stop button', async () => {
    await renderComponent(
        <StopButton
            status="SUCCESS"
            timestamp={startOf2020IsoStr()}
            runId="1"
        />,
        root
    );

    expect(firstButtonOf(container).disabled).toBe(true);
    expect(container.innerHTML).toContain('stop-button');
    expect(container.innerHTML).not.toContain('Error message');
});

it('renders dialog on click', async () => {
    await renderComponent(
        <StopButton
            status="RUNNING"
            timestamp={startOf2020IsoStr()}
            runId="1"
        />,
        root
    );

    expect(firstButtonOf(container).disabled).toBe(false);
    expect(container.innerHTML).not.toContain('Error message');

    fireEvent.click(firstButtonOf(container));

    expect(document.body.innerHTML).toContain('yes-button');
    expect(document.body.innerHTML).toContain('cancel-button');
});
