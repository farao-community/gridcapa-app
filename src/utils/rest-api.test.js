/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    fetchAppsAndUrls,
    fetchBusinessDateData,
    fetchConfigParameter,
    fetchConfigParameters,
    fetchFileFromProcess,
    fetchFileToBackend,
    fetchIdpSettings,
    fetchJobLauncherPost,
    fetchJobLauncherToInterruptTask,
    fetchMinioStorageData,
    fetchProcessParameters,
    fetchRunningTasksData,
    fetchTaskManagerManualExport,
    fetchTaskManagerSelectFile,
    fetchTimestampData,
    fetchVersionAndEnvironnement,
    getBaseUrl,
    updateConfigParameter,
    updateProcessParameters,
} from './rest-api.js';
import { startOf2020IsoStr } from './test-utils.js';

const timestamp = startOf2020IsoStr();
const formData = { a: 'b', c: 'd' };
const intlRef = { current: { formatMessage: (a) => a.toString() } };
const enqueueSnackbar = jest.fn();
const type = 'cgm';
const appName = 'GRIDCAPA';

it('should get base url', async () => {
    expect(getBaseUrl()).not.toBeNull();
});

it('should call node fetch without args', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: 100 }),
            text: () => Promise.resolve('hello'),
        })
    );

    await fetchIdpSettings();
    await fetchAppsAndUrls();
    await fetchVersionAndEnvironnement();
    await fetchMinioStorageData();
    await fetchProcessParameters();

    expect(fetch).toHaveBeenCalledTimes(7);
});

it('should call node fetch with args', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ data: 100 }),
            text: () => Promise.resolve('hello'),
        })
    );

    await fetchFileToBackend(timestamp, formData);
    await fetchTimestampData(timestamp, intlRef, enqueueSnackbar);
    await fetchFileFromProcess(timestamp, type, intlRef, enqueueSnackbar);
    await fetchBusinessDateData(timestamp, intlRef, enqueueSnackbar);
    await fetchRunningTasksData(intlRef, enqueueSnackbar);
    await fetchConfigParameters(appName);
    await fetchConfigParameter(appName);
    await updateConfigParameter(appName, type);
    await fetchJobLauncherPost(timestamp, formData);
    await fetchJobLauncherToInterruptTask(timestamp, '1');
    await fetchTaskManagerSelectFile(timestamp, type, type);
    await fetchTaskManagerManualExport(timestamp);
    await updateProcessParameters(formData, intlRef, enqueueSnackbar);

    expect(fetch).toHaveBeenCalledTimes(13);
});

it('should handle node fetch errors', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ data: 100 }),
            text: () => Promise.resolve('hello'),
        })
    );

    await fetchTimestampData(timestamp, intlRef, enqueueSnackbar).catch((e) => {
        expect(e).toEqual('hello');
    });
    await fetchFileFromProcess(timestamp, type, intlRef, enqueueSnackbar).catch(
        (e) => {
            expect(e).toEqual('hello');
        }
    );
    await fetchBusinessDateData(timestamp, intlRef, enqueueSnackbar).catch(
        (e) => {
            expect(e).toEqual('hello');
        }
    );
    await fetchRunningTasksData(intlRef, enqueueSnackbar).catch((e) => {
        expect(e).toEqual('hello');
    });
    await updateProcessParameters(formData, intlRef, enqueueSnackbar).catch(
        (e) => {
            expect(e).toEqual('hello');
        }
    );

    expect(enqueueSnackbar).toHaveBeenCalledTimes(6);
});
