import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { AppBar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import OverviewTable from './overview-table';
import EventsTable from "./events-table";

import RunButton from './runbutton';
import { FormattedMessage } from 'react-intl';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TableCore = ({ taskData }) => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <AppBar position="static" color="transparent">
                <Tabs value={value} onChange={handleChange} variant="fullWidth">
                    <Tab
                        label={<FormattedMessage id="overview" />}
                        {...a11yProps(0)}
                    />
                    <Tab
                        label={<FormattedMessage id="events" />}
                        {...a11yProps(1)}
                    />
                    <Tab
                        label={<FormattedMessage id="artifacts" />}
                        {...a11yProps(2)}
                        disabled
                    />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <OverviewTable taskData={taskData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <EventsTable taskData={taskData} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
            <RunButton taskData={taskData} />
        </div>
    );
};

export default TableCore;
