/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

import PropTypes from 'prop-types';

import ModalHeader from './modal-header';

import { Box, Checkbox, Modal, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';

const style = {
    modalStyle: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw',
        minHeight: '70vh',
        backgroundColor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    modalContentStyle: {
        overflow: 'auto',
        maxHeight: '70vh',
    },
};

function ProcessParametersModal({ open, onClose, parameters }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style.modalStyle}>
                <ModalHeader titleId="processParameters" onClose={onClose} />
                <ProcessParametersModalContent parameters={parameters} />
            </Box>
        </Modal>
    );
}

ProcessParametersModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ProcessParametersModal;

function ProcessParametersModalContent({ parameters }) {
    return (
        <Box sx={style.modalContentStyle}>
            <ParametersList parameters={parameters} />
        </Box>
    );
}

ProcessParametersModalContent.propTypes = {
    parameters: PropTypes.array.isRequired,
};

function ParametersList({ parameters }) {
    parameters = [
        {
            id: 'TEST_ID_1',
            name: 'TestName1',
            parameterType: 'INT',
            value: '25',
            defaultValue: '33',
            sectionTitle: 'First section',
            displayOrder: '1',
        },
        {
            id: 'TEST_ID_2',
            name: 'TestName2',
            parameterType: 'BOOLEAN',
            defaultValue: 'false',
            sectionTitle: 'First section',
            displayOrder: '3',
        },
        {
            id: 'TEST_ID_3',
            name: 'TestName3',
            parameterType: 'STRING',
            value: 'disponibilité',
            defaultValue: 'écoute',
            sectionTitle: 'Second section',
            displayOrder: '12',
        },
    ];
    let parametersBySection = new Map();
    parameters.forEach((p) => {
        if (!parametersBySection.get(p.sectionTitle)) {
            parametersBySection.set(p.sectionTitle, []);
        }
        parametersBySection.get(p.sectionTitle).push(p);
    });

    parametersBySection = Array.from(parametersBySection.entries());

    const handleChange = (id) => {
        return (newValue) => {
            parameters.find((p) => p.id === id).value = newValue;
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

function ParameterElement({
    id,
    name,
    parameterType,
    value,
    defaultValue,
    handleChange,
    }) {
    const displayValue = value ? value : defaultValue;
    const localHandleChange = handleChange(id);

    switch (parameterType) {
        case 'BOOLEAN':
            return (
                <div>
                    <BooleanParameter
                        id={id}
                        name={name}
                        displayValue={displayValue}
                        handleChange={(event) =>
                            localHandleChange(event.target.checked)
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
                            localHandleChange(event.target.value)
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
                            localHandleChange(event.target.value)
                        }
                    />
                    (<FormattedMessage id="defaultValue" /> {defaultValue})
                </div>
            );
    }
}

function BooleanParameter({ id, name, displayValue, handleChange }) {
    const checked = displayValue === 'true';
    return (
        <span>
            {name}:
            <Checkbox defaultChecked={checked} onChange={handleChange} />
        </span>
    );
}

function IntParameter({ id, name, displayValue, handleChange }) {
    return (
        <span>
            {name}:
            <TextField
                type="number"
                variant="outlined"
                size="small"
                defaultValue={displayValue}
                onChange={handleChange}
            />
        </span>
    );
}

function DefaultParameter({ id, name, displayValue, handleChange }) {
    return (
        <span>
            {name}:
            <TextField
                variant="outlined"
                size="small"
                defaultValue={displayValue}
                onChange={handleChange}
            />
        </span>
    );
}
