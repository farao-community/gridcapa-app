/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { store } from '../redux/store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from '@gridsuite/commons-ui';
import CssBaseline from '@material-ui/core/CssBaseline';

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it('renders', async () => {
    await act(async () =>
        render(
            <IntlProvider locale="en">
                <BrowserRouter>
                    <Provider store={store}>
                        <ThemeProvider theme={createMuiTheme({})}>
                            <SnackbarProvider hideIconVariant={false}>
                                <CssBaseline />
                                <App />
                            </SnackbarProvider>
                        </ThemeProvider>
                    </Provider>
                </BrowserRouter>
            </IntlProvider>,
            container
        )
    );

    expect(container.textContent).toContain('GridCapa');
});
