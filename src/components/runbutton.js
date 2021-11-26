import React from 'react';
import Button from '@material-ui/core/Button';

const RunButton = ({ taskData, jobLauncherUrl }) => {
    let taskStatus = taskData === null ? 'Not created' : taskData.status;
    let taskTimestamp = taskData === null ? 'Not created' : taskData.timestamp;

    const launchTask = () => fetchRunButtonPost();

    function fetchRunButtonPost() {
        console.log('Call run for task:' + taskTimestamp);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch(
            document.baseURI + 'gridcapa-job-launcher/start/' + taskTimestamp,
            requestOptions
        )
            .then((response) => response.json())
            .then();
    }

    return (
        <Button
            color="primary"
            inputProps={{
                'data-test': 'run-button',
            }}
            variant="contained"
            size="large"
            disabled={taskStatus !== 'READY'}
            onClick={launchTask}
        >
            Run
        </Button>
    );
};

export default RunButton;
