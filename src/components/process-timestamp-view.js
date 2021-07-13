import React from "react";

const ProcessTimestampView = (props) => {
    return(
        <div data-test={props.id}>
            {props.id}
        </div>
    );
}

export default ProcessTimestampView;