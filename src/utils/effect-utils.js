/**
 * Copyright (c) 2025, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export function enableManualExportEffect(setManualExportEnabled) {

    async function getManualExportEnabled() {
        try {
            const response = await fetch('process-metadata.json');
            const data = await response.json();
            setManualExportEnabled(data.manualExportEnabled || false);
        } catch (error) {
            console.error('An error has occurred:', error);
        }
    }

    getManualExportEnabled();
}

export function applyTimestampFilterEffect(setTimestampFilter, setTimestampFilterRef) {
    async function getTimestampFilter() {
        let filter = await fetch('process-metadata.json')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                return res.globalViewTimestampFilter;
            });
        setTimestampFilter(filter);
        setTimestampFilterRef(filter);
    }

    getTimestampFilter();

}