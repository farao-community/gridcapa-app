import React from 'react';

const RunButton = ({ taskData, gridCapaJobLauncherUrl }) => {
    let taskStatus = taskData === null ? 'Not created' : taskData.status;
    let taskTimestamp = taskData === null ? 'Not created' : taskData.timestamp;

    function launchTask() {
        const request = new Request(gridCapaJobLauncherUrl + 'jobs/', {
            method: 'POST',
            body: JSON.stringify({
                id: taskTimestamp,
            }),
        });
        fetch(request)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.log(response.status);
                    throw new Error('Something went wrong on api server!');
                }
            })
            .then((response) => {
                console.debug(response);
                // ...
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <button disabled={taskStatus !== 'READY'} onClick={launchTask}>
            Run
        </button>
    );
};

export default RunButton;
