/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { act } from 'react-dom/test-utils';
import UploadButton from './upload-button.jsx';
import {
    cleanUpOnExit,
    renderWithProviders,
    setupTestContainer,
} from '../utils/test-utils.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders upload button with its options', async () => {
    let processFile = { fileType: 'cgm' };
    let timestamp = new Date(Date.UTC(2020, 0, 1)).toISOString();

    await act(() =>
        renderWithProviders(
            <UploadButton processFile={processFile} timestamp={timestamp} />,
            root
        )
    );

    expect(container.innerHTML).toContain('upload-cgm-1577836800000');
    expect(container.getElementsByTagName('button').length).toEqual(1);
});
