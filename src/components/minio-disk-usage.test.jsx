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
} from '../utils/test-utils.test.js';
import { fetchMinioStorageData } from '../utils/rest-api.js';
import MinioDiskUsage from './minio-disk-usage.jsx';

let container = null;
let root = null;
jest.mock('../utils/rest-api', () => ({ fetchMinioStorageData: jest.fn() }));

beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('sums free and used spaces with several servers and drives', async () => {
    fetchMinioStorageData.mockImplementation(() =>
        Promise.resolve({
            info: {
                servers: [
                    { drives: [{ usedspace: 10, availspace: 10 }] },
                    {
                        drives: [
                            { usedspace: 15, availspace: 25 },
                            { usedspace: 5, availspace: 35 },
                        ],
                    },
                ],
            },
        })
    );

    await renderComponent(<MinioDiskUsage />, root);

    expect(container.innerHTML).toContain('30%');
});
