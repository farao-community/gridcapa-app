/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const styles = {
    container: (theme) => ({
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3),
        display: 'flex',
        flexWrap: 'wrap',
    }),
    textField: (theme) => ({
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        width: 200,
    }),
};

const TableHeaderRunningTasksView = ({ processName }) => {
    const tableHeaderName = (processName || '') + ' Supervisor';

    return (
        <Grid container sx={styles.container}>
            <Grid item xs={3}>
                <Typography variant="body1">{tableHeaderName}</Typography>
            </Grid>
        </Grid>
    );
};
export default TableHeaderRunningTasksView;
