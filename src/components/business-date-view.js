/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, {useCallback, useEffect} from "react";

import Grid from "@material-ui/core/Grid";
import TableCoreBusinessView from "./table-core-business-view";
import TableHeaderBusinessView from "./table-header-business-view";
import {fetchBusinessDateData} from "../utils/rest-api";
import {displayErrorMessageWithSnackbar, useIntlRef} from "../utils/messages";
import {useSnackbar} from "notistack";
import {getDay, getMonth} from "./commons";

const BusinessDateView = () => {
    const intlRef = useIntlRef();
    const { enqueueSnackbar } = useSnackbar();
    const [ListTasksData, setListTasksData] = React.useState([]);
    const [processMetadata, setProcessMetadata] = React.useState(null);
    const defaultBusinessDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
    );
    const [businessDate, setBusinessDate] = React.useState(defaultBusinessDate);

    useEffect(() => {
        if (processMetadata === null) {
            fetch('process-metadata.json')
                .then((res) => res.json())
                .then((res) => {
                    setProcessMetadata(res);
                });
        }
    });

    const updateSelectedBusinessDateData = useCallback(

        (businessDate) => {
            let date = businessDate.getFullYear() + '-' + getMonth(businessDate) + '-' + getDay(businessDate);
                fetchBusinessDateData(date)
                .then(data => { setListTasksData(data)})
                .catch((errorMessage) =>
                    displayErrorMessageWithSnackbar({
                        errorMessage: errorMessage,
                        enqueueSnackbar: enqueueSnackbar,
                        headerMessage: {
                            headerMessageId: 'taskRetrievingError',
                            intlRef: intlRef,
                        },
                    })
                );
        },
        [ListTasksData, enqueueSnackbar, intlRef]
    );

    useEffect(() => {
        if (ListTasksData === null) {
            updateSelectedBusinessDateData(businessDate);
        }
    }, [ListTasksData, updateSelectedBusinessDateData, businessDate]);

    const updateSelectedDate = useCallback(
        (event) => {
            const date = event.target.value;
            let newBusinessDate = businessDate;
            newBusinessDate.setDate(date.substr(8, 2));
            newBusinessDate.setMonth(date.substr(5, 2) - 1);
            newBusinessDate.setFullYear(date.substr(0, 4));
            setBusinessDate(newBusinessDate);
            updateSelectedBusinessDateData(newBusinessDate);
        },
        [businessDate, setBusinessDate]
    );

    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeaderBusinessView
                    processMetadata={processMetadata}
                    onSelectedDateChange={updateSelectedDate}
                />
            </Grid>
            <Grid item>
                <TableCoreBusinessView listTasksData={ListTasksData}/>
            </Grid>
        </Grid>
    )

};

export default BusinessDateView;
