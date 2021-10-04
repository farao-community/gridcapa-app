import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';


function inputDataRow(input) {
    return (
        <TableRow>
            <TableCell data-test="input-type">{input.type}</TableCell>
            <TableCell
                data-test="input-status"
                style={{ backgroundColor: 'grey', color: 'white' }}
            >
                Absent
            </TableCell>
            <TableCell data-test="input-filename">{input.url}</TableCell>
            <TableCell data-test="input-latest-modification"></TableCell>
        </TableRow>
    );
}
const OverviewTable = ({ taskData }) => {
    let inputs = taskData === null ? [] : taskData.inputFiles;
    return (
        <TableContainer component={Paper}>
            <Table className="table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage id="inputs" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="status" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="filename" />
                        </TableCell>
                        <TableCell>
                            <FormattedMessage id="latestModification" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {inputs.map((input) => inputDataRow(input))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default OverviewTable;
