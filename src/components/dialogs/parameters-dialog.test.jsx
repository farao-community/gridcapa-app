/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { cleanUpOnExit, renderComponent, setupTestContainer, } from '../../utils/test-utils.js';
import ParametersDialog from './parameters-dialog.jsx';
import * as notistack from 'notistack';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

jest.mock('../../utils/rest-api', () => ({ updateConfigParameter: jest.fn() }));
jest.mock('../../utils/messages', () => ({ useIntlRef: jest.fn() }));
notistack.useSnackbar = jest.fn(() => jest.fn());

it('renders parameters dialog', async () => {
    await renderComponent(
        <ParametersDialog open={true} onClose={jest.fn()} />,
        root
    );

    expect(document.documentElement.innerHTML).toContain(
        'parameters-dialog-title'
    );
    expect(container.innerHTML).not.toContain('Error message');
});
