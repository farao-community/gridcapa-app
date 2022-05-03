/**
 * Copyright (c) 2020, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PARAM_LANGUAGE } from '../utils/config-params';

export const SELECT_THEME = 'SELECT_THEME';

export function selectTheme(theme) {
    return { type: SELECT_THEME, theme: theme };
}

export const SELECT_LANGUAGE = 'SELECT_LANGUAGE';

export function selectLanguage(language) {
    return { type: SELECT_LANGUAGE, [PARAM_LANGUAGE]: language };
}

export const SELECT_COMPUTED_LANGUAGE = 'SELECT_COMPUTED_LANGUAGE';

export function selectComputedLanguage(computedLanguage) {
    return {
        type: SELECT_COMPUTED_LANGUAGE,
        computedLanguage: computedLanguage,
    };
}

export const SELECT_WEBSOCKET_HANDLING_METHOD = 'SELECT_WEBSOCKET_HANDLING_METHOD';

export function selectWebSocketHandlingMethod(webSocketHandlingMethod) {
    return {
        type: SELECT_WEBSOCKET_HANDLING_METHOD,
        payload: webSocketHandlingMethod,
    };
}

export const CREATE_WEBSOCKET = 'CREATE_WEBSOCKET';

export function createWebsocket(ws) {
    return {
        type: CREATE_WEBSOCKET,
        payload: ws,
    };
}