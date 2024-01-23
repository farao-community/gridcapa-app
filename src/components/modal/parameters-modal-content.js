/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import { Box, Checkbox, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const modalContentStyle = {
    overflow: 'auto',
    maxHeight: '70vh',
};

function ParametersModalContent({ parameters, setButtonDisabled }) {
    return (
        <Box sx={modalContentStyle}>
            <ParametersList
                parameters={parameters}
                enableButton={() => setButtonDisabled(false)}
            />
        </Box>
    );
}

ParametersModalContent.propTypes = {
    parameters: PropTypes.array.isRequired,
    setButtonDisabled: PropTypes.func.isRequired,
};

export default ParametersModalContent;

function ParametersList({ parameters, enableButton }) {
    let parametersBySection = new Map();
    parameters.sort((a, b) => a.sectionOrder - b.sectionOrder);
    parameters.forEach((p) => {
        if (p.value == null) {
            p.value = p.defaultValue;
        }

        if (!parametersBySection.get(p.sectionTitle)) {
            parametersBySection.set(p.sectionTitle, []);
        }
        parametersBySection.get(p.sectionTitle).push(p);
    });

    parametersBySection = Array.from(parametersBySection.entries());

    const handleChange = (id) => {
        return (newValue) => {
            parameters.find((p) => p.id === id).value = newValue;
            enableButton();
        };
    };

    return (
        <div>
            {parametersBySection.map((p) => (
                <ParametersSection
                    sectionTitle={p[0]}
                    sectionParameters={p[1]}
                    handleChange={handleChange}
                />
            ))}
        </div>
    );
}

ParametersList.propTypes = {
    parameters: PropTypes.array.isRequired,
    enableButton: PropTypes.func.isRequired,
};

function ParametersSection({ sectionTitle, sectionParameters, handleChange }) {
    sectionParameters.sort((p1, p2) => p1.displayOrder - p2.displayOrder);

    return (
        <div>
            <h3>{sectionTitle}</h3>
            {sectionParameters.map((p) => (
                <ParameterElement
                    id={p.id}
                    name={p.name}
                    parameterType={p.parameterType}
                    value={p.value}
                    defaultValue={p.defaultValue}
                    handleChange={handleChange}
                />
            ))}
        </div>
    );
}

ParametersSection.propTypes = {
    sectionTitle: PropTypes.string.isRequired,
    sectionParameters: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
};

function ParameterElement({
    id,
    name,
    parameterType,
    value,
    defaultValue,
    handleChange,
}) {
    const displayValue = value ? value : defaultValue;
    const handleParameterValueChange = handleChange(id);

    switch (parameterType) {
        case 'BOOLEAN':
            return (
                <div>
                    <BooleanParameter
                        id={id}
                        name={name}
                        displayValue={displayValue}
                        handleChange={(event) =>
                            handleParameterValueChange(
                                event.target.checked.toString()
                            )
                        }
                    />
                    (<FormattedMessage id="defaultValue" /> {defaultValue})
                </div>
            );
        case 'INT':
            return (
                <div>
                    <IntParameter
                        id={id}
                        name={name}
                        displayValue={displayValue}
                        handleChange={(event) =>
                            handleParameterValueChange(event.target.value)
                        }
                    />
                    (<FormattedMessage id="defaultValue" /> {defaultValue})
                </div>
            );
        case 'STRING':
        default:
            return (
                <div>
                    <DefaultParameter
                        id={id}
                        name={name}
                        displayValue={displayValue}
                        handleChange={(event) =>
                            handleParameterValueChange(event.target.value)
                        }
                    />
                    (<FormattedMessage id="defaultValue" /> {defaultValue})
                </div>
            );
    }
}

ParameterElement.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    parameterType: PropTypes.string.isRequired,
    value: PropTypes.string,
    defaultValue: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};

function BooleanParameter({ id, name, displayValue, handleChange }) {
    const checked = displayValue === 'true';
    return (
        <span>
            {name}:
            <Checkbox defaultChecked={checked} onChange={handleChange} />
        </span>
    );
}

BooleanParameter.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    displayValue: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};

const textInputStyle = {
    verticalAlign: 'middle',
    margin: '5px 15px',
};

function IntParameter({ id, name, displayValue, handleChange }) {
    return (
        <span>
            {name}:
            <TextField
                type="number"
                variant="standard"
                size="small"
                defaultValue={displayValue}
                onChange={handleChange}
                sx={textInputStyle}
            />
        </span>
    );
}

IntParameter.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    displayValue: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};

function DefaultParameter({ id, name, displayValue, handleChange }) {
    return (
        <span>
            {name}:
            <TextField
                variant="standard"
                size="small"
                defaultValue={displayValue}
                onChange={handleChange}
                sx={textInputStyle}
            />
        </span>
    );
}

DefaultParameter.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    displayValue: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};
