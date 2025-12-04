/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { displayErrorMessageWithSnackbar } from './messages.js';

const intlRef = { current: { formatMessage: (a) => a.toString() } };
const enqueueSnackbar = jest.fn();

it('should call snackbar when displaying errors', async () => {
    displayErrorMessageWithSnackbar({
        errorMessage: 'error',
        enqueueSnackbar: enqueueSnackbar,
        headerMessage: {
            headerMessageId: '1',
            headerMessageValues: { a: 'b', c: 'd' },
            intlRef: intlRef,
        },
    });

    displayErrorMessageWithSnackbar({
        errorMessage: 'error',
        enqueueSnackbar: enqueueSnackbar,
        headerMessage: {
            headerMessageId: undefined,
            headerMessageValues: { a: 'b', c: 'd' },
            intlRef: intlRef,
        },
    });

    expect(enqueueSnackbar).toHaveBeenCalledTimes(2);
});
