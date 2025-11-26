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

export async function cleanUpOnExit(container, root) {
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

export function startOf2020Iso() {
    return new Date(Date.UTC(2020, 0, 1)).toISOString();
}
