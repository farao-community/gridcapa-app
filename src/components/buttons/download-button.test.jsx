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
    START_2020_AS_NUMERAL_STRING,
    startOf2020IsoStr,
} from '../../utils/test-utils.js';
import DownloadButton from './download-button.jsx';
import { fireEvent } from '@testing-library/react';
import { fetchFileFromProcess } from '../../utils/rest-api.js';

jest.mock('../../utils/rest-api', () => ({
    fetchFileFromProcess: jest.fn(),
}));

global.URL.createObjectURL = jest.fn();

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders download button with its options', async () => {
    let processFile = {
        fileType: 'cgm',
        fileUrl: 'abcd',
        fileName: 'aaaa',
        processFileStatus: 'VALIDATED',
    };

    await renderComponent(
        <DownloadButton
            processFile={processFile}
            timestamp={startOf2020IsoStr()}
        />,
        root
    );
    expect(container.innerHTML).not.toContain('Error message');
    expect(container.innerHTML).toContain(
        'download-cgm-' + START_2020_AS_NUMERAL_STRING
    );
    expect(container.getElementsByTagName('button').length).toEqual(1);

    fireEvent.click(firstButtonOf(container));

    expect(fetchFileFromProcess).toHaveBeenCalled();
});

it('renders nothing if fileUrl is null', async () => {
    let processFile = {
        fileType: 'cgm',
        fileUrl: null,
        fileName: 'aaaa',
        processFileStatus: 'VALIDATED',
    };

    await renderComponent(
        <DownloadButton
            processFile={processFile}
            timestamp={startOf2020IsoStr()}
        />,
        root
    );
    expect(container.innerHTML).not.toContain('Error message');
    expect(container.innerHTML).not.toContain(
        'download-cgm-' + START_2020_AS_NUMERAL_STRING
    );
});
