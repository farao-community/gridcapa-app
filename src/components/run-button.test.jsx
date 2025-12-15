/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RunButton } from './run-button.jsx';
import {
    cleanUpOnExit,
    firstButtonOf,
    renderComponent,
    setupTestContainer,
    START_2020_AS_NUMERAL_STRING,
    startOf2020IsoStr,
} from '../utils/test-utils.js';
import { fireEvent } from '@testing-library/react';
import {
    fetchJobLauncherPost,
    fetchProcessParameters,
} from '../utils/rest-api.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

jest.mock('../utils/rest-api', () => ({
    fetchJobLauncherPost: jest.fn(),
    fetchProcessParameters: jest.fn(),
}));

jest.mock('./dialogs/timestamp-parameters-dialog');

afterEach(() => cleanUpOnExit(container, root));

it('renders clickable run button', async () => {
    await renderComponent(
        <RunButton status="SUCCESS" timestamp={startOf2020IsoStr()} />,
        root
    );

    expect(container.innerHTML).toContain(
        'run-button-' + START_2020_AS_NUMERAL_STRING
    );
    expect(container.getElementsByTagName('button').length).toEqual(1);
    expect(container.getElementsByTagName('circle').length).toEqual(0);
    expect(container.innerHTML).not.toContain('Error message');

    fireEvent.click(firstButtonOf(container));

    expect(fetchProcessParameters).not.toHaveBeenCalled();
    expect(fetchJobLauncherPost).toHaveBeenCalled();
});

it('renders clickable run button with parameters', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ parametersEnabled: true }),
            text: () => Promise.resolve('hello'),
        })
    );

    await renderComponent(
        <RunButton status="SUCCESS" timestamp={startOf2020IsoStr()} />,
        root
    );

    expect(container.innerHTML).toContain(
        'run-button-' + START_2020_AS_NUMERAL_STRING
    );
    expect(container.getElementsByTagName('button').length).toEqual(1);
    expect(container.getElementsByTagName('circle').length).toEqual(0);
    expect(container.innerHTML).not.toContain('Error message');

    fireEvent.click(firstButtonOf(container));

    expect(fetchProcessParameters).toHaveBeenCalled();
    expect(fetchJobLauncherPost).toHaveBeenCalled();
});

it('renders loader when running', async () => {
    await renderComponent(
        <RunButton status="RUNNING" timestamp={startOf2020IsoStr()} />,
        root
    );

    expect(container.innerHTML).not.toContain('run-button-');
    expect(container.getElementsByTagName('circle').length).toEqual(1);
    expect(container.getElementsByTagName('button').length).toEqual(0);
    expect(container.innerHTML).not.toContain('Error message');
});
