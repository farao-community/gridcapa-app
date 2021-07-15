import React from "react";
import Grid from "@material-ui/core/Grid";
import TableHeader from "./table-header";
import TableCore from "./table-core";

const ProcessTimestampView = () => {
    return (
        <Grid container>
            <TableHeader />
            <TableCore />
        </Grid>
    )
}

export default ProcessTimestampView;