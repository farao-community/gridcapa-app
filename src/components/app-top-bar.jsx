/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
    fetchAppsAndUrls,
    fetchVersionAndEnvironnement,
} from '../utils/rest-api';

import { logout, TopBar } from '@gridsuite/commons-ui';
import ParametersDialog, {
    useParameterState,
} from './dialogs/parameters-dialog';
import { APP_NAME, PARAM_LANGUAGE, PARAM_THEME } from '../utils/config-params';
import FaraoLogo from '../images/farao-logo.svg?react';
import ViewTabs from './tabs/view-tabs';
import ParametersButton from './buttons/parameters-button';
import MinioDiskUsage from './minio-disk-usage';
import { Box, IconButton } from '@mui/material';
import AppPackage from '../../package.json';
import GridcapaLogoText from './gridcapa-logo-text';
import MenuBookIcon from '@mui/icons-material/MenuBook';

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
    const [displayDocumentationButton, setDisplayDocumentationButton] =
        useState(false);
    const [documentationUrl, setDocumentationUrl] = useState('#');

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

    const handleLogoClicked = () => {
        navigate('/', { replace: true });
    };

    const handleDocumentationClick = () => {
        window.open(documentationUrl);
    };

    useEffect(() => {
        console.log('Fetching documentation config...');
        fetch('documentation-config.json')
            .then((res) => res.json())
            .then((res) => {
                setDisplayDocumentationButton(
                    res.displayDocumentationButton || false
                );
                setDocumentationUrl(res.documentationUrl || '#');
            });
    }, []);

    return (
        <>
            <TopBar
                appName={APP_NAME}
                appColor="grey"
                appLogo={<FaraoLogo />}
                appVersion={AppPackage.version}
                logoAboutDialog={<GridcapaLogoText />}
                onParametersClick={handleShowParameters}
                onLogoutClick={() => logout(dispatch, userManager.instance)}
                onLogoClick={handleLogoClicked}
                user={user}
                appsAndUrls={appsAndUrls}
                onThemeClick={handleChangeTheme}
                theme={themeLocal}
                onLanguageClick={handleChangeLanguage}
                language={languageLocal}
                globalVersionPromise={fetchVersionAndEnvironnement}
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

                        {displayDocumentationButton && (
                            <IconButton onClick={handleDocumentationClick}>
                                <MenuBookIcon />
                            </IconButton>
                        )}
                    </Box>
                )}
            </TopBar>
            <ParametersDialog
                open={showParameters}
                onClose={handleHideParameters}
            />
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
