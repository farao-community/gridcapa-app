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
import FileSummary from './file-summary.jsx';
import GridcapaLogoText from './gridcapa-logo-text.jsx';

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

    if (root) {
        act(() => {
            root.unmount();
        });
        root = null;
    }
});

it('renders logo', async () => {
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
                                        <GridcapaLogoText />
                                    </CardErrorBoundary>
                                </SnackbarProvider>
                            </ThemeProvider>
                        </StyledEngineProvider>
                    </Provider>
                </BrowserRouter>
            </IntlProvider>
        )
    );

    expect(document.getElementsByTagName('h4').item(0).innerHTML).toContain(
        'Grid'
    );
    expect(document.getElementsByTagName('h4').item(0).innerHTML).toContain(
        'Capa'
    );
});
