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
import { RunAllButton } from './run-all-timestamps-for-business-date-button.jsx';
import { fireEvent } from '@testing-library/react';
import { fetchBusinessDateData } from '../utils/rest-api.js';

jest.mock('../utils/rest-api', () => ({
    fetchJobLauncherPost: jest.fn(),
    fetchBusinessDateData: jest.fn(),
    fetchProcessParameters: jest.fn(),
}));
jest.mock('../utils/websocket-api', () => ({
    connectTaskNotificationWebSocket: jest.fn(),
    disconnectTaskNotificationWebSocket: jest.fn(),
}));
jest.mock('./dialogs/timestamp-parameters-dialog');

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders run all button', async () => {
    await renderComponent(
        <RunAllButton timestamp={startOf2020IsoStr()} />,
        root
    );

    expect(container.innerHTML).toContain(
        'run-all-button-2020-01-01T00:00:00.000Z'
    );
    expect(container.innerHTML).not.toContain('Error message');
    expect(container.getElementsByTagName('button').length).toEqual(1);

    fireEvent.click(firstButtonOf(container));

    expect(fetchBusinessDateData).toHaveBeenCalled();
});
