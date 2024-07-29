/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';

import PropTypes from 'prop-types';

import { Checkbox, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';

export const REFERENCE_DEFAULT = 'defaultValue';
export const REFERENCE_PROCESS = 'processValue';

function getParametersBySection(parameters) {
    let parametersBySection = new Map();
    parameters.sort((a, b) => a.sectionOrder - b.sectionOrder);
    parameters.forEach((p) => {
        if (p.value == null) {
            p.value = p.defaultValue;
        }
        if (!p.processValue) {
            // reference value for Timestamp parameter modal must not change as fields are edited or modal re-rendered
            // therefore we define a new field and set the value only once at modal initialization
            p.processValue = p.value;
        }

        if (!parametersBySection.get(p.sectionTitle)) {
            parametersBySection.set(p.sectionTitle, []);
        }
        parametersBySection.get(p.sectionTitle).push(p);
    });

    return Array.from(parametersBySection.entries());
}

function ParametersDialogContent({
    parameters,
    setParametersChanged,
    reference,
}) {
    const handleChange = (id) => {
        return (newValue) => {
            parameters.find((p) => p.id === id).value = newValue;
            setParametersChanged(true);
        };
    };

    return getParametersBySection(parameters).map((p) => (
        <ParametersSection
            sectionTitle={p[0]}
            sectionParameters={p[1]}
            handleChange={handleChange}
            reference={reference}
        />
    ));
}

ParametersDialogContent.propTypes = {
    parameters: PropTypes.array.isRequired,
    setParametersChanged: PropTypes.func.isRequired,
    reference: PropTypes.string.isRequired,
};

export default ParametersDialogContent;

const parameterSectionStyle = {
    fieldsetStyle: {
        margin: '20px 0',
    },
    legendStyle: {
        margin: '0 5px',
    },
};

function ParametersSection({
    sectionTitle,
    sectionParameters,
    handleChange,
    reference,
}) {
    sectionParameters.sort((p1, p2) => p1.displayOrder - p2.displayOrder);

    return (
        <fieldset style={parameterSectionStyle.fieldsetStyle}>
            <legend>
                <h3 style={parameterSectionStyle.legendStyle}>
                    {sectionTitle}
                </h3>
            </legend>
            {sectionParameters.map((p) => (
                <div>
                    <ParameterElement
                        id={p.id}
                        name={p.name}
                        parameterType={p.parameterType}
                        value={p.value}
                        defaultValue={p.defaultValue}
                        processValue={p.processValue}
                        reference={reference}
                        handleChange={handleChange}
                    />
                </div>
            ))}
        </fieldset>
    );
}

ParametersSection.propTypes = {
    sectionTitle: PropTypes.string.isRequired,
    sectionParameters: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    reference: PropTypes.string.isRequired,
};

const changedStyle = {
    color: 'orange',
};

const ParameterType = {
    BOOLEAN: 'BOOLEAN',
    INT: 'INT',
    STRING: 'STRING',
};

function ParameterElement({
    id,
    name,
    parameterType,
    value,
    defaultValue,
    processValue,
    reference,
    handleChange,
}) {
    const handleParameterValueChange = handleChange(id);
    const referenceValue =
        reference === REFERENCE_PROCESS ? processValue : defaultValue;
    const [changed, setChanged] = useState(referenceValue !== value);

    switch (parameterType) {
        case ParameterType.BOOLEAN:
            return (
                <>
                    <BooleanParameter
                        name={name}
                        displayValue={value}
                        handleChange={(event) => {
                            setChanged(
                                referenceValue !==
                                    event.target.checked.toString()
                            );
                            handleParameterValueChange(
                                event.target.checked.toString()
                            );
                        }}
                    />
                    <span style={changed ? changedStyle : {}}>
                        (<FormattedMessage id={reference} /> {referenceValue})
                    </span>
                </>
            );
        case ParameterType.INT:
            return (
                <>
                    <IntParameter
                        name={name}
                        displayValue={value}
                        handleChange={(event) => {
                            setChanged(referenceValue !== event.target.value);
                            handleParameterValueChange(event.target.value);
                        }}
                    />
                    <span style={changed ? changedStyle : {}}>
                        (<FormattedMessage id={reference} /> {referenceValue})
                    </span>
                </>
            );
        case ParameterType.STRING:
        default:
            return (
                <>
                    <DefaultParameter
                        name={name}
                        displayValue={value}
                        handleChange={(event) => {
                            setChanged(referenceValue !== event.target.value);
                            handleParameterValueChange(event.target.value);
                        }}
                    />
                    <span style={changed ? changedStyle : {}}>
                        (<FormattedMessage id={reference} /> {referenceValue})
                    </span>
                </>
            );
    }
}

ParameterElement.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    parameterType: PropTypes.string.isRequired,
    value: PropTypes.string,
    defaultValue: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};

function BooleanParameter({ name, displayValue, handleChange }) {
    const checked = displayValue === 'true';
    return (
        <>
            {name}:
            <Checkbox defaultChecked={checked} onChange={handleChange} />
        </>
    );
}

BooleanParameter.propTypes = {
    name: PropTypes.string.isRequired,
    displayValue: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};

const textInputStyle = {
    verticalAlign: 'middle',
    margin: '5px 15px',
};

function IntParameter({ name, displayValue, handleChange }) {
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

IntParameter.propTypes = {
    name: PropTypes.string.isRequired,
    displayValue: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};

function DefaultParameter({ name, displayValue, handleChange }) {
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
    name: PropTypes.string.isRequired,
    displayValue: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired,
};
