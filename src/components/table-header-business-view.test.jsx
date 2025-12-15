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
} from '../utils/test-utils.js';
import TableHeaderBusinessView from './table-header-business-view.jsx';
import { fireEvent } from '@testing-library/react';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders business date view', async () => {
    const onTsChange = jest.fn();
    await renderComponent(
        <TableHeaderBusinessView
            processName="VALID"
            timestamp={new Date(startOf2020IsoStr())}
            onTimestampChange={onTsChange}
        />,
        root
    );

    expect(container.innerHTML).toContain('VALID Supervisor');
    expect(container.innerHTML).not.toContain('Error message');

    fireEvent.change(document.getElementById('date'), {
        target: { value: startOf2020IsoStr() },
    });

    expect(onTsChange).toHaveBeenCalled();
});

it('renders business date view with no process name', async () => {
    const onTsChange = jest.fn();
    await renderComponent(
        <TableHeaderBusinessView
            processName={null}
            timestamp={new Date(startOf2020IsoStr())}
            onTimestampChange={onTsChange}
        />,
        root
    );

    expect(container.innerHTML).toContain('Supervisor');
    expect(container.innerHTML).not.toContain('Error message');
});
