/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const FileSummary = ({ type, listOfFile }) => {
    return (
        <div>
            {type}&nbsp;:&nbsp;&nbsp;&nbsp;
            {listOfFile.filter((file) => file.processFileStatus === 'VALIDATED')
                .length +
                '\u00a0/\u00a0' +
                listOfFile.length}
        </div>
    );
};

export default FileSummary;
