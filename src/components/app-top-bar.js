/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useEffect, useState } from 'react';

import { logout, TopBar } from '@gridsuite/commons-ui';
import ParametersDialog, {
    useParameterState,
} from './dialogs/parameters-dialog';
import { APP_NAME, PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';
import { useDispatch } from 'react-redux';
import { fetchAppsAndUrls } from '../utils/rest-api';
import PropTypes from 'prop-types';
import { ReactComponent as FaraoLogo } from '../images/farao-logo.svg';
import { useNavigate } from 'react-router-dom';
import AboutDialog from './dialogs/about-dialog';

const AppTopBar = ({ user, userManager }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [themeLocal, handleChangeTheme] = useParameterState(PARAM_THEME);
    const [languageLocal, handleChangeLanguage] = useParameterState(
        PARAM_LANGUAGE
    );

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

    const onLogoClicked = () => {
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
                onLogoClick={onLogoClicked}
                user={user}
                appsAndUrls={appsAndUrls}
                onAboutClick={handleShowAbout}
                onThemeClick={handleChangeTheme}
                theme={themeLocal}
                onLanguageClick={handleChangeLanguage}
                language={languageLocal}
            />
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
};

export default AppTopBar;
