/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import UploadButton from './upload-button.jsx';
import {
    cleanUpOnExit,
    renderComponent,
    setupTestContainer,
    START_2020_AS_NUMERAL_STRING,
    startOf2020IsoStr,
} from '../utils/test-utils.test.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders upload button with its options', async () => {
    let processFile = { fileType: 'cgm' };

    await renderComponent(
        <UploadButton
            processFile={processFile}
            timestamp={startOf2020IsoStr()}
        />,
        root
    );

    expect(container.innerHTML).toContain(
        'upload-cgm-' + START_2020_AS_NUMERAL_STRING
    );
    expect(container.getElementsByTagName('button').length).toEqual(1);
});
