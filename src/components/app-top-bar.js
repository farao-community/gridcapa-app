/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { fetchAppsAndUrls } from '../utils/rest-api';

import { logout, TopBar } from '@gridsuite/commons-ui';
import ParametersDialog, {
    useParameterState,
} from './dialogs/parameters-dialog';
import { APP_NAME, PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';
import { ReactComponent as FaraoLogo } from '../images/farao-logo.svg';
import AboutDialog from './dialogs/about-dialog';
import ViewTabs from './tabs/view-tabs';
import ParametersButton from './buttons/parameters-button';
import MinioDiskUsage from './minio-disk-usage';
import { Box } from '@mui/material';

const AppTopBar = ({
    user,
    userManager,
    view,
    onViewChange,
    parametersEnabled,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] =
        useParameterState(PARAM_LANGUAGE);

    const [appsAndUrls, setAppsAndUrls] = useState([]);
    const [showParameters, setShowParameters] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    useEffect(() => {
        if (user !== null) {
            fetchAppsAndUrls().then((res) => {
                setAppsAndUrls(res);
            });
        }
    }, [user]);

    const handleShowParameters = () => {
        setShowParameters(true);
    };

    const handleHideParameters = () => {
        setShowParameters(false);
    };

    const handleShowAbout = () => {
        setShowAbout(true);
    };

    const handleHideAbout = () => {
        setShowAbout(false);
    };

    const handleLogoClicked = () => {
        navigate('/', { replace: true });
    };

    return (
        <>
            <TopBar
                appName={APP_NAME}
                appColor="grey"
                appLogo={<FaraoLogo />}
                onParametersClick={handleShowParameters}
                onLogoutClick={() => logout(dispatch, userManager.instance)}
                onLogoClick={handleLogoClicked}
                user={user}
                appsAndUrls={appsAndUrls}
                onAboutClick={handleShowAbout}
                onThemeClick={handleChangeTheme}
                theme={themeLocal}
                onLanguageClick={handleChangeLanguage}
                language={languageLocal}
            >
                {user && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                    >
                        <ViewTabs view={view} onViewChange={onViewChange} />
                        <Box margin="0 50px">
                            <MinioDiskUsage />
                        </Box>
                        {parametersEnabled && <ParametersButton />}
                    </Box>
                )}
            </TopBar>
            <ParametersDialog
                open={showParameters}
                onClose={handleHideParameters}
            />
            <AboutDialog open={showAbout} onClose={handleHideAbout} />
        </>
    );
};

AppTopBar.propTypes = {
    user: PropTypes.object,
    userManager: PropTypes.object.isRequired,
    view: PropTypes.number.isRequired,
    onViewChange: PropTypes.func.isRequired,
    parametersEnabled: PropTypes.bool.isRequired,
};

export default AppTopBar;
