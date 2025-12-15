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
} from '../utils/test-utils.js';
import AppTopBar from './app-top-bar.jsx';
import {
    fetchAppsAndUrls,
    fetchVersionAndEnvironnement,
} from '../utils/rest-api.js';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

const env = {
    appsMetadataServerUrl: 'http://localhost/apps-metadata.json',
    appsMinioStorageServerUrl:
        'http://localhost/apps-metadata/data/minioStorageData.json',
    appVersionAndEnvironnement: 'Front Local',
};

jest.mock('../utils/rest-api', () => ({
    fetchAppsAndUrls: jest.fn(() =>
        Promise.resolve([
            env.appsMetadataServerUrl,
            env.appsMinioStorageServerUrl,
        ])
    ),
    fetchVersionAndEnvironnement: jest.fn(() =>
        Promise.resolve(env.appVersionAndEnvironnement)
    ),
}));
jest.mock('./tabs/view-tabs');
jest.mock('./buttons/parameters-button');
jest.mock('./minio-disk-usage');
jest.mock('./gridcapa-logo-text');

it('renders app top bar with parameters enabled', async () => {
    const usrMgr = {
        instance: null,
        error: null,
    };
    await renderComponent(
        <AppTopBar
            parametersEnabled={true}
            view={1}
            onViewChange={jest.fn()}
            user={{ profile: { app: 'GRIDCAPA', name: 'John Doe' } }}
            userManager={usrMgr}
        />,
        root
    );

    expect(container.getElementsByTagName('button')).toHaveLength(2);
    expect(fetchAppsAndUrls).toHaveBeenCalled();
    expect(fetchVersionAndEnvironnement).toHaveBeenCalled();
    expect(container.innerHTML).not.toContain('Error message');
});
