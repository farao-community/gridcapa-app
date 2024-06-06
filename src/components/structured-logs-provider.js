/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import jsonTree from '../jsonData/jsonTree.json';
import StructuredLogsView from './structured-logs-view';

let idCounter = 0;
const generateUniqueId = () => `node-${idCounter++}`;

function getTreeItems(nodes) {
    return {
        id: generateUniqueId(),
        label: nodes.messageKey,
        children: Array.isArray(nodes.children)
            ? nodes.children.map((node) => getTreeItems(node))
            : null,
        values: nodes.values,
    };
}

function StructuredLogsProvider() {
    const logsTree = [getTreeItems(jsonTree.reportRoot)];

    return (
        <StructuredLogsView
            logsTree={logsTree}
            dictionaries={jsonTree.reportRoot.dictionaries}
        />
    );
}

export default StructuredLogsProvider;
