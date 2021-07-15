import React from "react";
import Chip from '@material-ui/core/Chip';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export default function TableHeader() {
    const classes = useStyles();

    return (
        <Grid container justifyContent="center">
            <Grid item>
                <Typography variant="body1">
                    CSE D2CC Capacity Calculation Supervisor
                </Typography>
            </Grid>
            <Grid item>
                <form className={classes.container} noValidate>
                    <TextField
                        id="date"
                        label="Select timestamp date"
                        type="date"
                        data-test="date-picker"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </form>
            </Grid>
            <Grid item>
                <form className={classes.container} noValidate>
                    <TextField
                        id="time"
                        label="Select timestamp hour"
                        type="time"
                        defaultValue="00:30"
                        data-test="hour-picker"
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 3600,
                        }}
                    />
                </form>
            </Grid>
            <Grid item>
                <Chip data-test="timestamp-status" label="Not created" />
            </Grid>
        </Grid>
    );
}