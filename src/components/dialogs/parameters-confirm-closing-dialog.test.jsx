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
import ParametersConfirmClosingDialog from './parameters-confirm-closing-dialog.jsx';
import { fireEvent } from '@testing-library/react';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders parameters confirm closing dialog, and click yes', async () => {
    const yes = jest.fn();
    const close = jest.fn();
    await renderComponent(
        <ParametersConfirmClosingDialog
            open={true}
            onClickYes={yes}
            closeDialog={close}
        />,
        root
    );

    ['parametersNotSavedDialog', 'yes', 'no', 'quit', 'cancel'].forEach(
        (text) => expect(document.body.innerHTML).toContain(text)
    );
    expect(document.body.innerHTML).not.toContain('Error message');
    fireEvent.click(firstButtonOf(document.documentElement));

    expect(yes).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
});

it('renders parameters confirm closing dialog, and click close', async () => {
    const yes = jest.fn();
    const close = jest.fn();
    await renderComponent(
        <ParametersConfirmClosingDialog
            open={true}
            onClickYes={yes}
            closeDialog={close}
        />,
        root
    );

    fireEvent.click(
        document.documentElement.getElementsByTagName('button').item(1)
    );

    expect(yes).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
});

it('does not render everything if open is false', async () => {
    const yes = jest.fn();
    const close = jest.fn();
    await renderComponent(
        <ParametersConfirmClosingDialog
            open={false}
            onClickYes={yes}
            closeDialog={close}
        />,
        root
    );

    ['parametersNotSavedDialog', 'yes', 'quit', 'cancel'].forEach((text) =>
        expect(document.body.innerHTML).not.toContain(text)
    );
    expect(document.body.innerHTML).not.toContain('Error message');
});
