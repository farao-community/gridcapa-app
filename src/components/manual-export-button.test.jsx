/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    cleanUpOnExit,
    renderComponent,
    setupTestContainer,
    startOf2020IsoStr,
} from '../utils/test-utils.test.js';
import { ManualExportButton } from './manual-export-button.jsx';
import { fireEvent } from '@testing-library/react';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders button', async () => {
    await renderComponent(
        <ManualExportButton status="SUCCESS" timestamp={startOf2020IsoStr()} />,
        root
    );

    expect(container.innerHTML).toContain('manual-export-button');
    expect(container.innerHTML).not.toContain('yes-button');
    expect(container.innerHTML).not.toContain('cancel-button');
});

it('renders dialog on click', async () => {
    const component = (
        <ManualExportButton status="SUCCESS" timestamp={startOf2020IsoStr()} />
    );
    await renderComponent(component, root);

    expect(container.getElementsByTagName('button').item(0).disabled).toBe(
        false
    );
    fireEvent.click(container.getElementsByTagName('button').item(0));

    setTimeout(function () {
        expect(container.innerHTML).toContain('yes-button');
        expect(container.innerHTML).toContain('cancel-button');
    }, 500);
});
