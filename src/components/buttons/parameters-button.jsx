/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';

import { useIntlRef } from '../../utils/messages';
import { useSnackbar } from 'notistack';
import ProcessParametersDialog from '../dialogs/process-parameters-dialog';
import {
    fetchProcessParameters,
    updateProcessParameters,
} from '../../utils/rest-api';

import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

function ParametersButton() {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();

    const [parametersDialogOpen, setParametersDialogOpen] = useState(false);
    const [processParameters, setProcessParameters] = useState([]);

    const handleParametersDialogOpening = async () => {
        const parameters = await fetchProcessParameters();
        setParametersDialogOpen(true);
        setProcessParameters(parameters);
    };

    const handleParametersDialogClosing = () => {
        setParametersDialogOpen(false);
    };

    const handleParametersUpdate = () => {
        console.log('Parameters to update:', processParameters);
        return updateProcessParameters(
            processParameters,
            intlRef,
            enqueueSnackbar
        ).then((updatedParameters) => {
            console.log('Updated parameters: ', updatedParameters);
            handleParametersDialogClosing();
        });
    };

    return (
        <>
            <IconButton onClick={handleParametersDialogOpening}>
                <SettingsIcon />
            </IconButton>
            <ProcessParametersDialog
                open={parametersDialogOpen}
                onClose={handleParametersDialogClosing}
                buttonAction={handleParametersUpdate}
                parameters={processParameters}
            />
        </>
    );
}

export default ParametersButton;
