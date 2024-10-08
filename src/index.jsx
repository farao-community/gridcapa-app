/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './components/app-wrapper';
import './index.css';
import 'typeface-roboto';
import 'core-js/es/array/flat-map';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AppWrapper />
    </React.StrictMode>
);
