/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act } from 'react-dom/test-utils';
import { RunButton } from './run-button.jsx';
import {
    renderWithProviders,
    setupTestContainer,
} from '../utils/test-utils.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
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

it('renders run button when success', async () => {
    let timestamp = new Date(Date.UTC(2020, 0, 1)).toISOString();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ parametersEnabled: false }),
        })
    );
    await act(async () =>
        renderWithProviders(
            <RunButton status="SUCCESS" timestamp={timestamp} />,
            root
        )
    );

    expect(container.innerHTML).toContain('run-button-1577836800000');
    expect(container.getElementsByTagName('button').length).toEqual(1);
    expect(container.getElementsByTagName('circle').length).toEqual(0);

    global.fetch.mockRestore();
});

it('renders loader when running', async () => {
    let timestamp = new Date(Date.UTC(2020, 0, 1)).toISOString();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ parametersEnabled: false }),
        })
    );
    await act(async () =>
        renderWithProviders(
            <RunButton status="RUNNING" timestamp={timestamp} />,
            root
        )
    );

    expect(container.innerHTML).not.toContain('run-button-');
    expect(container.getElementsByTagName('circle').length).toEqual(1);
    expect(container.getElementsByTagName('button').length).toEqual(0);
    global.fetch.mockRestore();
});
