/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as url from 'node:url';
import { createRequire } from 'node:module';

const serverSettings = {
    port: 3000,
    proxy: {
        '/api/gateway': {
            target: 'http://localhost:9000',
            rewrite: (path) => path.replace(/^\/api\/gateway/, ''),
        },
        '/ws/gateway': {
            target: 'http://localhost:9000',
            rewrite: (path) => path.replace(/^\/ws\/gateway/, ''),
            ws: true,
        },
        '/api/capa-server': {
            target: 'http://localhost:8080',
            rewrite: (path) => path.replace(/^\/api\/capa-server/, ''),
        },
        '/ws/capa-server': {
            target: 'http://localhost:8080',
            rewrite: (path) => path.replace(/^\/ws\/capa-server/, ''),
            ws: true,
        },
    },
};

// https://vitejs.dev/config/
export default defineConfig((config) => ({
    plugins: [
        react(),
        eslint({
            failOnWarning: config.mode !== 'development',
            lintOnStart: true,
        }),
        svgr(), // works on every import with the pattern "**/*.svg?react"
        reactVirtualized(),
    ],
    base: './',
    server: serverSettings, // for npm run start
    preview: serverSettings, // for npm run preview (use local build)
    build: {
        outDir: 'build',
    },
    define: {
        // "process.env": process.env,
        // // By default, Vite doesn't include shims for NodeJS/
        // // necessary for segment analytics lib to work
        global: {},
    },
}));

// Workaround for react-virtualized with vite
// https://github.com/bvaughn/react-virtualized/issues/1632#issuecomment-1483966063
function reactVirtualized() {
    const WRONG_CODE = `import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";`;
    return {
        name: 'flat:react-virtualized',
        // Note: we cannot use the `transform` hook here
        //       because libraries are pre-bundled in vite directly,
        //       plugins aren't able to hack that step currently.
        //       so instead we manually edit the file in node_modules.
        //       all we need is to find the timing before pre-bundling.
        configResolved: async () => {
            const require = createRequire(import.meta.url);
            const reactVirtualizedPath = require.resolve('react-virtualized');
            const { pathname: reactVirtualizedFilePath } = new url.URL(
                reactVirtualizedPath,
                import.meta.url
            );
            const file = reactVirtualizedFilePath.replace(
                path.join('dist', 'commonjs', 'index.js'),
                path.join(
                    'dist',
                    'es',
                    'WindowScroller',
                    'utils',
                    'onScroll.js'
                )
            );
            const code = await fs.readFile(file, 'utf-8');
            const modified = code.replace(WRONG_CODE, '');
            await fs.writeFile(file, modified);
        },
    };
}
