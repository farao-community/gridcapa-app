import React from "react";
import Grid from "@material-ui/core/Grid";
import TableHeader from "./table-header";
import TableCore from "./table-core";

const ProcessTimestampView = () => {
    return (
        <Grid container direction="column">
            <Grid item>
                <TableHeader />
            </Grid>
            <Grid item>
                <TableCore />
            </Grid>
        </Grid>
    )
}

export default ProcessTimestampView;