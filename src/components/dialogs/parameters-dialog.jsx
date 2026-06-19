/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
    displayErrorMessageWithSnackbar,
    useIntlRef,
} from '../../utils/messages';

import {
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';

import { updateConfigParameter } from '../../utils/rest-api';
import CustomTabPanel from '../tabs/custom-tab-panel.jsx';

const styles = {
    title: (theme) => ({
        padding: theme.spacing(2),
    }),
    grid: (theme) => ({
        padding: theme.spacing(2),
    }),
    controlItem: (theme) => ({
        justifyContent: 'flex-end',
    }),
    button: (theme) => ({
        marginBottom: '30px',
    }),
};

export function useParameterState(paramName) {
    const intlRef = useIntlRef();

    const { enqueueSnackbar } = useSnackbar();

    const paramGlobalState = useSelector((state) => state[paramName]);

    const [paramLocalState, setParamLocalState] = useState(paramGlobalState);

    useEffect(() => {
        setParamLocalState(paramGlobalState);
    }, [paramGlobalState]);

    const handleChangeParamLocalState = useCallback(
        (value) => {
            setParamLocalState(value);
            updateConfigParameter(paramName, value).catch((error) => {
                setParamLocalState(paramGlobalState);
                displayErrorMessageWithSnackbar({
                    errorMessage: error.message,
                    enqueueSnackbar: enqueueSnackbar,
                    headerMessage: {
                        headerMessageId: 'paramsChangingError',
                        intlRef: intlRef,
                    },
                });
            });
        },
        [
            paramName,
            enqueueSnackbar,
            intlRef,
            setParamLocalState,
            paramGlobalState,
        ]
    );

    return [paramLocalState, handleChangeParamLocalState];
}

const ParametersDialog = ({ open, onClose }) => {
    const [tabIndex, setTabIndex] = useState(0);

    function GUITab() {
        return <Grid container spacing={2} sx={styles.grid} />;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h5" sx={styles.title}>
                    <FormattedMessage id="parameters-dialog-title" />
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Container maxWidth="md">
                    <Tabs
                        value={tabIndex}
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        onChange={(_event, newValue) => setTabIndex(newValue)}
                        aria-label="parameters"
                    >
                        <Tab label={<FormattedMessage id="gui" />} />
                    </Tabs>

                    <CustomTabPanel value={tabIndex} index={0}>
                        <GUITab />
                    </CustomTabPanel>

                    <Grid item xs={12}>
                        <Button
                            onClick={onClose}
                            variant="contained"
                            color="primary"
                            sx={styles.button}
                        >
                            <FormattedMessage id="close" />
                        </Button>
                    </Grid>
                </Container>
            </DialogContent>
        </Dialog>
    );
};

export default ParametersDialog;

ParametersDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
