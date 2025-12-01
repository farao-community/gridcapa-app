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
import EventDialog from './event-dialog.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

jest.mock('../events-table');

it('renders loading event dialog', async () => {
    await renderComponent(
        <EventDialog
            open={true}
            onClose={console.log}
            eventsData={[]}
            isLoadingEvent={true}
        />,
        root
    );
    expect(document.documentElement.innerHTML).toContain('MuiLinearProgress');
});

it('renders idle event dialog', async () => {
    await renderComponent(
        <EventDialog
            open={true}
            onClose={console.log}
            eventsData={[{ level: 'INFO', message: 'OK' }]}
            isLoadingEvent={false}
        />,
        root
    );
    expect(document.documentElement.innerHTML).not.toContain(
        'MuiLinearProgress'
    );
});
