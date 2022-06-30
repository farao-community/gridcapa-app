/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { Button, TextField, Menu, MenuItem } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { FilterList } from '@material-ui/icons';

const FilterMenu = ({ filterHint, handleChange }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [localFilter, setLocalFilter] = React.useState('');
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLocalChange = (event) => {
        setLocalFilter(event.currentTarget.value);
        handleChange(event);
    };

    return (
        <span>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                style={{
                    color: localFilter === '' ? 'inherit' : '#3F51b5',
                }}
            >
                <FilterList />
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem>
                    <TextField
                        id="levelTextField"
                        label={<FormattedMessage id={filterHint} />}
                        type="text"
                        defaultValue={''}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleLocalChange}
                    />
                </MenuItem>
            </Menu>
        </span>
    );
};

export default FilterMenu;
