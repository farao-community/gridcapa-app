/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
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
    getPreLoginPath,
    initializeAuthenticationProd,
    initializeAuthenticationDev,
} from '@gridsuite/commons-ui';

import { FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';

import {
    fetchConfigParameter,
    fetchConfigParameters,
    getWebSocketUrl,
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
import useWebSocket from 'react-use-websocket';

const noUserManager = { instance: null, error: null };
const resolver = { resolve: null };

const App = () => {
    const intlRef = useIntlRef();

    const { enqueueSnackbar } = useSnackbar();

    const user = useSelector((state) => state.user);

    const signInCallbackError = useSelector(
        (state) => state.signInCallbackError
    );

    const [userManager, setUserManager] = useState(noUserManager);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const location = useLocation();

    const readyUrl = useCallback(() => {
        return new Promise((resolve) => {
            resolver.resolve = resolve;
        });
    }, []);

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

    const onConfigEvent = (event) => {
        let eventData = JSON.parse(event.data);
        if (eventData.headers && eventData.headers['parameterName']) {
            fetchConfigParameter(eventData.headers['parameterName'])
                .then((param) => updateParams([param]))
                .catch((errorMessage) => displayError(errorMessage));
        }
    };

    // Can't use lazy initializer because useMatch is a hook
    const [initialMatchSilentRenewCallbackUrl] = useState(
        useMatch({
            path: '/silent-renew-callback',
        })
    );

    const initialize = useCallback(() => {
        if (process.env.REACT_APP_USE_AUTHENTICATION === 'true') {
            return initializeAuthenticationProd(
                dispatch,
                initialMatchSilentRenewCallbackUrl != null,
                fetch('idpSettings.json')
            );
        } else {
            return initializeAuthenticationDev(
                dispatch,
                initialMatchSilentRenewCallbackUrl != null
            );
        }
        // Note: initialMatchSilentRenewCallbackUrl and dispatch don't change
    }, [initialMatchSilentRenewCallbackUrl, dispatch]);

    useEffect(() => {
        initialize()
            .then((requestedUserManager) => {
                setUserManager({ instance: requestedUserManager, error: null });
                requestedUserManager.getUser().then((CheckedUser) => {
                    if (
                        CheckedUser == null &&
                        initialMatchSilentRenewCallbackUrl == null
                    ) {
                        requestedUserManager.signinSilent().catch((error) => {
                            const oidcHackReloaded =
                                'gridsuite-oidc-hack-reloaded';
                            if (
                                !sessionStorage.getItem(oidcHackReloaded) &&
                                error.message ===
                                    'authority mismatch on settings vs. signin state'
                            ) {
                                sessionStorage.setItem(oidcHackReloaded, true);
                                console.log(
                                    'Hack oidc, reload page to make login work'
                                );
                                window.location.reload();
                            }
                        });
                    }
                });
            })
            .catch(function (error) {
                setUserManager({ instance: null, error: error.message });
                console.debug('error when importing the idp settings');
            });
        // Note: initialize and initialMatchSilentRenewCallbackUrl won't change
    }, [initialize, initialMatchSilentRenewCallbackUrl]);

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

    useEffect(() => {
        if (user !== null) {
            fetchConfigParameters(COMMON_APP_NAME)
                .then((params) => updateParams(params))
                .catch((errorMessage) => displayError(errorMessage));

            fetchConfigParameters(APP_NAME)
                .then((params) => updateParams(params))
                .catch((errorMessage) => displayError(errorMessage));
            resolver.resolve(getWebSocketUrl('config'));
        }
    }, [user, dispatch, updateParams, enqueueSnackbar, intlRef, displayError]);

    useWebSocket(readyUrl, {
        shouldReconnect: (_closeEvent) => true,
        onMessage: onConfigEvent,
        onError: (event) => {
            console.error('Unexpected Notification WebSocket error', event);
        },
    });

    return (
        <>
            <AppTopBar user={user} userManager={userManager} />
            {user !== null ? (
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Box mt={1}>
                                <GridCapaMain />
                            </Box>
                        }
                    />
                    <Route
                        path="sign-in-callback"
                        element={
                            <Navigate replace to={getPreLoginPath() || '/'} />
                        }
                    />
                    <Route
                        path="logout-callback"
                        element={
                            <h1>
                                Error: logout failed; you are still logged in.
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
                    dispatch={dispatch}
                    history={navigate}
                    location={location}
                />
            )}
        </>
    );
};

export default App;
