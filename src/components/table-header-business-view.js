/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {makeStyles} from "@material-ui/core/styles";
import dateFormat from "dateformat";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {FormattedMessage} from "react-intl";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        width: 200,
    },
}));

const TableHeaderBusinessView = (
    {
        processMetadata,
        onSelectedDateChange,
    }
) => {
    const classes = useStyles();
    const defaultTimestamp = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
    );
    let defaultDate = dateFormat(defaultTimestamp, 'yyyy-mm-dd');
    let tableHeaderName =
        processMetadata === null
            ? ''
            : processMetadata.processName + ' Supervisor';

    return (
        <Grid container className={classes.container}>
            <Grid item xs={3}>
                <Typography variant="body1">{tableHeaderName}</Typography>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        id="date"
                        label={<FormattedMessage id="selectTimestampDate"/>}
                        type="date"
                        defaultValue={defaultDate}
                        inputProps={{'data-test': 'timestamp-date-picker'}}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={onSelectedDateChange}
                    />
                </form>
            </Grid>
        </Grid>
    );
};
export default TableHeaderBusinessView;