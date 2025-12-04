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
import OverviewTable from './overview-table.jsx';

let container = null;
let root = null;
jest.mock('../utils/rest-api', () => ({
    fetchTaskManagerSelectFile: jest.fn(),
}));
jest.mock('./buttons/download-button');
jest.mock('./upload-button');
jest.mock('./dialogs/select-file-dialog');

beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders overview table', async () => {
    const fileA = { fileType: 'a', fileName: 'theLetterA' };
    const fileB = { fileType: 'b', fileName: 'theLetterB' };
    const fileC = { fileType: 'c', fileName: 'theLetterC' };
    await renderComponent(
        <OverviewTable
            timestamp={startOf2020IsoStr()}
            inputs={[fileA, fileB]}
            outputs={[fileC]}
            availableInputs={[fileA]}
        />,
        root
    );

    expect(container.innerHTML).toContain('c-output-type');
    expect(container.innerHTML).toContain('a-input-type');
    expect(container.innerHTML).toContain('b-input-type');
});
