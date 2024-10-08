/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useMatch,
    useNavigate,
} from 'react-router-dom';

import {
    selectComputedLanguage,
    selectLanguage,
    selectTheme,
} from '../redux/actions';

import {
    AuthenticationRouter,
    CardErrorBoundary,
    getPreLoginPath,
    initializeAuthenticationDev,
    initializeAuthenticationProd,
} from '@gridsuite/commons-ui';

import { FormattedMessage } from 'react-intl';
import Box from '@mui/material/Box';

import {
    connectNotificationsWsUpdateConfig,
    fetchConfigParameter,
    fetchConfigParameters,
    fetchIdpSettings,
} from '../utils/rest-api';
import {
    APP_NAME,
    COMMON_APP_NAME,
    PARAM_LANGUAGE,
    PARAM_THEME,
} from '../utils/config-params';
import { getComputedLanguage } from '../utils/language';
import { displayErrorMessageWithSnackbar, useIntlRef } from '../utils/messages';
import { useSnackbar } from 'notistack';
import AppTopBar from './app-top-bar';
import GridCapaMain from './gridcapa-main';
import { Views, getUrlWithTimestampAndView } from '../utils/view-utils';

const noUserManager = { instance: null, error: null };

const App = () => {
    const dispatch = useDispatch();
    const intlRef = useIntlRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    const user = useSelector((state) => state.user);
    const signInCallbackError = useSelector(
        (state) => state.signInCallbackError
    );
    const authenticationRouterError = useSelector(
        (state) => state.authenticationRouterError
    );
    const showAuthenticationRouterLogin = useSelector(
        (state) => state.showAuthenticationRouterLogin
    );

    const [userManager, setUserManager] = useState(noUserManager);
    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch({
            path: '/silent-renew-callback',
        })
    );
    const [initialMatchSigninCallbackUrl] = useState(
        useMatch({
            path: '/sign-in-callback',
        })
    );
    const [timestamp, setTimestamp] = useState(null);
    const [view, setView] = useState(Views.BUSINESS_DATE_VIEW);
    const [parametersEnabled, setParametersEnabled] = useState(false);

    const validateUser = (user) => Promise.resolve(true);

    useEffect(() => {
        (async function initializeAuthentication() {
            try {
                if (import.meta.env.VITE_USE_AUTHENTICATION === 'true') {
                    setUserManager({
                        instance: await initializeAuthenticationProd(
                            dispatch,
                            initialMatchSilentRenewCallbackUrl != null,
                            fetchIdpSettings,
                            validateUser,
                            initialMatchSigninCallbackUrl != null
                        ),
                        error: null,
                    });
                } else {
                    setUserManager({
                        instance: await initializeAuthenticationDev(
                            dispatch,
                            initialMatchSilentRenewCallbackUrl != null,
                            validateUser,
                            initialMatchSigninCallbackUrl != null
                        ),
                        error: null,
                    });
                }
            } catch (error) {
                setUserManager({ instance: null, error: error.message });
            }
        })();
    }, [
        dispatch,
        initialMatchSigninCallbackUrl,
        initialMatchSilentRenewCallbackUrl,
    ]);

    const updateParams = useCallback(
        (params) => {
            console.debug('received UI parameters : ', params);
            params.forEach((param) => {
                switch (param.name) {
                    case PARAM_THEME:
                        dispatch(selectTheme(param.value));
                        break;
                    case PARAM_LANGUAGE:
                        dispatch(selectLanguage(param.value));
                        dispatch(
                            selectComputedLanguage(
                                getComputedLanguage(param.value)
                            )
                        );
                        break;
                    default:
                }
            });
        },
        [dispatch]
    );

    const displayError = useCallback(
        (errorMessage) => {
            displayErrorMessageWithSnackbar({
                errorMessage: errorMessage,
                enqueueSnackbar: enqueueSnackbar,
                headerMessage: {
                    headerMessageId: 'paramsRetrievingError',
                    intlRef: intlRef,
                },
            });
        },
        [enqueueSnackbar, intlRef]
    );

    const connectNotificationsUpdateConfig = useCallback(() => {
        const ws = connectNotificationsWsUpdateConfig();

        ws.onmessage = (event) => {
            let eventData = JSON.parse(event.data);
            if (eventData.headers && eventData.headers['parameterName']) {
                fetchConfigParameter(eventData.headers['parameterName'])
                    .then((param) => updateParams([param]))
                    .catch((errorMessage) => displayError(errorMessage));
            }
        };

        ws.onerror = (event) => {
            console.error('Unexpected Notification WebSocket error', event);
        };

        return ws;
    }, [updateParams, displayError]);

    useEffect(() => {
        if (user !== null) {
            fetchConfigParameters(COMMON_APP_NAME)
                .then((params) => updateParams(params))
                .catch((errorMessage) => displayError(errorMessage));

            fetchConfigParameters(APP_NAME)
                .then((params) => updateParams(params))
                .catch((errorMessage) => displayError(errorMessage));

            const ws = connectNotificationsUpdateConfig();

            return () => {
                ws.close();
            };
        }
    }, [connectNotificationsUpdateConfig, displayError, updateParams, user]);

    const handleViewChange = (newValue) => {
        setView(newValue);
        const newUrl = getUrlWithTimestampAndView(timestamp, newValue);
        navigate(newUrl, {
            replace: true,
        });
    };

    const handleTimestampChange = (newTimestamp) => {
        setTimestamp(new Date(newTimestamp));
        const newUrl = getUrlWithTimestampAndView(newTimestamp, view);
        navigate(newUrl, {
            replace: true,
        });
    };

    return (
        <>
            <AppTopBar
                user={user}
                userManager={userManager}
                view={view}
                onViewChange={handleViewChange}
                parametersEnabled={parametersEnabled}
            />
            <CardErrorBoundary>
                {user !== null ? (
                    <Routes>
                        {[
                            '/',
                            '/date/:dateParam',
                            '/utcDate/:dateParam/utcTime/:timeParam',
                            '/global',
                        ].map((path) => (
                            <Route
                                key={path}
                                path={path}
                                element={
                                    <Box mt={1}>
                                        <GridCapaMain
                                            view={view}
                                            setView={setView}
                                            timestamp={timestamp}
                                            setTimestamp={setTimestamp}
                                            onTimestampChange={
                                                handleTimestampChange
                                            }
                                            setParametersEnabled={
                                                setParametersEnabled
                                            }
                                        />
                                    </Box>
                                }
                            />
                        ))}
                        <Route
                            path="sign-in-callback"
                            element={
                                <Navigate
                                    replace
                                    to={getPreLoginPath() || '/'}
                                />
                            }
                        />
                        <Route
                            path="logout-callback"
                            element={
                                <h1>
                                    Error: logout failed; you are still logged
                                    in.
                                </h1>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <h1>
                                    <FormattedMessage id="PageNotFound" />
                                </h1>
                            }
                        />
                    </Routes>
                ) : (
                    <AuthenticationRouter
                        userManager={userManager}
                        signInCallbackError={signInCallbackError}
                        authenticationRouterError={authenticationRouterError}
                        showAuthenticationRouterLogin={
                            showAuthenticationRouterLogin
                        }
                        dispatch={dispatch}
                        navigate={navigate}
                        location={location}
                    />
                )}
            </CardErrorBoundary>
        </>
    );
};

export default App;
