/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../redux/store';
import {
    createTheme,
    StyledEngineProvider,
    ThemeProvider,
} from '@mui/material/styles';
import { Client } from '@stomp/stompjs';
import { CardErrorBoundary, SnackbarProvider } from '@gridsuite/commons-ui';
import CssBaseline from '@mui/material/CssBaseline';

export async function renderComponent(component, root) {
    return act(async () =>
        root.render(
            <IntlProvider locale="en">
                <BrowserRouter>
                    <Provider store={store}>
                        <StyledEngineProvider injectFirst>
                            <ThemeProvider theme={createTheme({})}>
                                <SnackbarProvider hideIconVariant={false}>
                                    <CssBaseline />
                                    <CardErrorBoundary>
                                        {component}
                                    </CardErrorBoundary>
                                </SnackbarProvider>
                            </ThemeProvider>
                        </StyledEngineProvider>
                    </Provider>
                </BrowserRouter>
            </IntlProvider>
        )
    );
}

export function setupTestContainer() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    return { container, root: createRoot(container) };
}

export function cleanUpOnExit(container, root) {
    if (container) {
        container.remove();
        container = null;
    }
    if (root) {
        act(() => {
            root.unmount();
        });
        root = null;
    }
}

export function firstButtonOf(container) {
    return container.getElementsByTagName('button').item(0);
}

export function startOf2020IsoStr() {
    return new Date(Date.UTC(2020, 0, 1)).toISOString();
}

export const START_2020_AS_NUMERAL_STRING = '1577836800000';

export function mockWebSocketClient() {
    return new Client({
        brokerURL: 'aaaa',
        connectionTimeout: 3000,
        onConnect: () => {
            console.info('Connected task-notification Websocket with URL: ');
        },
        onStompError: (error) =>
            console.error(
                'Error occurred in task-notification Stomp with URL: '
            ),
        onWebSocketError: (error) =>
            console.error(
                'Error occurred in task-notification Websocket with URL: '
            ),
        close: () => console.log('close'),
    });
}
