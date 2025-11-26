/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RunButton } from './run-button.jsx';
import {
    cleanUpOnExit,
    renderComponent,
    setupTestContainer,
    startOf2020Iso,
} from '../utils/test-utils.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders run button when success', async () => {
    await renderComponent(
        <RunButton status="SUCCESS" timestamp={startOf2020Iso()} />,
        root
    );

    expect(container.innerHTML).toContain('run-button-1577836800000');
    expect(container.getElementsByTagName('button').length).toEqual(1);
    expect(container.getElementsByTagName('circle').length).toEqual(0);
});

it('renders loader when running', async () => {
    await renderComponent(
        <RunButton status="RUNNING" timestamp={startOf2020Iso()} />,
        root
    );

    expect(container.innerHTML).not.toContain('run-button-');
    expect(container.getElementsByTagName('circle').length).toEqual(1);
    expect(container.getElementsByTagName('button').length).toEqual(0);
});
