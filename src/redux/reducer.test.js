/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { reducer } from './reducer.js';
import { getLocalStorageComputedLanguage, } from './local-storage.js';
import { SELECT_COMPUTED_LANGUAGE, SELECT_LANGUAGE, SELECT_THEME } from "./actions.js";
import { DARK_THEME, LANG_SYSTEM, LIGHT_THEME, LOGOUT_ERROR,
    RESET_AUTHENTICATION_ROUTER_ERROR, SHOW_AUTH_INFO_LOGIN, SIGNIN_CALLBACK_ERROR, UNAUTHORIZED_USER_INFO,
    USER_VALIDATION_ERROR
} from "@gridsuite/commons-ui";

it('should return the initial state', () => {
    const initialReducer = reducer(undefined, () => {});

    expect(initialReducer).toEqual({
        computedLanguage: getLocalStorageComputedLanguage(),
        user: null,
        signInCallbackError: null,
        authenticationRouterError: null,
        showAuthenticationRouterLogin: false,
        theme: DARK_THEME,
        language: LANG_SYSTEM,
    });
});

it('should handle SELECT_THEME', () => {
    const action = {
        type: SELECT_THEME,
        theme: LIGHT_THEME
    };
    expect(reducer({}, action)).toEqual({theme: LIGHT_THEME});
});

it('should handle SELECT_LANGUAGE', () => {
    const action = {
        type: SELECT_LANGUAGE,
        language: "Bambara"
    };
    expect(reducer({}, action)).toEqual({language: "Bambara"});
});

it('should handle SIGNIN_CALLBACK_ERROR', () => {
    const action = {
        type: SIGNIN_CALLBACK_ERROR,
        signInCallbackError: "Error while signing in"
    };
    expect(reducer({}, action)).toEqual({ signInCallbackError: "Error while signing in"});
});

it('should handle USER', () => {
    const action = {
        type: "USER",
        user: "CORESO"
    };
    expect(reducer({}, action)).toEqual({ user: "CORESO"});
});

it('should handle auth errors', () => {
    [UNAUTHORIZED_USER_INFO, LOGOUT_ERROR, USER_VALIDATION_ERROR].forEach(type => {
    const action = {
        type: type,
        authenticationRouterError: "Error while routing"
    };

    expect(reducer({}, action)).toEqual({ authenticationRouterError: "Error while routing" });
    });

    const reset = {
        type: RESET_AUTHENTICATION_ROUTER_ERROR,
    };

    expect(reducer({}, reset)).toEqual({ authenticationRouterError: null });
});

it('should handle SHOW_AUTH_INFO_LOGIN', () => {
    const action = {
        type: SHOW_AUTH_INFO_LOGIN,
        showAuthenticationRouterLogin: true
    };
    expect(reducer({}, action)).toEqual({ showAuthenticationRouterLogin: true});
});

it('should handle SELECT_COMPUTED_LANGUAGE', () => {
    const action = {
        type: SELECT_COMPUTED_LANGUAGE,
        computedLanguage: "Cocoliche"
    };
    expect(reducer({}, action)).toEqual({ computedLanguage: "Cocoliche"});
});
