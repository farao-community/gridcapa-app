import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import dateFormat from 'dateformat';

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

const TableHeader = ({
    taskData,
    onSelectedDateChange,
    onSelectedTimeChange,
}) => {
    const classes = useStyles();
    const defaultTimestamp = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        30
    );
    let defaultDate = dateFormat(defaultTimestamp, 'yyyy-mm-dd');

    let defaultTime = dateFormat(defaultTimestamp, 'HH:MM');

    let taskStatus = taskData === null ? 'Not created' : taskData.status;

    return (
        <Grid container className={classes.container}>
            <Grid item xs={3}>
                <Typography variant="body1">
                    CSE D2CC Capacity Calculation Supervisor
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        id="date"
                        label={<FormattedMessage id="selectTimestampDate" />}
                        type="date"
                        defaultValue={defaultDate}
                        inputProps={{ 'data-test': 'timestamp-date-picker' }}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={onSelectedDateChange}
                    />
                </form>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        id="time"
                        label={<FormattedMessage id="selectTimestampTime" />}
                        type="time"
                        defaultValue={defaultTime}
                        inputProps={{
                            'data-test': 'timestamp-time-picker',
                            step: 3600,
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={onSelectedTimeChange}
                    />
                </form>
            </Grid>
            <Grid item xs={3}>
                <Chip data-test="timestamp-status" label={taskStatus} />
            </Grid>
        </Grid>
    );
};

export default TableHeader;
