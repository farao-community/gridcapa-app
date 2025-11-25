/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
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
    ThemeProvider,
    StyledEngineProvider,
} from '@mui/material/styles';
import { CardErrorBoundary, SnackbarProvider } from '@gridsuite/commons-ui';
import CssBaseline from '@mui/material/CssBaseline';
import { RunButton } from './run-button.jsx';

let container = null;
let root = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
});

afterEach(() => {
    // cleanup on exiting
    container.remove();
    container = null;
});

it('renders run button when disabled', async () => {
    let timestamp = new Date(Date.UTC(2020, 0, 1)).toISOString();
    await act(async () =>
        root.render(
            <IntlProvider locale="en">
                <BrowserRouter>
                    <Provider store={store}>
                        <StyledEngineProvider injectFirst>
                            <ThemeProvider theme={createTheme({})}>
                                <SnackbarProvider hideIconVariant={false}>
                                    <CssBaseline />
                                    <CardErrorBoundary>
                                        <RunButton
                                            status="SUCCESS"
                                            timestamp={timestamp}
                                        />
                                    </CardErrorBoundary>
                                </SnackbarProvider>
                            </ThemeProvider>
                        </StyledEngineProvider>
                    </Provider>
                </BrowserRouter>
            </IntlProvider>
        )
    );

    expect(container.innerHTML).toContain('run-button-1577836800000');
    act(() => {
        root.unmount();
        root = null;
    });
});

it('renders run button when running', async () => {
    let timestamp = new Date(Date.UTC(2020, 0, 1)).toISOString();
    await act(async () =>
        root.render(
            <IntlProvider locale="en">
                <BrowserRouter>
                    <Provider store={store}>
                        <StyledEngineProvider injectFirst>
                            <ThemeProvider theme={createTheme({})}>
                                <SnackbarProvider hideIconVariant={false}>
                                    <CssBaseline />
                                    <CardErrorBoundary>
                                        <RunButton
                                            status="RUNNING"
                                            timestamp={timestamp}
                                        />
                                    </CardErrorBoundary>
                                </SnackbarProvider>
                            </ThemeProvider>
                        </StyledEngineProvider>
                    </Provider>
                </BrowserRouter>
            </IntlProvider>
        )
    );

    expect(container.innerHTML).not.toContain('run-button-');
    act(() => {
        root.unmount();
        root = null;
    });
});
