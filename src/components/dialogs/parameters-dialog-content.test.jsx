/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
    cleanUpOnExit,
    renderComponent,
    setupTestContainer,
} from '../../utils/test-utils.js';
import ParametersDialogContent from './parameters-dialog-content.jsx';

let container = null;
let root = null;
beforeEach(() => {
    ({ container, root } = setupTestContainer());
});

afterEach(() => cleanUpOnExit(container, root));

it('renders parameters dialog', async () => {
    const onChange = jest.fn();

    const params = [
        {
            sectionOrder: 1,
            name: 'name1',
            sectionTitle: 'Title1',
            value: null,
            defaultValue: 500,
            processValue: null,
            parameterType: 'INT',
            handleChange: jest.fn(),
            reference: 'aaaa',
        },
        {
            sectionOrder: 1,
            name: 'name2',
            sectionTitle: 'Title1',
            value: true,
            defaultValue: false,
            processValue: null,
            parameterType: 'BOOLEAN',
            handleChange: jest.fn(),
            reference: 'aaaa',
        },
        {
            sectionOrder: 2,
            name: 'name3',
            sectionTitle: 'Title2',
            value: 'evkiubrui',
            defaultValue: 'olirgequi',
            processValue: 'gyuoigfbkji',
            parameterType: 'STRING',
            handleChange: jest.fn(),
            reference: 'aaaa',
        },
    ];

    await renderComponent(
        <ParametersDialogContent
            parameters={params}
            setParametersChanged={onChange}
            reference={'a'}
        />,
        root
    );

    ['1', '2', '3'].forEach((ordinal) => {
        expect(container.innerHTML).toContain('name' + ordinal);
    });

    expect(container.innerHTML).not.toContain('Error message');
});
