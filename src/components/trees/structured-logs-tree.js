/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
    RichTreeView,
    TreeItem2Checkbox,
    TreeItem2Content,
    TreeItem2GroupTransition,
    TreeItem2Icon,
    TreeItem2IconContainer,
    TreeItem2Label,
    TreeItem2Provider,
    TreeItem2Root,
} from '@mui/x-tree-view';
import LabelIcon from '@mui/icons-material/Label';
import { useTreeItem2 } from '@mui/x-tree-view/useTreeItem2/useTreeItem2';
import { Box } from '@mui/material';

const styles = {
    itemStyle: {
        display: 'flex',
        gap: 1,
    },
};

function getIconColor(item) {
    const severity = item?.values?.reportSeverity?.value;
    if (severity) {
        switch (severity) {
            case 'INFO':
                return 'green';
            case 'WARN':
                return 'orange';
            case 'ERROR':
                return 'red';
            case 'DEBUG':
                return 'blue';
            default:
                break;
        }
    }
    return null;
}

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,
        getLabelProps,
        getGroupTransitionProps,
        status,
        publicAPI,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    const item = publicAPI.getItem(itemId);

    return (
        <TreeItem2Provider itemId={itemId}>
            <TreeItem2Root {...getRootProps(other)}>
                <TreeItem2Content {...getContentProps()}>
                    <TreeItem2IconContainer {...getIconContainerProps()}>
                        <TreeItem2Icon status={status} />
                    </TreeItem2IconContainer>
                    <Box sx={styles.itemStyle}>
                        <LabelIcon sx={{ color: getIconColor(item) }}>
                            {label[0]}
                        </LabelIcon>
                        <TreeItem2Checkbox {...getCheckboxProps()} />
                        <TreeItem2Label {...getLabelProps()} />
                    </Box>
                </TreeItem2Content>
                {children && (
                    <TreeItem2GroupTransition {...getGroupTransitionProps()} />
                )}
            </TreeItem2Root>
        </TreeItem2Provider>
    );
});

function StructuredLogsTree({
    items,
    apiRef,
    selectedItems,
    onSelectedItemsChange,
}) {
    return (
        <RichTreeView
            slots={{ item: CustomTreeItem }}
            items={items}
            apiRef={apiRef}
            selectedItems={selectedItems}
            onSelectedItemsChange={onSelectedItemsChange}
        />
    );
}

StructuredLogsTree.propTypes = {
    items: PropTypes.array.isRequired,
    apiRef: PropTypes.object.isRequired,
    selectedItems: PropTypes.object,
    onSelectedItemsChange: PropTypes.func.isRequired,
};

export default StructuredLogsTree;
