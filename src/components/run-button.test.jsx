/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act } from 'react-dom/test-utils';
import { RunButton } from './run-button.jsx';
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

it('renders run button when success', async () => {
    let timestamp = new Date(Date.UTC(2020, 0, 1)).toISOString();
    await act(() =>
        renderWithProviders(
            <RunButton status="SUCCESS" timestamp={timestamp} />,
            root
        )
    );

    expect(container.innerHTML).toContain('run-button-1577836800000');
    expect(container.getElementsByTagName('button').length).toEqual(1);
    expect(container.getElementsByTagName('circle').length).toEqual(0);
});

it('renders loader when running', async () => {
    let timestamp = new Date(Date.UTC(2020, 0, 1)).toISOString();
    await act(() =>
        renderWithProviders(
            <RunButton status="RUNNING" timestamp={timestamp} />,
            root
        )
    );

    expect(container.innerHTML).not.toContain('run-button-');
    expect(container.getElementsByTagName('circle').length).toEqual(1);
    expect(container.getElementsByTagName('button').length).toEqual(0);
});
