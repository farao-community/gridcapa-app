import React from 'react';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';
import { fetchJobLauncherPost } from '../utils/rest-api';

const RunButton = ({ taskData }) => {
    let taskStatus = taskData === null ? 'Not created' : taskData.status;
    let taskTimestamp = taskData === null ? 'Not created' : taskData.timestamp;

    const launchTask = () => fetchJobLauncherPost(taskTimestamp);

    return (
        <Button
            color="primary"
            data-test="run-button"
            variant="contained"
            size="large"
            disabled={
                taskStatus !== 'READY' &&
                taskStatus !== 'SUCCESS' &&
                taskStatus !== 'ERROR'
            }
            onClick={launchTask}
        >
            <FormattedMessage id="runButtonLabel" />
        </Button>
    );
};

export default RunButton;
