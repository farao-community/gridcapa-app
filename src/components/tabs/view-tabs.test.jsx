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
import ViewTabs from './view-tabs.jsx';
import { fireEvent } from '@testing-library/react';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('displays tabs', async () => {
    const viewChange = jest.fn();
    await renderComponent(
        <ViewTabs onViewChange={viewChange} view={0} />,
        root
    );

    ['0', '1', '2'].forEach((i) => {
        expect(container.innerHTML).toContain('simple-tab-' + i);
        expect(container.innerHTML).toContain('simple-tabpanel-' + i);
    });

    fireEvent.click(document.getElementById('simple-tab-2'));
    expect(viewChange).toHaveBeenCalled();
});
