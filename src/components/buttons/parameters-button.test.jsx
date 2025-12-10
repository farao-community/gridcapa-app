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
} from '../../utils/test-utils.js';
import { fireEvent } from '@testing-library/react';
import { fetchProcessParameters } from '../../utils/rest-api.js';
import ParametersButton from './parameters-button.jsx';

jest.mock('../../utils/rest-api', () => ({
    updateProcessParameters: jest.fn(),
    fetchProcessParameters: jest.fn(),
}));
jest.mock('../dialogs/process-parameters-dialog');
global.URL.createObjectURL = jest.fn();

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders parameters button', async () => {
    await renderComponent(<ParametersButton />, root);

    expect(container.innerHTML).toContain('SettingsIcon');
    expect(container.innerHTML).not.toContain('Error message');
    expect(container.getElementsByTagName('button').length).toEqual(1);

    fireEvent.click(firstButtonOf(container));

    expect(fetchProcessParameters).toHaveBeenCalled();
});
