/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    Menu,
    MenuItem,
    FormControlLabel,
    Checkbox,
    FormGroup,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { FilterList } from '@mui/icons-material';

const createSelectedFilterArray = (predefinedValues, isSelected = true) => {
    if (Array.isArray(predefinedValues)) {
        return predefinedValues.map((filter) => {
            if (filter.filterName) {
                return filter.defaultChecked;
            } else {
                return isSelected;
            }
        });
    } else {
        return Object.keys(predefinedValues).map(() => isSelected);
    }
};

const FilterMenu = ({
    filterHint,
    handleChange,
    currentFilter,
    predefinedValues = [],
    manual = true,
}) => {
    const [anchorElementForFilterMenu, setAnchorElementForFilterMenu] =
        useState(null);
    const [localFilter, setLocalFilter] = useState();
    const handleMenuClick = (event) => {
        setAnchorElementForFilterMenu(event.currentTarget);
    };

    const [selectedFilter, setSelectedFilter] = useState([]);

    useEffect(() => {
        setSelectedFilter(createSelectedFilterArray(predefinedValues));
        // eslint-disable-next-line
    }, [predefinedValues.length]); //tell to eslint to ignore this line.
    // We only trigger this effect when the size of the filter change. Typically when we receive it from the fetch.
    // We have an infinite loop otherwise.
    // refer to https://reactjs.org/docs/hooks-effect.html

    const [toFilter, setToFilter] = useState([]);

    const handleClose = () => {
        setAnchorElementForFilterMenu(null);
    };

    const handleLocalChange = (event) => {
        let newToFilter = [];
        let boxFilter = [...selectedFilter];
        if (event.currentTarget.name === 'text') {
            const value = event.currentTarget.value;
            setLocalFilter([value]);
            if (value !== '') {
                newToFilter.push(value);
            }
        } else {
            let index = event.currentTarget.name.split('_')[1];
            boxFilter[index] = !boxFilter[parseInt(index)];
            setSelectedFilter(boxFilter);

            if (Array.isArray(predefinedValues)) {
                predefinedValues.forEach((filter, filterIndex) => {
                    if (boxFilter[filterIndex] && filter.filterValue) {
                        newToFilter.push(...filter.filterValue);
                    } else if (boxFilter[filterIndex]) {
                        newToFilter.push(filter);
                    }
                });
            } else {
                Object.keys(predefinedValues).forEach((category, keyIndex) => {
                    if (boxFilter[keyIndex]) {
                        predefinedValues[category].forEach((fil) =>
                            newToFilter.push(fil)
                        );
                    }
                });
                newToFilter = [...new Set(newToFilter)];
            }
        }

        setToFilter(newToFilter);
        handleChange(newToFilter);
    };

    const autofocus = () => {
        if (manual) {
            document.getElementById(filterHint).focus();
        }
    };

    const createFilterList = () => {
        let keys = [];
        if (Array.isArray(predefinedValues)) {
            keys = predefinedValues.map((filter) => {
                return filter.filterName ? filter.filterName : filter;
            });
        } else if (Object.keys(predefinedValues).length > 0) {
            keys = Object.keys(predefinedValues);
        }

        return (
            <FormGroup row>
                {keys.map((oneFilter, index) => {
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
                open={Boolean(anchorElementForFilterMenu)}
                onClose={handleClose}
                TransitionProps={{ onEntered: autofocus }}
            >
                {manual && (
                    <MenuItem onKeyDown={(e) => e.stopPropagation()}>
                        <TextField
                            variant="standard"
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
                {((Array.isArray(predefinedValues) &&
                    predefinedValues.length > 0) ||
                    Object.keys(predefinedValues).length > 0) && (
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
