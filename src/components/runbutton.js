import React from 'react';

const RunButton = ({ taskData }) => {
    let taskStatus = taskData === null ? 'Not created' : taskData.status;

    function launchTask() {
        // TODO: call gridcapa-job-launcher with taskId
    }

    return (
        <button disabled={taskStatus !== 'READY'} onClick={launchTask}>
            Run
        </button>
    );
};

export default RunButton;
