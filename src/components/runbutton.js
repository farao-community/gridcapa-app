import React from 'react';

const RunButton = ({ taskData }) => {
    let taskStatus = taskData === null ? 'Not created' : taskData.status;
    let taskTimestamp = taskData === null ? 'Not created' : taskData.timestamp;
    let id = 5;

    const launchTask = () => fetchRunButtonPost();

    function fetchRunButtonPost() {
        console.log("Call run for id " + id);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        fetch('http://localhost/core/valid/job/jobs/' + id, requestOptions)
            .then(response => response.json())
            .then();
    }

    return (
        <button disabled={taskStatus !== 'READY'} onClick={launchTask}>
            Run
        </button>
    );
};

export default RunButton;
