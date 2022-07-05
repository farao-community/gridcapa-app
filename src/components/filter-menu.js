/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import { Button, TextField, Menu, MenuItem } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { FilterList } from '@material-ui/icons';

const FilterMenu = ({ filterHint, handleChange }) => {
    const [
        anchorElementForFilterMenu,
        setAnchorElementForFilterMenu,
    ] = React.useState(null);
    const [localFilter, setLocalFilter] = React.useState('');
    const handleMenuClick = (event) => {
        setAnchorElementForFilterMenu(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElementForFilterMenu(null);
    };

    const handleLocalChange = (event) => {
        setLocalFilter(event.currentTarget.value);
        handleChange(event);
    };

    const autofocus = () => {
        document.getElementById(filterHint).focus();
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
                anchorEl={anchorElementForFilterMenu}
                keepMounted
                open={Boolean(anchorElementForFilterMenu)}
                onClose={handleClose}
                TransitionProps={{ onEntered: autofocus }}
            >
                <MenuItem>
                    <TextField
                        id={filterHint}
                        label={<FormattedMessage id={filterHint} />}
                        type="text"
                        defaultValue={''}
                        autoComplete="off"
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
