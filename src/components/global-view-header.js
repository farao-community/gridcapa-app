import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import dateFormat from 'dateformat';
import React, { useState } from 'react';

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

const GlobalViewHeader = ({
    timestampMin,
    timestampMax,
    timestampStep,
    onTimestampChange,
    processName,
}) => {
    const tableHeaderName = (processName || '') + ' Supervisor';
    const [localMinDate, setLocalMinDate] = useState(
        dateFormat(timestampMin, 'yyyy-mm-dd"T"HH:MM')
    );
    const [localMaxDate, setLocalMaxDate] = useState(
        dateFormat(timestampMax, 'yyyy-mm-dd"T"HH:MM')
    );
    const [rangeError, setRangeError] = useState(false);
    const [localStep, setLocalStep] = useState('01:00');
    const classes = useStyles();
    const handleDateChange = (event) => {
        let minDateAsNumber = Date.parse(localMinDate);
        let maxDateAsNumber = Date.parse(localMaxDate);
        let newValueAsNumber = Date.parse(event.target.value);
        if (event.target.id === 'dateMin') {
            setLocalMinDate(event.target.value);
            if (
                maxDateAsNumber > newValueAsNumber &&
                maxDateAsNumber - newValueAsNumber <= 2 * 24 * 60 * 60 * 1000
            ) {
                onTimestampChange(event.target.value, localMaxDate, localStep);
                setRangeError(false);
            } else {
                setRangeError(true);
            }
        } else if (event.target.id === 'dateMax') {
            setLocalMaxDate(event.target.value);
            if (
                newValueAsNumber > minDateAsNumber &&
                newValueAsNumber - minDateAsNumber <= 2 * 24 * 60 * 60 * 1000
            ) {
                onTimestampChange(localMinDate, event.target.value, localStep);
                setRangeError(false);
            } else {
                setRangeError(true);
            }
        } else if (event.target.id === 'timeStep') {
            setLocalStep(event.target.value);
            onTimestampChange(localMinDate, localMaxDate, event.target.value);
        }
    };

    return (
        <Grid container className={classes.container} style={{ height: '5vh' }}>
            <Grid item xs={3}>
                <Typography variant="body1">{tableHeaderName}</Typography>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        error={rangeError}
                        id="dateMin"
                        label={<FormattedMessage id="selectMinTimestampDate" />}
                        type="datetime-local"
                        defaultValue={localMinDate}
                        inputProps={{
                            'data-test': 'timestamp-date-min-picker',
                            max: localMaxDate,
                        }}
                        helperText={
                            rangeError && <FormattedMessage id="RangeError" />
                        }
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleDateChange}
                    />
                </form>
            </Grid>
            <Grid item xs={3}>
                <form noValidate>
                    <TextField
                        error={rangeError}
                        id="dateMax"
                        label={<FormattedMessage id="selectMaxTimestampDate" />}
                        type="datetime-local"
                        defaultValue={localMaxDate}
                        inputProps={{
                            'data-test': 'timestamp-date-max-picker',
                            min: localMinDate,
                        }}
                        helperText={
                            rangeError && <FormattedMessage id="RangeError" />
                        }
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={handleDateChange}
                    />
                </form>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="timeStep"
                    label={<FormattedMessage id="selectTimeStep" />}
                    type="time"
                    defaultValue={'01:00'}
                    inputProps={{
                        'data-test': 'timestamp-time-picker',
                        step: 3600,
                    }}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleDateChange}
                />
            </Grid>
        </Grid>
    );
};

export default GlobalViewHeader;
