/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React from 'react';
import {
    Button,
    TextField,
    Menu,
    MenuItem,
    FormControlLabel,
    Checkbox,
    FormGroup,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { FilterList } from '@material-ui/icons';

const FilterMenu = ({
    filterHint,
    handleChange,
    currentFilter,
    predefinedValues = [],
    manual = true,
}) => {
    const [
        anchorElementForFilterMenu,
        setAnchorElementForFilterMenu,
    ] = React.useState(null);
    const [localFilter, setLocalFilter] = React.useState(currentFilter);
    const handleMenuClick = (event) => {
        setAnchorElementForFilterMenu(event.currentTarget);
    };

    const [selectedFilter, setSelectedFilter] = React.useState(
        predefinedValues.map(() => true)
    );
    const [toFilter, settoFilter] = React.useState([]);

    const handleClose = () => {
        setAnchorElementForFilterMenu(null);
    };

    const handleLocalChange = (event) => {
        let newtoFilter = [];
        let boxFilter = [...selectedFilter];
        if (event.currentTarget.name === 'text') {
            setLocalFilter([event.currentTarget.value]);
            if (event.currentTarget.value !== '')
                newtoFilter.push(event.currentTarget.value);
        } else {
            let index = event.currentTarget.name.split('_')[1];
            boxFilter[index] = !boxFilter[parseInt(index)];
            setSelectedFilter(boxFilter);
            predefinedValues.forEach((filter, filterIndex) => {
                if (boxFilter[filterIndex]) newtoFilter.push(filter);
            });
        }

        settoFilter(newtoFilter);
        handleChange(newtoFilter);
    };

    const autofocus = () => {
        if (manual) {
            document.getElementById(filterHint).focus();
        }
    };

    const createFilterList = () => {
        return (
            <FormGroup row>
                {predefinedValues.map((oneFilter, index) => {
                    return (
                        <FormControlLabel
                            key={'checkBox' + index}
                            control={
                                <Checkbox
                                    checked={selectedFilter[index]}
                                    onChange={handleLocalChange}
                                    name={'checkBox_' + index}
                                    color="secondary"
                                    value={oneFilter}
                                />
                            }
                            label={oneFilter}
                        />
                    );
                })}
            </FormGroup>
        );
    };

    return (
        <span>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                style={{
                    color: toFilter.length > 0 ? '#3F51b5' : 'inherit',
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
                {manual && (
                    <MenuItem>
                        <TextField
                            id={filterHint}
                            label={<FormattedMessage id={filterHint} />}
                            type="text"
                            name="text"
                            defaultValue={localFilter}
                            autoComplete="off"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleLocalChange}
                        />
                    </MenuItem>
                )}
                {predefinedValues.length > 0 && (
                    <MenuItem style={{ maxWidth: '20vw' }}>
                        {' '}
                        {createFilterList()}{' '}
                    </MenuItem>
                )}
            </Menu>
        </span>
    );
};

export default FilterMenu;
