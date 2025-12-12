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
import ProcessParametersDialog from './process-parameters-dialog.jsx';
import React from 'react';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

jest.mock('./parameters-confirm-closing-dialog');
jest.mock('./parameters-dialog-content');

afterEach(() => cleanUpOnExit(container, root));

it('renders process parameters and closes dialog', async () => {
    const btnAction = jest.fn();
    const closeAction = jest.fn();

    await renderComponent(
        <ProcessParametersDialog
            onClose={closeAction}
            open={true}
            parameters={[]}
            buttonAction={btnAction}
        />,
        root
    );

    expect(document.body.innerHTML).not.toContain('Error message');
    expect(document.getElementsByTagName('button').item(1).disabled).toBe(true);
    fireEvent.click(firstButtonOf(document));
    expect(closeAction).toHaveBeenCalled();
});
