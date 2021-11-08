import React from 'react';
import Button from '@material-ui/core/Button';

const RunButton = ({ taskData }) => {
    let taskStatus = taskData === null ? 'Not created' : taskData.status;
    let taskTimestamp = taskData === null ? 'Not created' : taskData.timestamp;

    const launchTask = () => fetchRunButtonPost();

    function fetchRunButtonPost() {
        console.log("Call run for task:" + taskTimestamp);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('http://localhost/core/valid/job/start/' + taskTimestamp, requestOptions)
            .then(response => response.json())
            .then();
    }

    return (
        <Button color="primary"
                variant="contained"
                size="large"
                disabled={taskStatus !== 'READY'}
                onClick={launchTask}>
            Run
        </Button>
    );
};

export default RunButton;
