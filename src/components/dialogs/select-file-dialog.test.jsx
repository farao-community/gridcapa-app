/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    cleanUpOnExit,
    renderComponent,
    setupTestContainer,
} from '../../utils/test-utils.js';
import SelectFileDialog from './select-file-dialog.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders select file dialog', async () => {
    await renderComponent(
        <SelectFileDialog
            fileType="CGM"
            handleClose={jest.fn()}
            open={true}
            selectFile={jest.fn()}
        />,
        root
    );

    expect(document.getElementsByTagName('button')).toHaveLength(2);
    expect(document.body.innerHTML).toContain('changeProcessFileAlertMessage');
    expect(container.innerHTML).not.toContain('Error message');
});
