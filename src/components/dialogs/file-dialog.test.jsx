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
    startOf2020IsoStr,
} from '../../utils/test-utils.js';
import FileDialog from './file-dialog.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders file dialog', async () => {
    await renderComponent(
        <FileDialog
            open={true}
            inputs={[]}
            onClose={jest.fn()}
            outputs={[]}
            timestamp={startOf2020IsoStr()}
        />,
        root
    );
    expect(container.innerHTML).not.toContain('Error message');
    expect(document.getElementsByTagName('button')).toHaveLength(1);
    expect(document.documentElement.innerHTML).toContain('globalViewCoreFiles');
});
