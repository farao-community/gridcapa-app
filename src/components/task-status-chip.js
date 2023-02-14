/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Chip from '@mui/material/Chip';
import { useSelector } from 'react-redux';
import React from 'react';
import { PARAM_THEME } from '../utils/config-params';
import { getTaskStatusStyle } from './task-status-style';

export function TaskStatusChip(props) {
    const theme = useSelector((state) => state[PARAM_THEME]);

    return (
        <Chip
            {...props}
            label={props['task-status']}
            style={{ ...getTaskStatusStyle(props['task-status'], theme) }}
        />
    );
}
