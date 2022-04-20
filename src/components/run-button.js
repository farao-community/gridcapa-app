/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';
import { fetchJobLauncherGet } from '../utils/rest-api';

function isDisabled(taskStatus) {
    return (
        taskStatus !== 'READY' &&
        taskStatus !== 'SUCCESS' &&
        taskStatus !== 'ERROR'
    );
}

export function RunButton({ status, timestamp }) {
    const [disabled, setDisabled] = useState(false);

    const launchTask = async () => {
        setDisabled(true);
        await fetchJobLauncherGet(timestamp);
        setDisabled(false);
    };

    return (
        <Button
            color="primary"
            data-test="run-button"
            variant="contained"
            size="large"
            disabled={disabled || isDisabled(status)}
            onClick={launchTask}
        >
            <FormattedMessage id="runButtonLabel" />
        </Button>
    );
}
