import React from "react";
import {Grid, Tab, Tabs} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import ProcessTimestampView from "./process-timestamp-view";

const GridCapaMain = () => {
    const [value, setValue] = React.useState(-1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container>
            <Tabs
                value={value}
                onChange={handleChange}
                orientation="vertical"
                >
                <Tab label={<FormattedMessage id="Timestamp view" />}
                     data-test="timestamp-view"
                />
                <Tab label={<FormattedMessage id="Business view" />}
                     data-test="business-view"
                />
            </Tabs>
            {value === 0 && <ProcessTimestampView id={'timestamp-view-tab'} />}
            {value === 1 && <ProcessTimestampView id={'business-view'} />}
        </Grid>
    );
}

export default GridCapaMain;