/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const config = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^.+\\.svg\\?react$': '<rootDir>/src/__mocks__/svgrMock.js',
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
        'node_modules/(?!dateformat|@gridsuite/commons-ui|react-dnd|dnd-core|@react-dnd)',
    ], // transform from ESM
    moduleDirectories: ['node_modules', 'src'], // to allow absolute path from ./src
    globals: {
        IS_REACT_ACT_ENVIRONMENT: true,
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
};

export default config;
