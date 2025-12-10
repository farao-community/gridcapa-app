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
import { ManualExportButton } from './manual-export-button.jsx';
import { fireEvent } from '@testing-library/react';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders enabled button with SUCCESS status', async () => {
    await renderComponent(
        <ManualExportButton status="SUCCESS" timestamp={startOf2020IsoStr()} />,
        root
    );

    const manualExportButton = firstButtonOf(container);

    expect(manualExportButton.disabled).toBe(false);
    expect(container.innerHTML).toContain('manual-export-button');
    expect(container.innerHTML).not.toContain('Error message');
});

it('renders disable button with RUNNING status', async () => {
    await renderComponent(
        <ManualExportButton status="RUNNING" timestamp={startOf2020IsoStr()} />,
        root
    );

    const manualExportButton = firstButtonOf(container);

    expect(manualExportButton.disabled).toBe(true);
    expect(container.innerHTML).toContain('manual-export-button');
    expect(container.innerHTML).not.toContain('Error message');
});

it('renders dialog on click', async () => {
    const component = (
        <ManualExportButton status="SUCCESS" timestamp={startOf2020IsoStr()} />
    );
    await renderComponent(component, root);

    expect(firstButtonOf(container).disabled).toBe(false);
    fireEvent.click(firstButtonOf(container));

    expect(document.documentElement.innerHTML).toContain('yes-button');
    expect(document.documentElement.innerHTML).toContain('cancel-button');
    expect(container.innerHTML).not.toContain('Error message');
});
