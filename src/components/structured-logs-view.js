/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';
import { useTreeViewApiRef } from '@mui/x-tree-view';

import StructuredLogsTable from './tables/structured-logs-table';
import StructuredLogsTree from './trees/structured-logs-tree';

const styles = {
    rootStyle: {
        display: 'flex',
    },
    treeViewStyle: {
        width: '33%',
    },
    structuredLogsTableStyle: {
        width: '67%',
    },
};

function extractVariables(str) {
    const regex = /\${(.*?)}/g;
    let variables = [];
    let match;

    while ((match = regex.exec(str)) !== null) {
        variables.push(match[1]);
    }

    return variables;
}

function getMessage(dictionaries, selectedItem) {
    if (!selectedItem || !selectedItem.label) {
        throw new Error(
            "L'objet 'selectedItem' ou la clé 'label' est manquant."
        );
    }

    if (!dictionaries || !dictionaries.default) {
        throw new Error(
            "L'objet 'dictionaries' ou la clé 'default' est manquant."
        );
    }

    const messageKey = selectedItem.label;
    const messageTemplate = dictionaries.default[messageKey];

    if (!messageTemplate) {
        throw new Error(
            `Le message avec la clé '${messageKey}' est introuvable.`
        );
    }

    const variables = extractVariables(messageTemplate);

    let message = messageTemplate;
    variables.forEach((variable) => {
        const variableValue = selectedItem.values[variable].value;
        const variablePlaceholder = `\${${variable}}`;
        message = message.replace(variablePlaceholder, variableValue);
    });

    return message;
}

function filteredEventData(eventsData, dictionaries, selectedItem) {
    if (!eventsData || !selectedItem) {
        return eventsData;
    }

    const message = getMessage(dictionaries, selectedItem);
    if (selectedItem?.values?.reportSeverity?.value) {
        return eventsData.filter(
            (event) =>
                event.level === selectedItem.values.reportSeverity.value &&
                event.message.includes(message)
        );
    }
    return eventsData.filter((event) => event.message.includes(message));
}

function StructuredLogsView({ logsTree, dictionaries, eventsData }) {
    const apiRef = useTreeViewApiRef();
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelectedItemsChange = (event, itemId) => {
        if (itemId == null) {
            setSelectedItem(null);
        } else {
            setSelectedItem(apiRef.current.getItem(itemId));
        }
    };

    return (
        <Box sx={styles.rootStyle}>
            <Box sx={styles.treeViewStyle}>
                <StructuredLogsTree
                    items={logsTree}
                    apiRef={apiRef}
                    selectedItems={selectedItem}
                    onSelectedItemsChange={handleSelectedItemsChange}
                />
            </Box>
            <Box sx={styles.structuredLogsTableStyle}>
                <StructuredLogsTable
                    eventsData={filteredEventData(
                        eventsData,
                        dictionaries,
                        selectedItem
                    )}
                />
            </Box>
        </Box>
    );
}

StructuredLogsView.propTypes = {
    logsTree: PropTypes.array.isRequired,
    dictionaries: PropTypes.object.isRequired,
    eventsData: PropTypes.array.isRequired,
};

export default StructuredLogsView;
